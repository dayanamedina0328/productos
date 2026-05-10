import { clsx } from 'clsx';

export interface ProductGridSkeletonProps {
  /** Número de tarjetas skeleton a mostrar */
  count?: number;
  className?: string;
}

function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      {/* Imagen */}
      <div className="mb-3 h-32 animate-pulse rounded-lg bg-gray-200" />
      {/* Nombre */}
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      {/* SKU */}
      <div className="mb-3 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
      {/* Precio y stock */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-gray-100" />
      </div>
      {/* Botón */}
      <div className="mt-3 h-9 animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
}

/**
 * Skeleton de carga para la grilla de productos.
 * Se muestra mientras se cargan los productos del servidor.
 */
export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Cargando productos..."
      className={clsx(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
