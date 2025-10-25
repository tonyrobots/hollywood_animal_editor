import { useState } from 'preact/hooks';
import { readFileAsText, parseSaveJson } from '../services/files';
import { useAppStore } from '../state';
export function SaveLoader() {
    const store = useAppStore();
    const [status, setStatus] = useState('No save loaded.');
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const hasSave = Boolean(store.signals.save.value);
    if (hasSave)
        return null;
    async function handleFiles(fileList) {
        const file = fileList?.[0];
        if (!file)
            return;
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
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load save.';
            setError(message);
            setStatus('Load failed.');
        }
        finally {
            setLoading(false);
        }
    }
    const onInputChange = async (event) => {
        const target = event.currentTarget;
        await handleFiles(target.files);
        if (target) {
            target.value = '';
        }
    };
    const onDrop = async (event) => {
        event.preventDefault();
        await handleFiles(event.dataTransfer?.files ?? null);
    };
    const onDragOver = (event) => {
        event.preventDefault();
    };
    return (<section class="panel">
      <header class="panel__header">
        <h2>Load Save File</h2>
        <p>Drag & drop your Hollywood Animal JSON save or choose it via the button below.</p>
      </header>
      <div class="drop-zone" onDrop={onDrop} onDragOver={onDragOver} aria-label="Drop save file here" data-loading={isLoading ? 'true' : 'false'}>
        <p>Drop save JSON here</p>
        <p class="muted">or</p>
        <label class="file-picker">
          <input type="file" accept="application/json,.json" onChange={onInputChange} disabled={isLoading}/>
          <span>Select JSON file…</span>
        </label>
      </div>
      <footer class="panel__footer">
        <p class={error ? 'status status--error' : 'status'}>{error ?? status}</p>
      </footer>
    </section>);
}
