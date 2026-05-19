import { useEffect, useRef, useCallback } from 'react';
import type { Product } from '../../../domain/entities/Product';
import { useProducts } from '../../hooks/useProducts';
import { SearchInput } from '../base/SearchInput';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { EmptyState } from '../base/EmptyState';
import { ScrollArea } from '../base/ScrollArea';

export interface ProductBrowserProps {
  onAddToCart: (product: Product) => void;
  /** Ref para enfocar el input de búsqueda desde el exterior (F2) */
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

/**
 * ProductBrowser — catálogo de productos con búsqueda (300ms debounce) y filtros.
 * Tarea 6.2.
 */
export function ProductBrowser({ onAddToCart, searchInputRef, className }: ProductBrowserProps) {
  const { products, loading, error, searchProducts, load } = useProducts();
  const internalRef = useRef<HTMLInputElement>(null);
  // searchInputRef permite al padre enfocar el input (ej: atajo F2)
  void (searchInputRef ?? internalRef);

  // Cargar productos al montar
  useEffect(() => {
    void load({});
  }, [load]);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        void searchProducts(query);
      } else {
        void load({});
      }
    },
    [searchProducts, load]
  );

  return (
    <div className={`flex h-full flex-col gap-3 ${className ?? ''}`}>
      {/* Barra de búsqueda */}
      <div className="shrink-0">
        <SearchInput
          onChange={handleSearch}
          debounce={300}
          placeholder="Buscar producto por nombre o SKU... (F2)"
          aria-label="Buscar productos"
        />
      </div>

      {/* Grilla de productos */}
      <ScrollArea className="flex-1" direction="vertical">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <EmptyState
            title="Error al cargar productos"
            description={error}
            icon={
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        ) : !products || products.items.length === 0 ? (
          <EmptyState
            title="No se encontraron productos"
            description="Intenta con otro término de búsqueda"
            icon={
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 pb-4">
            {products.items.filter(p => p != null && p.id != null).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
