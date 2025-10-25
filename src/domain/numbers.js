export function normalizeDecimalString(value) {
    if (value === undefined || value === null || value === '')
        return '';
    const num = Number(String(value).replace(',', '.'));
    return Number.isFinite(num) ? num.toFixed(3) : String(value);
}
export function normalizeArtCom(value) {
    if (value === undefined || value === null || value === '')
        return '';
    const num = Number(String(value).replace(',', '.'));
    if (!Number.isFinite(num))
        return '';
    const fixed = num.toFixed(3);
    const OPTIONS = ['0.000', '0.150', '0.300', '0.700', '1.000'];
    if (OPTIONS.includes(fixed))
        return fixed;
    let best = OPTIONS[0];
    let bestDist = Math.abs(Number(best) - num);
    for (const option of OPTIONS.slice(1)) {
        const distance = Math.abs(Number(option) - num);
        if (distance < bestDist) {
            best = option;
            bestDist = distance;
        }
    }
    return best;
}
export function formatUnitToTen(value) {
    if (value === undefined || value === null || value === '')
        return '';
    const num = Number(String(value).replace(',', '.'));
    return Number.isFinite(num) ? (num * 10).toFixed(1) : '';
}
export function formatUnitToHundred(value) {
    if (value === undefined || value === null || value === '')
        return '';
    const num = Number(String(value).replace(',', '.'));
    return Number.isFinite(num) ? (num * 100).toFixed(0) : '';
}
export function getNumeric(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : -Infinity;
}
