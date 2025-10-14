import { useEffect, useMemo, useState } from 'preact/hooks';
import { DetailDrawer } from '../components/DetailDrawer';
import { useAppStore } from '../state';
import { fullName, getAge, formatUnitToTen, getTagValue, normalizeDecimalString } from '../domain';
import type { TalentData } from '../types/save';

type TalentKind = 'actor' | 'director';

interface TalentDetailDrawerProps {
  kind: TalentKind;
  entity: TalentData | null;
  open: boolean;
  onClose: () => void;
}

const ROLE_TITLES: Record<TalentKind, string> = {
  actor: 'Actor',
  director: 'Director'
};

const PROFESSION_KEY: Record<TalentKind, string> = {
  actor: 'Actor',
  director: 'Director'
};

export function TalentDetailDrawer({ kind, entity, open, onClose }: TalentDetailDrawerProps) {
  const store = useAppStore();
  const names = store.signals.names.value;
  const gameYear = store.signals.gameYear.value;
  const timeline = store.signals.timeline.value;
  const timelineVersion = timeline.applied.length + timeline.undone.length;

  const collections = kind === 'actor' ? store.signals.actors.value : store.signals.directors.value;

  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isDirty, setDirty] = useState(false);
  const [lastEntityKey, setLastEntityKey] = useState<number | null>(null);

  const entityKey = useMemo(() => {
    if (!entity) return null;
    if (typeof entity.id === 'number' && Number.isFinite(entity.id)) return entity.id;
    const index = collections.indexOf(entity);
    return index >= 0 ? index : null;
  }, [entity, collections]);

  useEffect(() => {
    if (!entity || !open) {
      setJsonDraft('');
      setJsonError(null);
      setDirty(false);
      setLastEntityKey(null);
      return;
    }
    const changed = entityKey !== lastEntityKey;
    if (changed || !isDirty) {
      setJsonDraft(JSON.stringify(entity, null, 2));
      setJsonError(null);
      setDirty(false);
      setLastEntityKey(entityKey);
    }
  }, [entity, entityKey, open, timelineVersion]);

  const roleLabel = ROLE_TITLES[kind];

  const displayName = entity
    ? names
      ? fullName(names, {
          firstId: entity.firstNameId,
          lastId: entity.lastNameId,
          customName: entity.customName
        })
      : entity.customName ||
        `${entity.firstNameId ?? ''}${entity.firstNameId && entity.lastNameId ? ' ' : ''}${entity.lastNameId ?? ''}`.trim() ||
        `Unknown ${roleLabel}`
    : `${roleLabel} detail`;

  const age = entity ? getAge(entity, gameYear) : '';

  const professionKey = PROFESSION_KEY[kind];
  const skillValue = entity ? normalizeDecimalString(entity.professions?.[professionKey] ?? '') : '';
  const limitValue = entity ? normalizeDecimalString(entity.limit ?? entity.Limit ?? '') : '';

  const art = kind === 'actor' && entity ? formatUnitToTen(getTagValue(entity, 'ART')) : '';
  const com = kind === 'actor' && entity ? formatUnitToTen(getTagValue(entity, 'COM')) : '';

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (!entity) return;
    try {
      const parsed = JSON.parse(jsonDraft);
      if (kind === 'actor') {
        store.actions.applyActorSnapshot(entity, parsed, 'Actor JSON edit');
      } else {
        store.actions.applyDirectorSnapshot(entity, parsed, 'Director JSON edit');
      }
      setJsonError(null);
      setDirty(false);
      setJsonDraft(JSON.stringify(entity, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid JSON payload.';
      setJsonError(message);
    }
  };

  return (
    <DetailDrawer open={open} onClose={onClose} title={displayName ?? `${roleLabel} detail`}>
      {!entity ? (
        <p class="drawer__empty">Select a {roleLabel.toLowerCase()} to inspect their details.</p>
      ) : (
        <>
          <section class="drawer__section">
            <h4>Summary</h4>
            <dl class="drawer__summary">
              <div>
                <dt>ID</dt>
                <dd>{entity.id ?? '—'}</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>{entity.studioId ?? '—'}</dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>{age === '' ? '—' : age}</dd>
              </div>
              <div>
                <dt>{roleLabel} Skill</dt>
                <dd>{skillValue ? formatUnitToTen(skillValue) : '—'}</dd>
              </div>
              <div>
                <dt>Limit</dt>
                <dd>{limitValue ? formatUnitToTen(limitValue) : '—'}</dd>
              </div>
              {kind === 'actor' && (
                <>
                  <div>
                    <dt>Artistic Appeal</dt>
                    <dd>{art || '—'}</dd>
                  </div>
                  <div>
                    <dt>Commercial Appeal</dt>
                    <dd>{com || '—'}</dd>
                  </div>
                </>
              )}
            </dl>
          </section>
          <section class="drawer__section">
            <h4>Advanced JSON Editor</h4>
            <form class="drawer__form" onSubmit={handleSubmit}>
              <textarea
                value={jsonDraft}
                onInput={(event) => {
                  setJsonDraft((event.currentTarget as HTMLTextAreaElement).value);
                  setDirty(true);
                }}
                rows={18}
                spellCheck={false}
              />
              {jsonError && <p class="drawer__error">{jsonError}</p>}
              <div class="drawer__buttons">
                <button type="submit" disabled={!isDirty}>
                  Apply JSON Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!entity) return;
                    setJsonDraft(JSON.stringify(entity, null, 2));
                    setJsonError(null);
                    setDirty(false);
                  }}
                  disabled={!isDirty}
                >
                  Revert Draft
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </DetailDrawer>
  );
}
