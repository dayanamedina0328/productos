import { describe, it, expect, vi } from 'vitest';
import { UpdateCartItemUseCase } from './UpdateCartItemUseCase';
import type { CartRepository } from '../../domain/ports/CartRepository';
import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { Cart } from '../../domain/entities/Cart';
import type { Product } from '../../domain/entities/Product';

function makeProduct(stock = 20): Product {
  return {
    id: 'prod-1', sku: 'SKU-001', name: 'P', description: '', price: 10, cost: 5,
    stock, minStock: 2, isActive: true,
    category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makeCart(): Cart {
  return {
    id: 'cart-1',
    items: [{
      id: 'item-1',
      product: makeProduct(),
      quantity: 2,
      unitPrice: 10,
      discount: 0,
      subtotal: 20,
    }],
    subtotal: 20, tax: 3.8, discount: 0, total: 23.8,
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makeRepos(cart: Cart, product: Product) {
  const cartRepository: CartRepository = {
    findById: vi.fn().mockResolvedValue(cart),
    save: vi.fn(),
    addItem: vi.fn().mockResolvedValue(cart),
    removeItem: vi.fn().mockResolvedValue(cart),
    clear: vi.fn(),
  };
  const productRepository: ProductRepository = {
    findById: vi.fn().mockResolvedValue(product),
    findAll: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return { cartRepository, productRepository };
}

describe('UpdateCartItemUseCase', () => {
  it('actualiza la cantidad de un ítem existente', async () => {
    const cart = makeCart();
    const product = makeProduct();
    const { cartRepository, productRepository } = makeRepos(cart, product);
    const useCase = new UpdateCartItemUseCase(cartRepository, productRepository);

    await useCase.execute('cart-1', 'item-1', 3);

    expect(cartRepository.removeItem).toHaveBeenCalledWith('cart-1', 'item-1');
    expect(cartRepository.addItem).toHaveBeenCalled();
  });

  it('lanza error si el ítem no existe en el carrito', async () => {
    const cart = makeCart();
    const product = makeProduct();
    const { cartRepository, productRepository } = makeRepos(cart, product);
    const useCase = new UpdateCartItemUseCase(cartRepository, productRepository);

    await expect(useCase.execute('cart-1', 'item-inexistente', 3)).rejects.toThrow('not found');
  });

  it('lanza error si la nueva cantidad supera el stock', async () => {
    const cart = makeCart();
    const product = makeProduct(2); // stock = 2
    const { cartRepository, productRepository } = makeRepos(cart, product);
    const useCase = new UpdateCartItemUseCase(cartRepository, productRepository);

    await expect(useCase.execute('cart-1', 'item-1', 5)).rejects.toThrow();
  });
});
