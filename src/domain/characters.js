const TALENT_TYPE_HINT = 'talentdata';
function looksLikeTalentArray(value) {
    if (!Array.isArray(value) || !value.length)
        return false;
    const first = value[0];
    if (!first || typeof first !== 'object')
        return false;
    const typed = first;
    if ('$type' in typed && typeof typed.$type === 'string' && typed.$type.toLowerCase().includes(TALENT_TYPE_HINT))
        return true;
    if ('firstNameId' in typed && 'lastNameId' in typed)
        return true;
    if ('professions' in typed && typed.professions && typeof typed.professions === 'object' && 'Actor' in typed.professions) {
        return true;
    }
    return false;
}
export function extractCharacters(root) {
    if (looksLikeTalentArray(root))
        return root;
    if (root && typeof root === 'object' && looksLikeTalentArray(root.characters)) {
        return root.characters ?? null;
    }
    const visited = new WeakSet();
    const queue = [root];
    let guard = 0;
    while (queue.length && guard++ < 100000) {
        const current = queue.shift();
        if (!current || typeof current !== 'object')
            continue;
        if (visited.has(current))
            continue;
        visited.add(current);
        if (Array.isArray(current)) {
            if (looksLikeTalentArray(current))
                return current;
            queue.push(...current);
            continue;
        }
        for (const value of Object.values(current)) {
            if (looksLikeTalentArray(value))
                return value;
            queue.push(value);
        }
    }
    return null;
}
export const isActorEntry = (entity) => Boolean(entity.professions && 'Actor' in entity.professions);
export const isRoleEntry = (role) => {
    return (entity) => Boolean(entity.professions && role in entity.professions);
};
export const isExecutiveEntry = (entity) => {
    const professions = entity.professions;
    if (!professions)
        return false;
    return Object.keys(professions).some((key) => key.startsWith('Lieut') || key.startsWith('Cpt'));
};
export function isPlayerStudioEntity(entity) {
    const studio = entity?.studioId;
    return studio != null && String(studio) === 'PL';
}
