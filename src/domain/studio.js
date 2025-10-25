const TARGET_KEYS = ['budget', 'cash', 'reputation', 'influence'];
const STUDIO_DISPLAY_NAMES = {
    PL: 'Player Studio',
    EM: 'Evergreen Movies',
    GB: 'Gerstein Bros.',
    MA: 'Marginese',
    SU: 'Supreme',
    HE: 'Hephaestus'
};
export function findStudioRoot(root) {
    if (!root || typeof root !== 'object')
        return null;
    const visited = new WeakSet();
    const queue = [root];
    let guard = 0;
    let best = null;
    let bestScore = -1;
    while (queue.length && guard++ < 200000) {
        const current = queue.shift();
        if (!current || typeof current !== 'object')
            continue;
        if (visited.has(current))
            continue;
        visited.add(current);
        if (!Array.isArray(current)) {
            const score = TARGET_KEYS.reduce((acc, key) => (Object.prototype.hasOwnProperty.call(current, key) ? acc + 1 : acc), 0);
            if (score > bestScore) {
                bestScore = score;
                best = current;
                if (score === TARGET_KEYS.length)
                    break;
            }
        }
        const values = Array.isArray(current) ? current : Object.values(current);
        queue.push(...values);
    }
    return bestScore > 0 ? best : null;
}
export function formatStudioDisplay(code) {
    if (code == null || code === '')
        return 'None';
    const normalized = String(code).trim();
    if (!normalized)
        return 'None';
    const upper = normalized.toUpperCase();
    const label = STUDIO_DISPLAY_NAMES[upper];
    return label ? `${upper} – ${label}` : `${upper} – Unknown Studio`;
}
export const BASE_STUDIO_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'PL', label: formatStudioDisplay('PL') },
    { value: 'EM', label: formatStudioDisplay('EM') },
    { value: 'GB', label: formatStudioDisplay('GB') },
    { value: 'MA', label: formatStudioDisplay('MA') },
    { value: 'SU', label: formatStudioDisplay('SU') },
    { value: 'HE', label: formatStudioDisplay('HE') }
];
export function buildStudioOptions(currentCode) {
    const normalized = currentCode == null ? '' : String(currentCode).trim().toUpperCase();
    const options = [...BASE_STUDIO_OPTIONS];
    if (normalized && !options.some((option) => option.value === normalized)) {
        options.push({ value: normalized, label: formatStudioDisplay(normalized) });
    }
    return options;
}
