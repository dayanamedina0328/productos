import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HoldSaleUseCase } from './HoldSaleUseCase';
import type { CartRepository } from '../../domain/ports/CartRepository';
import type { Cart } from '../../domain/entities/Cart';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-1',
    items: [
      {
        id: 'item-1',
        product: {
          id: 'prod-1',
          sku: 'SKU-001',
          name: 'Product A',
          description: 'Desc',
          price: 10,
          cost: 5,
          stock: 100,
          minStock: 5,
          category: { id: 'cat-1', name: 'Cat', level: 1, isActive: true },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: 2,
        unitPrice: 10,
        discount: 0,
        subtotal: 20,
      },
    ],
    customerId: undefined,
    subtotal: 20,
    tax: 3.8,
    discount: 0,
    total: 23.8,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeEmptyCart(id = 'cart-empty'): Cart {
  return makeCart({ id, items: [] });
}

function makeCartRepository(cart: Cart): CartRepository {
  return {
    findById: vi.fn().mockResolvedValue(cart),
    save: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  } as unknown as CartRepository;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('HoldSaleUseCase', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the cart after holding it', async () => {
    const cart = makeCart();
    const repo = makeCartRepository(cart);
    const useCase = new HoldSaleUseCase(repo);

    const result = await useCase.execute(cart.id);

    expect(result).toEqual(cart);
  });

  it('persists the cart in localStorage under the hold key', async () => {
    const cart = makeCart({ id: 'cart-abc' });
    const repo = makeCartRepository(cart);
    const useCase = new HoldSaleUseCase(repo);

    await useCase.execute(cart.id);

    const stored = JSON.parse(localStorage.getItem(HoldSaleUseCase.HOLD_KEY) ?? '[]') as Cart[];
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('cart-abc');
  });

  it('replaces an existing held cart with the same id', async () => {
    const cartV1 = makeCart({ id: 'cart-x', subtotal: 10, total: 11.9 });
    const cartV2 = makeCart({ id: 'cart-x', subtotal: 20, total: 23.8 });

    // Hold first version
    const repo1 = makeCartRepository(cartV1);
    await new HoldSaleUseCase(repo1).execute('cart-x');

    // Hold updated version
    const repo2 = makeCartRepository(cartV2);
    await new HoldSaleUseCase(repo2).execute('cart-x');

    const stored = JSON.parse(localStorage.getItem(HoldSaleUseCase.HOLD_KEY) ?? '[]') as Cart[];
    expect(stored).toHaveLength(1);
    expect(stored[0].subtotal).toBe(20);
  });

  it('accumulates multiple different held carts', async () => {
    const cart1 = makeCart({ id: 'cart-1' });
    const cart2 = makeCart({ id: 'cart-2' });

    await new HoldSaleUseCase(makeCartRepository(cart1)).execute('cart-1');
    await new HoldSaleUseCase(makeCartRepository(cart2)).execute('cart-2');

    const stored = JSON.parse(localStorage.getItem(HoldSaleUseCase.HOLD_KEY) ?? '[]') as Cart[];
    expect(stored).toHaveLength(2);
    expect(stored.map((c) => c.id)).toEqual(['cart-1', 'cart-2']);
  });

  it('throws when trying to hold an empty cart', async () => {
    const emptyCart = makeEmptyCart();
    const repo = makeCartRepository(emptyCart);
    const useCase = new HoldSaleUseCase(repo);

    await expect(useCase.execute(emptyCart.id)).rejects.toThrow('Cannot hold an empty cart');
  });

  it('does not persist an empty cart to localStorage', async () => {
    const emptyCart = makeEmptyCart();
    const repo = makeCartRepository(emptyCart);
    const useCase = new HoldSaleUseCase(repo);

    await expect(useCase.execute(emptyCart.id)).rejects.toThrow();

    const stored = localStorage.getItem(HoldSaleUseCase.HOLD_KEY);
    expect(stored).toBeNull();
  });

  it('calls cartRepository.findById with the provided cartId', async () => {
    const cart = makeCart({ id: 'cart-lookup' });
    const repo = makeCartRepository(cart);
    const useCase = new HoldSaleUseCase(repo);

    await useCase.execute('cart-lookup');

    expect(repo.findById).toHaveBeenCalledWith('cart-lookup');
  });
});
