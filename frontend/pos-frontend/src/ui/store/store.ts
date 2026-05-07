import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Los slices se agregarán en fases posteriores
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar fechas en acciones (las entidades usan Date)
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt', 'payload.timestamp'],
        ignoredPaths: ['cart.createdAt', 'cart.updatedAt'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
