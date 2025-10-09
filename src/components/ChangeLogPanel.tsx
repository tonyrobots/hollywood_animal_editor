import { useMemo } from 'preact/hooks';
import { useAppStore } from '../state';

export function ChangeLogPanel() {
  const store = useAppStore();
  const timeline = store.signals.timeline.value;
  const hasApplied = timeline.applied.length > 0;
  const hasUndone = timeline.undone.length > 0;
  const entries = useMemo(() => [...timeline.applied].reverse().slice(0, 6), [timeline.applied]);

  return (
    <section class="panel">
      <header class="panel__header">
        <h2>Change Log</h2>
        <p class="panel__subtitle">
          {hasApplied ? `${timeline.applied.length} changes tracked` : 'No changes yet'}
        </p>
      </header>
      <div class="change-actions">
        <button type="button" onClick={store.actions.undo} disabled={!hasApplied}>
          Undo
        </button>
        <button type="button" onClick={store.actions.redo} disabled={!hasUndone}>
          Redo
        </button>
        <button type="button" onClick={store.actions.reset} disabled={!hasApplied && !hasUndone}>
          Reset Filters & Log
        </button>
      </div>
      <ul class="change-list">
        {entries.length === 0 ? (
          <li class="change-list__empty">Adjust a slider or edit a field to populate the log.</li>
        ) : (
          entries.map((entry) => (
            <li key={entry.id} class="change-list__item">
              <div class="change-list__label">{entry.label}</div>
              <div class="change-list__meta">
                <span>{entry.path}</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
