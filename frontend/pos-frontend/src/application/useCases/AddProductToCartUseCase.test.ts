import { describe, it, expect, vi } from 'vitest';
import { AddProductToCartUseCase } from './AddProductToCartUseCase';
import type { CartRepository, AddToCartRequest } from '../../domain/ports/CartRepository';
import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { Cart } from '../../domain/entities/Cart';
import type { Product } from '../../domain/entities/Product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1', sku: 'SKU-001', name: 'P', description: '', price: 10, cost: 5,
    stock: 20, minStock: 2, isActive: true,
    category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
    ...overrides,
  };
}

function makeCart(items: Cart['items'] = []): Cart {
  return {
    id: 'cart-1', items, subtotal: 0, tax: 0, discount: 0, total: 0,
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makeRepos(product: Product, cart: Cart) {
  const cartRepository: CartRepository = {
    findById: vi.fn().mockResolvedValue(cart),
    save: vi.fn().mockResolvedValue(cart),
    addItem: vi.fn().mockResolvedValue(cart),
    removeItem: vi.fn(),
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

describe('AddProductToCartUseCase', () => {
  it('agrega un producto a un carrito existente', async () => {
    const product = makeProduct();
    const cart = makeCart();
    const { cartRepository, productRepository } = makeRepos(product, cart);
    const useCase = new AddProductToCartUseCase(cartRepository, productRepository);

    const result = await useCase.execute({ productId: 'prod-1', quantity: 1, cartId: 'cart-1' });

    expect(cartRepository.addItem).toHaveBeenCalledWith('cart-1', expect.objectContaining({ productId: 'prod-1' }));
    expect(result).toEqual(cart);
  });

  it('crea un carrito nuevo si no se proporciona cartId', async () => {
    const product = makeProduct();
    const cart = makeCart();
    const { cartRepository, productRepository } = makeRepos(product, cart);
    const useCase = new AddProductToCartUseCase(cartRepository, productRepository);

    await useCase.execute({ productId: 'prod-1', quantity: 1 });

    expect(cartRepository.save).toHaveBeenCalled();
  });

  it('lanza error si la cantidad supera el stock', async () => {
    const product = makeProduct({ stock: 2 });
    const cart = makeCart();
    const { cartRepository, productRepository } = makeRepos(product, cart);
    const useCase = new AddProductToCartUseCase(cartRepository, productRepository);

    await expect(
      useCase.execute({ productId: 'prod-1', quantity: 5, cartId: 'cart-1' })
    ).rejects.toThrow();
  });
});
