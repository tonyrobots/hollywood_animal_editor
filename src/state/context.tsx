import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useContext } from 'preact/hooks';
import type { AppStore } from './types';

export const StoreContext = createContext<AppStore | null>(null);

export function useAppStore(): AppStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('App store unavailable. Wrap tree in <StoreProvider>.');
  }
  return store;
}

interface ProviderProps {
  value: AppStore;
  children?: ComponentChildren;
}

export function StoreProvider({ value, children }: ProviderProps) {
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
