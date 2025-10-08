import { useState } from 'preact/hooks';
import { readFileAsText, parseSaveJson } from '../services/files';
import { readNameFile } from '../services/names';
import { useAppStore } from '../state';

export function SaveLoader() {
  const store = useAppStore();
  const [status, setStatus] = useState<string>('No save loaded.');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameLoading, setNameLoading] = useState(false);

  const names = store.signals.names.value;
  const nameStatus = names
    ? `Name map loaded (${names.length.toLocaleString()} entries)`
    : 'Name map not loaded — IDs will be shown until a map is provided.';

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const text = await readFileAsText(file);
      const parsed = parseSaveJson(text);
      store.actions.loadSave(parsed, {
        filename: file.name,
        size: file.size,
        loadedAt: Date.now()
      });
      const actorCount = store.signals.actors.value.length;
      setStatus(`Loaded ${file.name} (${actorCount} actors)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load save.';
      setError(message);
      setStatus('Load failed.');
    } finally {
      setLoading(false);
    }
  }

  const onInputChange = async (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    await handleFiles(target.files);
    if (target) {
      target.value = '';
    }
  };

  const onDrop = async (event: DragEvent) => {
    event.preventDefault();
    await handleFiles(event.dataTransfer?.files ?? null);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onNameInputChange = async (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    setNameLoading(true);
    setNameError(null);
    try {
      const locStrings = await readNameFile(file);
      store.actions.setNameMap(locStrings);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load name map.';
      setNameError(message);
    } finally {
      setNameLoading(false);
      if (target) target.value = '';
    }
  };

  return (
    <section class="panel">
      <header class="panel__header">
        <h2>1. Load Save File</h2>
        <p>Drag & drop your Hollywood Animal JSON save or choose it via the button below.</p>
      </header>
      <div
        class="drop-zone"
        onDrop={onDrop}
        onDragOver={onDragOver}
        aria-label="Drop save file here"
        data-loading={isLoading ? 'true' : 'false'}
      >
        <p>Drop save JSON here</p>
        <p class="muted">or</p>
        <label class="file-picker">
          <input type="file" accept="application/json,.json" onChange={onInputChange} disabled={isLoading} />
          <span>Select JSON file…</span>
        </label>
      </div>
      <footer class="panel__footer">
        <p class={error ? 'status status--error' : 'status'}>{error ?? status}</p>
      </footer>
      <div class="panel__section">
        <h3>Optional: Name Map</h3>
        <p class="panel__description">
          Loading the official `CHARACTER_NAMES.json` lets the editor resolve first/last name IDs.
        </p>
        <div class="panel__inputs">
          <label class="file-picker">
            <input type="file" accept="application/json,.json" onChange={onNameInputChange} disabled={nameLoading} />
            <span>{nameLoading ? 'Loading…' : 'Load name map JSON…'}</span>
          </label>
        </div>
        <p class={nameError ? 'status status--error' : 'status'}>{nameError ?? nameStatus}</p>
      </div>
    </section>
  );
}
