import { useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

interface DetailDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ComponentChildren;
  footer?: ComponentChildren;
  width?: string;
}

export function DetailDrawer({ open, title, onClose, children, footer, width }: DetailDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (event: MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div class="drawer-overlay" onClick={handleOverlayClick}>
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
    </div>
  );
}
