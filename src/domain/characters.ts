import { TalentData, SaveRoot } from '../types/save';

type Predicate = (entity: TalentData) => boolean;

const TALENT_TYPE_HINT = 'talentdata';

function looksLikeTalentArray(value: unknown): value is TalentData[] {
  if (!Array.isArray(value) || !value.length) return false;
  const first = value[0];
  if (!first || typeof first !== 'object') return false;
  const typed = first as TalentData;
  if ('$type' in typed && typeof typed.$type === 'string' && typed.$type.toLowerCase().includes(TALENT_TYPE_HINT)) return true;
  if ('firstNameId' in typed && 'lastNameId' in typed) return true;
  if ('professions' in typed && typed.professions && typeof typed.professions === 'object' && 'Actor' in typed.professions) {
    return true;
  }
  return false;
}

export function extractCharacters(root: unknown): TalentData[] | null {
  if (looksLikeTalentArray(root)) return root;
  if (root && typeof root === 'object' && looksLikeTalentArray((root as SaveRoot).characters)) {
    return (root as SaveRoot).characters ?? null;
  }

  const visited = new WeakSet<object>();
  const queue: unknown[] = [root];
  let guard = 0;

  while (queue.length && guard++ < 100_000) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      if (looksLikeTalentArray(current)) return current;
      queue.push(...current);
      continue;
    }

    for (const value of Object.values(current)) {
      if (looksLikeTalentArray(value)) return value;
      queue.push(value);
    }
  }
  return null;
}

export const isActorEntry: Predicate = (entity) => Boolean(entity.professions && 'Actor' in entity.professions);

export const isRoleEntry = (role: string): Predicate => {
  return (entity) => Boolean(entity.professions && role in entity.professions);
};

export const isExecutiveEntry: Predicate = (entity) => {
  const professions = entity.professions;
  if (!professions) return false;
  return Object.keys(professions).some((key) => key.startsWith('Lieut') || key.startsWith('Cpt'));
};

export function isPlayerStudioEntity(entity: TalentData | null | undefined): boolean {
  const studio = entity?.studioId;
  return studio != null && String(studio) === 'PL';
}
