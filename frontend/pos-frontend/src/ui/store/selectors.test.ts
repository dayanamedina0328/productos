import { describe, it, expect } from 'vitest';
import {
  selectCartItemCount,
  selectCartTotal,
  selectActiveProducts,
} from './selectors';
import type { RootState } from './store';
import type { Cart } from '../../domain/entities/Cart';
import type { Product } from '../../domain/entities/Product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1', sku: 'SKU-001', name: 'P', description: '', price: 10, cost: 5,
    stock: 10, minStock: 2, isActive: true,
    category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
    ...overrides,
  };
}

function makeCart(items: Cart['items'] = []): Cart {
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  return {
    id: 'cart-1', items, customerId: undefined,
    subtotal, tax: subtotal * 0.19, discount: 0, total: subtotal * 1.19,
    createdAt: new Date(), updatedAt: new Date(),
  };
}

// Estado mínimo para los selectores
function makeState(overrides: Partial<RootState> = {}): RootState {
  return {
    cart: { cart: null, loading: false, error: null },
    products: { list: { data: null, loading: false, error: null }, filters: {} },
    sales: { list: { data: null, loading: false, error: null }, filters: {} },
    customers: { list: { data: null, loading: false, error: null }, selectedCustomer: null, filters: {} },
    ui: { notifications: [], modals: { checkout: false, customerSelector: false, productForm: false, customerForm: false } },
    ...overrides,
  } as unknown as RootState;
}

describe('selectCartItemCount', () => {
  it('retorna 0 cuando no hay carrito', () => {
    expect(selectCartItemCount(makeState())).toBe(0);
  });

  it('suma las cantidades de todos los ítems', () => {
    const cart = makeCart([
      { id: 'i1', product: makeProduct(), quantity: 3, unitPrice: 10, discount: 0, subtotal: 30 },
      { id: 'i2', product: makeProduct({ id: 'p2' }), quantity: 2, unitPrice: 5, discount: 0, subtotal: 10 },
    ]);
    const state = makeState({ cart: { cart, loading: false, error: null } } as Partial<RootState>);
    expect(selectCartItemCount(state)).toBe(5);
  });
});

describe('selectCartTotal', () => {
  it('retorna 0 cuando no hay carrito', () => {
    expect(selectCartTotal(makeState())).toBe(0);
  });

  it('retorna el total del carrito', () => {
    const cart = makeCart([
      { id: 'i1', product: makeProduct(), quantity: 2, unitPrice: 10, discount: 0, subtotal: 20 },
    ]);
    const state = makeState({ cart: { cart, loading: false, error: null } } as Partial<RootState>);
    expect(selectCartTotal(state)).toBeCloseTo(23.8);
  });
});

describe('selectActiveProducts', () => {
  it('retorna array vacío cuando no hay datos', () => {
    expect(selectActiveProducts(makeState())).toEqual([]);
  });

  it('filtra solo productos activos', () => {
    const products = [
      makeProduct({ id: 'p1', isActive: true }),
      makeProduct({ id: 'p2', isActive: false }),
      makeProduct({ id: 'p3', isActive: true }),
    ];
    const state = makeState({
      products: {
        list: {
          data: {
            items: products,
            pagination: { page: 1, pageSize: 10, totalItems: 3, totalPages: 1, hasNext: false, hasPrevious: false },
          },
          loading: false,
          error: null,
        },
        filters: {},
      },
    } as Partial<RootState>);
    const active = selectActiveProducts(state);
    expect(active).toHaveLength(2);
    expect(active.every((p) => p.isActive)).toBe(true);
  });
});
