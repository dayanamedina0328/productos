import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { fetchProducts, searchProducts } from './productsSlice';
import type { Product } from '../../../domain/entities/Product';

vi.mock('../../../infrastructure/di/container', () => ({
  getProductsUseCase: { execute: vi.fn() },
  searchProductsUseCase: { execute: vi.fn() },
}));

import { getProductsUseCase, searchProductsUseCase } from '../../../infrastructure/di/container';

function makeProduct(): Product {
  return {
    id: 'p1', sku: 'SKU-001', name: 'Producto A', description: '', price: 10, cost: 5,
    stock: 10, minStock: 2, isActive: true,
    category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makePaginated(items: Product[]) {
  return {
    items,
    pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1, hasNext: false, hasPrevious: false },
  };
}

function makeStore() {
  return configureStore({ reducer: { products: productsReducer } });
}

describe('productsSlice thunks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchProducts — fulfilled actualiza la lista', async () => {
    const response = makePaginated([makeProduct()]);
    vi.mocked(getProductsUseCase.execute).mockResolvedValue(response);
    const store = makeStore();

    await store.dispatch(fetchProducts(undefined));

    expect(store.getState().products.list.data?.items).toHaveLength(1);
    expect(store.getState().products.list.loading).toBe(false);
  });

  it('fetchProducts — rejected establece el error', async () => {
    vi.mocked(getProductsUseCase.execute).mockRejectedValue(new Error('Error de red'));
    const store = makeStore();

    await store.dispatch(fetchProducts(undefined));

    expect(store.getState().products.list.error).toBe('Error de red');
  });

  it('searchProducts — fulfilled envuelve en PaginatedResponse', async () => {
    vi.mocked(searchProductsUseCase.execute).mockResolvedValue([makeProduct()]);
    const store = makeStore();

    await store.dispatch(searchProducts('Producto'));

    const data = store.getState().products.list.data;
    expect(data?.items).toHaveLength(1);
    expect(data?.pagination.totalItems).toBe(1);
  });

  it('searchProducts — rejected establece el error', async () => {
    vi.mocked(searchProductsUseCase.execute).mockRejectedValue(new Error('Fallo búsqueda'));
    const store = makeStore();

    await store.dispatch(searchProducts('X'));

    expect(store.getState().products.list.error).toBe('Fallo búsqueda');
  });
});
