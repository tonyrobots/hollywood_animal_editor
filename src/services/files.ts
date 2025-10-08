export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.readAsText(file);
  });
}

export function parseSaveJson(contents: string): unknown {
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error('Save file is not valid JSON.');
  }
}
