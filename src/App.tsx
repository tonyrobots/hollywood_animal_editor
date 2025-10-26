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
import { ChangeLogPanel } from './components/ChangeLogPanel';
import { loadBundledNameMap } from './services/names';
import { downloadTextFile, serializeSave } from './services/files';
import logoUrl from '../web/images/logo_ha_1280x720.png';

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
  const hasChanges = store.derived.hasChanges.value;

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
        <header class="site-header">
          <div class="site-header__brand">
            <img src={logoUrl} alt="Hollywood Animal" class="site-header__logo" />
            <span class="site-header__title">Save Game Editor</span>
          </div>
          {hasSave && hasChanges && (
            <button
              type="button"
              class="toolbar__button"
              onClick={() => {
                const save = store.signals.save.value;
                if (!save) return;
                const rawName = save.meta?.filename ?? 'edited-save.json';
                const filename = rawName.toLowerCase().endsWith('.json') ? rawName : `${rawName}.json`;
                const payload = serializeSave(save.raw);
                downloadTextFile(filename, payload);
              }}
            >
              Download Edited Save
            </button>
          )}
        </header>
        <SaveLoader />
        {hasSave && <ChangeLogPanel />}
        {hasSave && (
          <>
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
            {renderActiveView()}
          </>
        )}
      </main>
    </StoreProvider>
  );
}
