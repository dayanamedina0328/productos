import { describe, it, expect } from 'vitest';
import { CartMapper } from './CartMapper';
import type { CartApiResponse } from './CartMapper';

function makeRaw(overrides: Partial<CartApiResponse> = {}): CartApiResponse {
  return {
    id: 'cart-1',
    items: [
      {
        id: 'item-1',
        product: {
          id: 'prod-1',
          sku: 'SKU-001',
          name: 'Producto A',
          description: 'Desc',
          price: '10.00',
          cost: '5.00',
          stock: '20',
          min_stock: '2',
          category: { id: 'cat-1', name: 'Cat', level: 1, is_active: true },
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        quantity: '2',
        unit_price: '10.00',
        discount: '0',
        subtotal: '20.00',
      },
    ],
    subtotal: '20.00',
    tax: '3.80',
    discount: '0',
    total: '23.80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('CartMapper.toDomain', () => {
  it('convierte el id del carrito', () => {
    expect(CartMapper.toDomain(makeRaw()).id).toBe('cart-1');
  });

  it('convierte los ítems del carrito', () => {
    const cart = CartMapper.toDomain(makeRaw());
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe('item-1');
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.items[0].unitPrice).toBe(10);
    expect(cart.items[0].subtotal).toBe(20);
  });

  it('convierte los totales de string a number', () => {
    const cart = CartMapper.toDomain(makeRaw());
    expect(cart.subtotal).toBe(20);
    expect(cart.tax).toBe(3.8);
    expect(cart.total).toBe(23.8);
  });

  it('convierte customerId desde snake_case', () => {
    const cart = CartMapper.toDomain(makeRaw({ customer_id: 'cust-99' }));
    expect(cart.customerId).toBe('cust-99');
  });

  it('convierte las fechas a Date', () => {
    const cart = CartMapper.toDomain(makeRaw());
    expect(cart.createdAt).toBeInstanceOf(Date);
    expect(cart.updatedAt).toBeInstanceOf(Date);
  });

  it('convierte el producto del ítem correctamente', () => {
    const cart = CartMapper.toDomain(makeRaw());
    expect(cart.items[0].product.name).toBe('Producto A');
    expect(cart.items[0].product.price).toBe(10);
  });
});
