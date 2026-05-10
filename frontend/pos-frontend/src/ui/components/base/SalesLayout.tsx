import { clsx } from 'clsx';

export interface SalesLayoutProps {
  /** Panel izquierdo: catálogo de productos (2fr) */
  productBrowser: React.ReactNode;
  /** Panel derecho: carrito (1fr) */
  cartPanel: React.ReactNode;
  className?: string;
}

/**
 * Layout de la terminal de ventas.
 * Desktop: grid 2fr / 1fr (catálogo | carrito)
 * Tablet: columna única con carrito abajo
 * Móvil: columna única
 */
export function SalesLayout({ productBrowser, cartPanel, className }: SalesLayoutProps) {
  return (
    <div
      className={clsx(
        'flex h-full gap-4',
        // Desktop: 2 columnas 2fr/1fr
        'lg:grid lg:grid-cols-[2fr_1fr]',
        // Tablet/móvil: columna única
        'flex-col',
        className
      )}
    >
      {/* Catálogo */}
      <main className="min-h-0 flex-1 overflow-hidden" aria-label="Catálogo de productos">
        {productBrowser}
      </main>

      {/* Carrito */}
      <aside
        className={clsx(
          'flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm',
          // En desktop tiene altura fija del viewport
          'lg:h-full',
          // En móvil/tablet tiene altura mínima
          'min-h-[300px] lg:min-h-0'
        )}
        aria-label="Carrito de compras"
      >
        {cartPanel}
      </aside>
    </div>
  );
}
