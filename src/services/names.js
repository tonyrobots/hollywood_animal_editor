const BUNDLED_NAME_URLS = [
    '/data/CHARACTER_NAMES.json',
    '/web/data/CHARACTER_NAMES.json',
    '/CHARACTER_NAMES.json'
];
export async function loadBundledNameMap() {
    for (const url of BUNDLED_NAME_URLS) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                continue;
            const data = await response.json();
            if (Array.isArray(data?.locStrings)) {
                return data.locStrings;
            }
        }
        catch {
            // try next URL
        }
    }
    return null;
}
export async function readNameFile(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed?.locStrings)) {
        throw new Error('Invalid name map file.');
    }
    return parsed.locStrings;
}
