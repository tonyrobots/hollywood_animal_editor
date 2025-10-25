import { useMemo, useState } from 'preact/hooks';
import { useAppStore } from '../state';
import { downloadTextFile, serializeSave } from '../services/files';
export function ExportToolbar() {
    const store = useAppStore();
    const save = store.signals.save.value;
    const hasChanges = store.derived.hasChanges.value;
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    if (!save || !hasChanges)
        return null;
    const filename = useMemo(() => {
        const rawName = save.meta?.filename ?? 'edited-save.json';
        return rawName.toLowerCase().endsWith('.json') ? rawName : `${rawName}.json`;
    }, [save.meta?.filename]);
    const handleDownload = () => {
        try {
            const payload = serializeSave(save.raw);
            downloadTextFile(filename, payload);
            setError(null);
            setStatus(`Downloaded ${filename}`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to export save.';
            setError(message);
            setStatus(null);
        }
    };
    return (<section class="toolbar">
      <div class="toolbar__info">
        <span class="toolbar__label">Ready to export edits</span>
        <span class="toolbar__filename">{filename}</span>
        {status && <span class="toolbar__status">{status}</span>}
        {error && <span class="toolbar__status toolbar__status--error">{error}</span>}
      </div>
      <button type="button" class="toolbar__button" onClick={handleDownload}>
        Download Edited Save
      </button>
    </section>);
}
