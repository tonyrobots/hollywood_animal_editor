import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
export const StoreContext = createContext(null);
export function useAppStore() {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('App store unavailable. Wrap tree in <StoreProvider>.');
    }
    return store;
}
export function StoreProvider({ value, children }) {
    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
