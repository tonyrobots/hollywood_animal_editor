import { useEffect, useMemo, useState } from 'preact/hooks';
import { createAppStore, StoreProvider } from './state';
import { ActorsView, DirectorsView } from './views';
import { SaveLoader } from './components/SaveLoader';
import { ChangeLogPanel } from './components/ChangeLogPanel';
import { loadBundledNameMap } from './services/names';

export function App() {
  const store = useMemo(() => createAppStore(), []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info('Hollywood Animal Editor: Preact shell mounted (placeholder).');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrapNames() {
      const names = await loadBundledNameMap();
      if (cancelled) return;
      if (names) {
        store.actions.setNameMap(names);
      } else if (import.meta.env.DEV) {
        console.info('Could not auto-load bundled CHARACTER_NAMES.json; staying in ID fallback mode.');
      }
    }
    bootstrapNames();
    return () => {
      cancelled = true;
    };
  }, [store]);

  const [activeTab, setActiveTab] = useState<'actors' | 'directors'>('actors');
  const hasSave = Boolean(store.signals.save.value);
  const actorCount = store.signals.actors.value.length;
  const directorCount = store.signals.directors.value.length;

  useEffect(() => {
    if (!hasSave) {
      setActiveTab('actors');
    }
  }, [hasSave]);

  return (
    <StoreProvider value={store}>
      <main class="layout">
        <SaveLoader />
        {hasSave && (
          <>
            <section class="panel">
              <header class="panel__header">
                <h2>Talent</h2>
                <p class="panel__subtitle">Switch between actor and director editors.</p>
              </header>
              <div class="tabs">
                <button
                  type="button"
                  class={`tabs__button${activeTab === 'actors' ? ' tabs__button--active' : ''}`}
                  onClick={() => setActiveTab('actors')}
                >
                  Actors <span class="tabs__count">({actorCount})</span>
                </button>
                <button
                  type="button"
                  class={`tabs__button${activeTab === 'directors' ? ' tabs__button--active' : ''}`}
                  onClick={() => setActiveTab('directors')}
                >
                  Directors <span class="tabs__count">({directorCount})</span>
                </button>
              </div>
            </section>
            {activeTab === 'actors' && <ActorsView />}
            {activeTab === 'directors' && <DirectorsView />}
            <ChangeLogPanel />
          </>
        )}
      </main>
    </StoreProvider>
  );
}
