export async function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.readAsText(file);
    });
}
export function parseSaveJson(contents) {
    try {
        return JSON.parse(contents);
    }
    catch (error) {
        throw new Error('Save file is not valid JSON.');
    }
}
export function serializeSave(raw) {
    if (raw == null) {
        throw new Error('Save data is unavailable.');
    }
    return JSON.stringify(raw, null, 2);
}
export function downloadTextFile(filename, contents, mimeType = 'application/json') {
    const blob = new Blob([contents], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
