import { describe, it, expect, vi } from 'vitest';
import { ApplyDiscountUseCase } from './ApplyDiscountUseCase';
import type { CartRepository } from '../../domain/ports/CartRepository';
import type { Cart } from '../../domain/entities/Cart';

function makeCart(): Cart {
  return {
    id: 'cart-1', items: [], subtotal: 100, tax: 19, discount: 0, total: 119,
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makeRepo(cart: Cart): CartRepository {
  return {
    findById: vi.fn().mockResolvedValue(cart),
    save: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
}

describe('ApplyDiscountUseCase', () => {
  it('aplica un descuento válido', async () => {
    const cart = makeCart();
    const repo = makeRepo(cart);
    const useCase = new ApplyDiscountUseCase(repo);

    const result = await useCase.execute('cart-1', 10);

    expect(result.discount).toBe(10);
  });

  it('lanza error si el descuento es negativo', async () => {
    const repo = makeRepo(makeCart());
    const useCase = new ApplyDiscountUseCase(repo);

    await expect(useCase.execute('cart-1', -5)).rejects.toThrow('negative');
  });

  it('lanza error si el descuento supera el 100%', async () => {
    const repo = makeRepo(makeCart());
    const useCase = new ApplyDiscountUseCase(repo);

    await expect(useCase.execute('cart-1', 101)).rejects.toThrow('100%');
  });

  it('acepta descuento de 0', async () => {
    const repo = makeRepo(makeCart());
    const useCase = new ApplyDiscountUseCase(repo);

    const result = await useCase.execute('cart-1', 0);
    expect(result.discount).toBe(0);
  });

  it('acepta descuento de 100', async () => {
    const repo = makeRepo(makeCart());
    const useCase = new ApplyDiscountUseCase(repo);

    const result = await useCase.execute('cart-1', 100);
    expect(result.discount).toBe(100);
  });
});
