import { useEffect, useMemo, useState } from 'preact/hooks';
import { DetailDrawer } from '../components/DetailDrawer';
import { useAppStore } from '../state';
import { fullName, getAge, formatUnitToTen, getTagValue } from '../domain';
import type { TalentData } from '../types/save';

interface ActorDetailDrawerProps {
  actor: TalentData | null;
  open: boolean;
  onClose: () => void;
}

export function ActorDetailDrawer({ actor, open, onClose }: ActorDetailDrawerProps) {
  const store = useAppStore();
  const names = store.signals.names.value;
  const gameYear = store.signals.gameYear.value;
  const timeline = store.signals.timeline.value;
  const actorsList = store.signals.actors.value;
  const timelineVersion = timeline.applied.length + timeline.undone.length;

  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isDirty, setDirty] = useState(false);
  const [lastActorKey, setLastActorKey] = useState<number | null>(null);

  const actorKey = useMemo(() => {
    if (!actor) return null;
    if (typeof actor.id === 'number' && Number.isFinite(actor.id)) return actor.id;
    const index = actorsList.indexOf(actor);
    return index >= 0 ? index : null;
  }, [actor, actorsList]);

  useEffect(() => {
    if (!actor || !open) {
      setJsonDraft('');
      setJsonError(null);
      setDirty(false);
      setLastActorKey(null);
      return;
    }
    const changedActor = actorKey !== lastActorKey;
    if (changedActor || !isDirty) {
      setJsonDraft(JSON.stringify(actor, null, 2));
      setJsonError(null);
      setDirty(false);
      setLastActorKey(actorKey);
    }
  }, [actor, actorKey, open, timelineVersion]);

  const displayName = actor
    ? names
      ? fullName(names, {
          firstId: actor.firstNameId,
          lastId: actor.lastNameId,
          customName: actor.customName
        })
      : actor.customName ||
        `${actor.firstNameId ?? ''}${actor.firstNameId && actor.lastNameId ? ' ' : ''}${actor.lastNameId ?? ''}`.trim() ||
        'Unknown Actor'
    : 'Actor detail';
  const age = actor ? getAge(actor, gameYear) : '';
  const art = actor ? formatUnitToTen(getTagValue(actor, 'ART')) : '';
  const com = actor ? formatUnitToTen(getTagValue(actor, 'COM')) : '';

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (!actor) return;
    try {
      const parsed = JSON.parse(jsonDraft);
      store.actions.applyActorSnapshot(actor, parsed, 'Actor JSON edit');
      setJsonError(null);
      setDirty(false);
      setJsonDraft(JSON.stringify(actor, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid JSON payload.';
      setJsonError(message);
    }
  };

  return (
    <DetailDrawer open={open} onClose={onClose} title={displayName ?? 'Actor detail'}>
      {!actor ? (
        <p class="drawer__empty">Select an actor to inspect their details.</p>
      ) : (
        <>
          <section class="drawer__section">
            <h4>Summary</h4>
            <dl class="drawer__summary">
              <div>
                <dt>ID</dt>
                <dd>{actor.id ?? '—'}</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>{actor.studioId ?? '—'}</dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>{age === '' ? '—' : age}</dd>
              </div>
              <div>
                <dt>Artistic Appeal</dt>
                <dd>{art || '—'}</dd>
              </div>
              <div>
                <dt>Commercial Appeal</dt>
                <dd>{com || '—'}</dd>
              </div>
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
                    if (!actor) return;
                    setJsonDraft(JSON.stringify(actor, null, 2));
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
