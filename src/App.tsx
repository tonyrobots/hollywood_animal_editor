import { useEffect, useMemo, useState } from 'preact/hooks';
import { createAppStore, StoreProvider, ROLE_CONFIG, ROLE_KINDS, type SupportedKind } from './state';
import {
  ActorsView,
  AgentsView,
  CinematographersView,
  ComposersView,
  DirectorsView,
  EditorsView,
  ProducersView,
  WritersView
} from './views';
import { SaveLoader } from './components/SaveLoader';
import { ExportToolbar } from './components/ExportToolbar';
import { ChangeLogPanel } from './components/ChangeLogPanel';
import { loadBundledNameMap } from './services/names';

type TabKey = (typeof ROLE_CONFIG)[SupportedKind]['collectionKey'];

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

  const [activeTab, setActiveTab] = useState<TabKey>('actors');
  const hasSave = Boolean(store.signals.save.value);

  const tabEntries = ROLE_KINDS.map((kind) => {
    const config = ROLE_CONFIG[kind];
    const key = config.collectionKey;
    const count = store.signals[key].value.length;
    return {
      kind,
      key,
      title: config.title,
      count
    };
  });

  useEffect(() => {
    if (!hasSave) {
      setActiveTab('actors');
    }
  }, [hasSave]);

  const activeTabEntry = tabEntries.find((entry) => entry.key === activeTab) ?? tabEntries[0];
  const activeKind = activeTabEntry?.kind ?? 'actor';

  const renderActiveView = () => {
    switch (activeKind) {
      case 'actor':
        return <ActorsView />;
      case 'director':
        return <DirectorsView />;
      case 'producer':
        return <ProducersView />;
      case 'writer':
        return <WritersView />;
      case 'editor':
        return <EditorsView />;
      case 'composer':
        return <ComposersView />;
      case 'cinematographer':
        return <CinematographersView />;
      case 'agent':
        return <AgentsView />;
      default:
        return null;
    }
  };

  return (
    <StoreProvider value={store}>
      <main class="layout">
        <SaveLoader />
        {hasSave && <ExportToolbar />}
        {hasSave && <ChangeLogPanel />}
        {hasSave && (
          <>
            <section class="panel">
              <header class="panel__header">
                <h2>Talent</h2>
                <p class="panel__subtitle">Switch between the available talent editors.</p>
              </header>
              <div class="tabs">
                {tabEntries.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    class={`tabs__button${activeTab === entry.key ? ' tabs__button--active' : ''}`}
                    onClick={() => setActiveTab(entry.key)}
                  >
                    {entry.title} <span class="tabs__count">({entry.count})</span>
                  </button>
                ))}
              </div>
            </section>
            {renderActiveView()}
          </>
        )}
      </main>
    </StoreProvider>
  );
}
