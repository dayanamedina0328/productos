import { clsx } from 'clsx';
import type { Product } from '../../../domain/entities/Product';
import { isProductAvailable, getStockStatus } from '../../../domain/validations/productHelpers';
import { StockIndicator } from './StockIndicator';
import { Button } from '../base/Button';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  loading?: boolean;
  className?: string;
}

/**
 * Tarjeta de producto para la grilla de ventas.
 * - Usa `isProductAvailable()` para deshabilitar el botón cuando no hay stock
 * - Usa `getStockStatus()` para mostrar el indicador de stock
 * - Ambas son funciones puras del dominio
 */
export function ProductCard({ product, onAddToCart, loading = false, className }: ProductCardProps) {
  const available = isProductAvailable(product);
  const stockStatus = getStockStatus(product.stock, product.minStock);

  return (
    <article
      aria-label={`Producto: ${product.name}`}
      className={clsx(
        'flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm',
        'transition-shadow duration-150',
        available ? 'hover:shadow-md' : 'opacity-60',
        className
      )}
    >
      {/* Imagen */}
      <div className="relative h-32 overflow-hidden rounded-t-xl bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300" aria-hidden="true">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badge sin stock */}
        {stockStatus === 'out' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</p>
          <p className="text-xs text-gray-400">{product.sku}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <StockIndicator stock={product.stock} minStock={product.minStock} />
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={!available}
          loading={loading}
          onClick={() => onAddToCart(product)}
          aria-label={`Agregar ${product.name} al carrito`}
          className="mt-auto w-full"
        >
          {available ? 'Agregar' : 'Sin stock'}
        </Button>
      </div>
    </article>
  );
}
