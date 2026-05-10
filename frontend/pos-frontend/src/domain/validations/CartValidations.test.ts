import { describe, it, expect } from 'vitest';
import { CartValidations } from './CartValidations';
import type { Cart } from '../entities/Cart';
import type { Product } from '../entities/Product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Producto A',
    description: 'Desc',
    price: 10,
    cost: 5,
    stock: 20,
    minStock: 2,
    category: { id: 'cat-1', name: 'Cat', level: 1, isActive: true },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeCart(items: Cart['items'] = []): Cart {
  return {
    id: 'cart-1',
    items,
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('CartValidations.validateAddItem', () => {
  it('acepta agregar un ítem válido a un carrito vacío', () => {
    const result = CartValidations.validateAddItem(makeCart(), makeProduct(), 1);
    expect(result.isValid).toBe(true);
  });

  it('rechaza cantidad igual a 0', () => {
    const result = CartValidations.validateAddItem(makeCart(), makeProduct(), 0);
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('rechaza cantidad negativa', () => {
    expect(CartValidations.validateAddItem(makeCart(), makeProduct(), -1).isValid).toBe(false);
  });

  it('rechaza si la cantidad supera el stock disponible', () => {
    const product = makeProduct({ stock: 5 });
    const result = CartValidations.validateAddItem(makeCart(), product, 6);
    expect(result.isValid).toBe(false);
    expect(result.errors?.[0]).toContain('5');
  });

  it('acepta cantidad exactamente igual al stock', () => {
    const product = makeProduct({ stock: 5 });
    expect(CartValidations.validateAddItem(makeCart(), product, 5).isValid).toBe(true);
  });

  it('suma la cantidad existente en el carrito al validar', () => {
    const product = makeProduct({ id: 'prod-1', stock: 5 });
    const cart = makeCart([
      {
        id: 'item-1',
        product,
        quantity: 3,
        unitPrice: 10,
        discount: 0,
        subtotal: 30,
      },
    ]);
    // 3 existentes + 3 nuevos = 6 > stock 5 → inválido
    expect(CartValidations.validateAddItem(cart, product, 3).isValid).toBe(false);
    // 3 existentes + 2 nuevos = 5 = stock 5 → válido
    expect(CartValidations.validateAddItem(cart, product, 2).isValid).toBe(true);
  });
});
