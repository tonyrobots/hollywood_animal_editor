import { useMemo, useState } from 'preact/hooks';
import { useAppStore, ROLE_CONFIG } from '../state';
import { fullName } from '../domain';
export function ChangeLogPanel() {
    const store = useAppStore();
    const timeline = store.signals.timeline.value;
    const hasApplied = timeline.applied.length > 0;
    const hasUndone = timeline.undone.length > 0;
    const [isOpen, setIsOpen] = useState(false);
    const names = store.signals.names.value;
    const entries = useMemo(() => [...timeline.applied].reverse(), [timeline.applied]);
    if (!hasApplied && !hasUndone)
        return null;
    const resolveEntityName = (entityRef) => {
        if (!entityRef)
            return null;
        const config = ROLE_CONFIG[entityRef.kind];
        if (!config)
            return null;
        const collection = store.signals[config.collectionKey].value;
        const entity = collection.find((e) => e.id === entityRef.id);
        if (!entity)
            return null;
        if (names) {
            return fullName(names, {
                firstId: entity.firstNameId,
                lastId: entity.lastNameId,
                customName: entity.customName
            });
        }
        if (entity.customName)
            return entity.customName;
        const nameFromIds = [entity.firstNameId, entity.lastNameId].filter(Boolean).join(' ').trim();
        if (nameFromIds)
            return nameFromIds;
        return `${config.detailLabel} #${entityRef.id}`;
    };
    const formatChangeLabel = (entry) => {
        const entityName = resolveEntityName(entry.entity);
        return entityName ? `${entityName}: ${entry.label}` : entry.label;
    };
    const latestEntry = entries.length > 0 ? entries[0] : null;
    return (<section class="changes-panel">
      <details open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
        <summary class="changes-panel__summary">
          <div class="changes-panel__summary-line">
            <span class="changes-panel__changes">
              Changes: <span class="changes-panel__count">{timeline.applied.length}</span>
            </span>
            {latestEntry && (<span class="changes-panel__latest">
                Latest Change: <span class="changes-panel__latest-text">{formatChangeLabel(latestEntry)}</span>
              </span>)}
          </div>
          {entries.length > 0 && (<div class="changes-panel__hint">click to {isOpen ? 'hide' : 'expand'}</div>)}
        </summary>
        <ul class="changes-panel__list">
          {entries.map((entry) => (<li key={entry.id}>
              <span class="changes-panel__label">{formatChangeLabel(entry)}</span>
              <span class="changes-panel__meta">{entry.path}</span>
            </li>))}
        </ul>
      </details>
      <div class="changes-panel__actions">
        <button type="button" class="changes-panel__button" onClick={store.actions.undo} disabled={!hasApplied}>
          Undo
        </button>
        <button type="button" class="changes-panel__button" onClick={store.actions.redo} disabled={!hasUndone}>
          Redo
        </button>
      </div>
    </section>);
}
