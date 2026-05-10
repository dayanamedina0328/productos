import { describe, it, expect } from 'vitest';
import cartReducer, { setCart, clearCartError } from './cartSlice';
import type { Cart } from '../../../domain/entities/Cart';

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

describe('cartSlice reducers', () => {
  it('estado inicial correcto', () => {
    const state = cartReducer(undefined, { type: '@@INIT' });
    expect(state.cart).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setCart actualiza el carrito', () => {
    const cart = makeCart();
    const state = cartReducer(undefined, setCart(cart));
    expect(state.cart?.id).toBe('cart-1');
  });

  it('setCart con null limpia el carrito', () => {
    const withCart = cartReducer(undefined, setCart(makeCart()));
    const cleared = cartReducer(withCart, setCart(null));
    expect(cleared.cart).toBeNull();
  });

  it('clearCartError limpia el error', () => {
    const withError = { cart: null, loading: false, error: 'Error previo' };
    const state = cartReducer(withError, clearCartError());
    expect(state.error).toBeNull();
  });
});
