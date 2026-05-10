import { useState, useCallback } from 'react';
import type { Cart } from '../../domain/entities/Cart';
import {
  addProductToCartUseCase,
  removeFromCartUseCase,
  updateCartItemUseCase,
  clearCartUseCase,
  applyDiscountUseCase,
  holdSaleUseCase,
} from '../../infrastructure/di/container';

interface UseCartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

/**
 * useCart — conecta con los casos de uso del carrito.
 * Expone: cart, loading, error, addItem, removeItem, updateQuantity, clearCart, applyDiscount, holdSale.
 */
export function useCart() {
  const [state, setState] = useState<UseCartState>({
    cart: null,
    loading: false,
    error: null,
  });

  const setLoading = () => setState((prev) => ({ ...prev, loading: true, error: null }));
  const setError = (err: unknown) =>
    setState((prev) => ({
      ...prev,
      loading: false,
      error: err instanceof Error ? err.message : 'Error en el carrito',
    }));
  const setCart = (cart: Cart) => setState({ cart, loading: false, error: null });

  const addItem = useCallback(
    async (productId: string, quantity: number, cartId?: string) => {
      setLoading();
      try {
        const updated = await addProductToCartUseCase.execute({ productId, quantity, cartId });
        setCart(updated);
        return updated;
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    []
  );

  const removeItem = useCallback(async (cartId: string, itemId: string) => {
    setLoading();
    try {
      const updated = await removeFromCartUseCase.execute(cartId, itemId);
      setCart(updated);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(
    async (cartId: string, itemId: string, quantity: number) => {
      setLoading();
      try {
        const updated = await updateCartItemUseCase.execute(cartId, itemId, quantity);
        setCart(updated);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    []
  );

  const clearCart = useCallback(async (cartId: string) => {
    setLoading();
    try {
      await clearCartUseCase.execute(cartId);
      setState({ cart: null, loading: false, error: null });
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const applyDiscount = useCallback(
    async (cartId: string, itemId: string, discount: number) => {
      setLoading();
      try {
        const updated = await applyDiscountUseCase.execute(cartId, itemId, discount);
        setCart(updated);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    []
  );

  const holdSale = useCallback(async (cartId: string) => {
    setLoading();
    try {
      const held = await holdSaleUseCase.execute(cartId);
      setState({ cart: null, loading: false, error: null });
      return held;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  return {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyDiscount,
    holdSale,
    setCart,
  };
}
