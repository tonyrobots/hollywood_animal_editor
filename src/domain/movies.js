import { normalizeDecimalString } from './numbers';
export function extractMovies(root) {
    const visited = new WeakSet();
    const queue = [root];
    let guard = 0;
    while (queue.length && guard++ < 200000) {
        const current = queue.shift();
        if (!current || typeof current !== 'object')
            continue;
        if (visited.has(current))
            continue;
        visited.add(current);
        if (Array.isArray(current)) {
            const first = current[0];
            if (first &&
                typeof first === 'object' &&
                'name' in first &&
                'stageResults' in first) {
                return current;
            }
            queue.push(...current);
            continue;
        }
        for (const value of Object.values(current)) {
            queue.push(value);
        }
    }
    return [];
}
export function moviesCountForRole(entity, role) {
    if (!entity.movies)
        return 0;
    const list = entity.movies[role];
    return Array.isArray(list) ? list.length : 0;
}
export function normalizeSkillForRole(entity, role) {
    const value = entity.professions?.[role];
    return Number.isFinite(Number(value)) ? Number(value) : 0;
}
export function computeMovieArtCom(movie) {
    const results = movie?.stageResults ?? {};
    const script = results.Script ?? {};
    const baseline = Number(script.baseline ?? 0) || 0;
    let totalArt = 0;
    let totalCom = 0;
    for (const key of ['Script', 'Preproduction', 'Production', 'Postproduction', 'Release']) {
        const stage = results[key] ?? {};
        const art = Number(stage.realArtValue ?? stage.artValue ?? 0);
        const com = Number(stage.realCommercialValue ?? stage.commercialValue ?? 0);
        if (Number.isFinite(art))
            totalArt += art;
        if (Number.isFinite(com))
            totalCom += com;
    }
    return {
        art: baseline + totalArt,
        com: baseline + totalCom
    };
}
export function getMovieTotalIncome(movie) {
    const release = movie?.stageResults?.Release ?? {};
    const value = Number(release.totalIncome ?? 0);
    return Number.isFinite(value) ? value : 0;
}
export function establishedGenres(entity, topN = 3) {
    const tags = entity.whiteTagsNEW ?? entity.whiteTagsNew;
    if (!tags)
        return '';
    const counts = new Map();
    for (const [key, tag] of Object.entries(tags)) {
        if (!key.startsWith('GENRE_'))
            continue;
        const normalized = normalizeDecimalString(tag?.value ?? '0');
        const val = Number(normalized);
        if (!Number.isFinite(val) || val <= 0)
            continue;
        counts.set(key, (counts.get(key) ?? 0) + val);
    }
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([key]) => key.replace(/^GENRE_/, ''))
        .join(', ');
}
