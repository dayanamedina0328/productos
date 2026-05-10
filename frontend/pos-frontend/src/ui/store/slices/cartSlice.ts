import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Cart } from '../../../domain/entities/Cart';
import {
  addProductToCartUseCase,
  removeFromCartUseCase,
  updateCartItemUseCase,
  clearCartUseCase,
  applyDiscountUseCase,
  holdSaleUseCase,
} from '../../../infrastructure/di/container';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// Thunks
export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async (
    payload: { productId: string; quantity: number; cartId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await addProductToCartUseCase.execute(payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al agregar al carrito');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (payload: { cartId: string; itemId: string }, { rejectWithValue }) => {
    try {
      return await removeFromCartUseCase.execute(payload.cartId, payload.itemId);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al eliminar ítem');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    payload: { cartId: string; itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await updateCartItemUseCase.execute(payload.cartId, payload.itemId, payload.quantity);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al actualizar cantidad');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clear',
  async (cartId: string, { rejectWithValue }) => {
    try {
      await clearCartUseCase.execute(cartId);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al vaciar carrito');
    }
  }
);

export const holdCartThunk = createAsyncThunk(
  'cart/hold',
  async (cartId: string, { rejectWithValue }) => {
    try {
      return await holdSaleUseCase.execute(cartId);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al poner en espera');
    }
  }
);

export const applyCartDiscount = createAsyncThunk(
  'cart/applyDiscount',
  async (
    payload: { cartId: string; itemId: string; discount: number },
    { rejectWithValue }
  ) => {
    try {
      return await applyDiscountUseCase.execute(payload.cartId, payload.itemId, payload.discount);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al aplicar descuento');
    }
  }
);

/**
 * cartSlice — acciones: addItem, removeItem, updateQuantity, clear, hold.
 * Tarea 7.2.
 */
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<Cart | null>) {
      state.cart = action.payload;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: CartState) => { state.loading = true; state.error = null; };
    const rejected = (state: CartState, action: { payload: unknown }) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(addItemToCart.pending, pending)
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addItemToCart.rejected, rejected)

      .addCase(removeCartItem.pending, pending)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, rejected)

      .addCase(updateCartQuantity.pending, pending)
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.rejected, rejected)

      .addCase(clearCartThunk.pending, pending)
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
      })
      .addCase(clearCartThunk.rejected, rejected)

      .addCase(holdCartThunk.pending, pending)
      .addCase(holdCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
      })
      .addCase(holdCartThunk.rejected, rejected)

      .addCase(applyCartDiscount.pending, pending)
      .addCase(applyCartDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(applyCartDiscount.rejected, rejected);
  },
});

export const { setCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
