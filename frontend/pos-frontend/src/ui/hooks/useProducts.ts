import { useState, useCallback, useRef } from 'react';
import type { Product } from '../../domain/entities/Product';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { ProductFilters } from '../../shared/types/Filters';
import {
  getProductsUseCase,
  searchProductsUseCase,
} from '../../infrastructure/di/container';

interface UseProductsState {
  products: PaginatedResponse<Product> | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
}

/**
 * useProducts — conecta con GetProductsUseCase y SearchProductsUseCase.
 * Expone: products, loading, error, searchProducts, filters, setFilters, reload.
 */
export function useProducts(initialFilters: ProductFilters = {}) {
  const [state, setState] = useState<UseProductsState>({
    products: null,
    loading: false,
    error: null,
    filters: initialFilters,
  });

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (filters: ProductFilters) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await getProductsUseCase.execute(filters);
      setState((prev) => ({ ...prev, products: result, loading: false }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar productos';
      setState((prev) => ({ ...prev, error: message, loading: false }));
    }
  }, []);

  const searchProducts = useCallback(
    async (query: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const items = await searchProductsUseCase.execute(query);
        // Envolver el resultado en PaginatedResponse para mantener el tipo consistente
        const result: PaginatedResponse<Product> = {
          items,
          pagination: {
            page: 1,
            pageSize: items.length,
            totalItems: items.length,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        };
        setState((prev) => ({ ...prev, products: result, loading: false }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al buscar productos';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    },
    []
  );

  const setFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const merged = { ...state.filters, ...newFilters };
      setState((prev) => ({ ...prev, filters: merged }));
      void load(merged);
    },
    [state.filters, load]
  );

  const reload = useCallback(() => void load(state.filters), [load, state.filters]);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    searchProducts,
    setFilters,
    reload,
    load,
  };
}
