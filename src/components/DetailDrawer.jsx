import { useEffect } from 'preact/hooks';
export function DetailDrawer({ open, title, onClose, children, footer, width }) {
    useEffect(() => {
        if (!open)
            return;
        const handler = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);
    if (!open)
        return null;
    const handleOverlayClick = (event) => {
        event.stopPropagation();
        onClose();
    };
    const stopPropagation = (event) => {
        event.stopPropagation();
    };
    return (<div class="drawer-overlay" onClick={handleOverlayClick}>
      <aside class="drawer" style={width ? { width } : undefined} onClick={stopPropagation}>
        <header class="drawer__header">
          <h3>{title}</h3>
          <button type="button" class="drawer__close" onClick={onClose} aria-label="Close detail view">
            X
          </button>
        </header>
        <div class="drawer__body">{children}</div>
        {footer && <footer class="drawer__footer">{footer}</footer>}
      </aside>
    </div>);
}
