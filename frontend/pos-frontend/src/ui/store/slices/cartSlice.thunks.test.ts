import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addItemToCart,
  removeCartItem,
  updateCartQuantity,
  clearCartThunk,
  holdCartThunk,
  applyCartDiscount,
} from './cartSlice';
import type { Cart } from '../../../domain/entities/Cart';

// Mock del container de DI
vi.mock('../../../infrastructure/di/container', () => ({
  addProductToCartUseCase: { execute: vi.fn() },
  removeFromCartUseCase: { execute: vi.fn() },
  updateCartItemUseCase: { execute: vi.fn() },
  clearCartUseCase: { execute: vi.fn() },
  holdSaleUseCase: { execute: vi.fn() },
  applyDiscountUseCase: { execute: vi.fn() },
}));

import {
  addProductToCartUseCase,
  removeFromCartUseCase,
  updateCartItemUseCase,
  clearCartUseCase,
  holdSaleUseCase,
  applyDiscountUseCase,
} from '../../../infrastructure/di/container';

function makeCart(id = 'cart-1'): Cart {
  return {
    id,
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeStore() {
  return configureStore({ reducer: { cart: cartReducer } });
}

describe('cartSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addItemToCart — fulfilled actualiza el carrito', async () => {
    const cart = makeCart();
    vi.mocked(addProductToCartUseCase.execute).mockResolvedValue(cart);
    const store = makeStore();

    await store.dispatch(addItemToCart({ productId: 'p1', quantity: 1 }));

    expect(store.getState().cart.cart?.id).toBe('cart-1');
    expect(store.getState().cart.loading).toBe(false);
  });

  it('addItemToCart — rejected establece el error', async () => {
    vi.mocked(addProductToCartUseCase.execute).mockRejectedValue(new Error('Sin stock'));
    const store = makeStore();

    await store.dispatch(addItemToCart({ productId: 'p1', quantity: 1 }));

    expect(store.getState().cart.error).toBe('Sin stock');
    expect(store.getState().cart.loading).toBe(false);
  });

  it('removeCartItem — fulfilled actualiza el carrito', async () => {
    const cart = makeCart();
    vi.mocked(removeFromCartUseCase.execute).mockResolvedValue(cart);
    const store = makeStore();

    await store.dispatch(removeCartItem({ cartId: 'cart-1', itemId: 'item-1' }));

    expect(store.getState().cart.cart?.id).toBe('cart-1');
  });

  it('updateCartQuantity — fulfilled actualiza el carrito', async () => {
    const cart = makeCart();
    vi.mocked(updateCartItemUseCase.execute).mockResolvedValue(cart);
    const store = makeStore();

    await store.dispatch(updateCartQuantity({ cartId: 'cart-1', itemId: 'item-1', quantity: 3 }));

    expect(store.getState().cart.cart?.id).toBe('cart-1');
  });

  it('clearCartThunk — fulfilled limpia el carrito', async () => {
    vi.mocked(clearCartUseCase.execute).mockResolvedValue(undefined);
    const store = makeStore();

    await store.dispatch(clearCartThunk('cart-1'));

    expect(store.getState().cart.cart).toBeNull();
  });

  it('holdCartThunk — fulfilled limpia el carrito', async () => {
    const cart = makeCart();
    vi.mocked(holdSaleUseCase.execute).mockResolvedValue(cart);
    const store = makeStore();

    await store.dispatch(holdCartThunk('cart-1'));

    expect(store.getState().cart.cart).toBeNull();
  });

  it('applyCartDiscount — fulfilled actualiza el carrito', async () => {
    const cart = makeCart();
    vi.mocked(applyDiscountUseCase.execute).mockResolvedValue(cart);
    const store = makeStore();

    await store.dispatch(applyCartDiscount({ cartId: 'cart-1', itemId: 'item-1', discount: 10 }));

    expect(store.getState().cart.cart?.id).toBe('cart-1');
  });
});
