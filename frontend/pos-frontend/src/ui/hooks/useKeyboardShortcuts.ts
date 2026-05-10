import { useEffect } from 'react';

export interface KeyboardShortcuts {
  /** Ctrl+K — abrir búsqueda */
  onSearch?: () => void;
  /** Ctrl+Enter — confirmar checkout */
  onCheckout?: () => void;
  /** F2 — enfocar búsqueda de productos */
  onFocusSearch?: () => void;
  /** F3 — abrir selector de cliente */
  onOpenCustomer?: () => void;
  /** Escape — cerrar modal activo */
  onEscape?: () => void;
  /** + — aumentar cantidad del ítem seleccionado */
  onIncrement?: () => void;
  /** - — disminuir cantidad del ítem seleccionado */
  onDecrement?: () => void;
  /** Delete — eliminar ítem seleccionado del carrito */
  onDelete?: () => void;
}

/**
 * useKeyboardShortcuts — registra atajos de teclado globales para la terminal de ventas.
 * Ctrl+K, Ctrl+Enter, F2, F3, Escape, +/-, Delete.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Ctrl+K — búsqueda (funciona aunque haya un input activo)
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        shortcuts.onSearch?.();
        return;
      }

      // Ctrl+Enter — checkout
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        shortcuts.onCheckout?.();
        return;
      }

      // F2 — enfocar búsqueda
      if (e.key === 'F2') {
        e.preventDefault();
        shortcuts.onFocusSearch?.();
        return;
      }

      // F3 — selector de cliente
      if (e.key === 'F3') {
        e.preventDefault();
        shortcuts.onOpenCustomer?.();
        return;
      }

      // Escape — cerrar modal
      if (e.key === 'Escape') {
        shortcuts.onEscape?.();
        return;
      }

      // Los siguientes solo funcionan fuera de inputs
      if (isInput) return;

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        shortcuts.onIncrement?.();
        return;
      }

      if (e.key === '-') {
        e.preventDefault();
        shortcuts.onDecrement?.();
        return;
      }

      if (e.key === 'Delete') {
        e.preventDefault();
        shortcuts.onDelete?.();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
