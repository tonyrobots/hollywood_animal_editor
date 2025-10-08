import { useEffect, useMemo } from 'preact/hooks';
import { createAppStore, StoreProvider } from './state';
import { ActorsView } from './views';
import { SaveLoader } from './components/SaveLoader';
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

  return (
    <StoreProvider value={store}>
      <main class="layout">
        <SaveLoader />
        <ActorsView />
      </main>
    </StoreProvider>
  );
}
