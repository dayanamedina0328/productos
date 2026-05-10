import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import salesReducer from './slices/salesSlice';
import customersReducer from './slices/customersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    sales: salesReducer,
    customers: customersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Las entidades de dominio usan Date — ignorar esas rutas
        ignoredActionPaths: [
          'payload.createdAt',
          'payload.updatedAt',
          'payload.items',
          'meta.arg',
        ],
        ignoredPaths: [
          'cart.cart',
          'products.list.data',
          'sales.list.data',
          'customers.list.data',
          'customers.selectedCustomer',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
