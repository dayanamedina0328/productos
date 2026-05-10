import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import salesReducer from './slices/salesSlice';
import customersReducer from './slices/customersSlice';
import uiReducer from './slices/uiSlice';

// ---------------------------------------------------------------------------
// Configuración de Redux Persist (tarea 7.12)
// ---------------------------------------------------------------------------

/** Persiste el carrito completo entre recargas */
const cartPersistConfig = {
  key: 'cart',
  storage,
  // Solo persistir el carrito activo, no el estado de carga
  whitelist: ['cart'],
};

/** Persiste las notificaciones y el estado de modales */
const uiPersistConfig = {
  key: 'ui',
  storage,
  // Solo persistir notificaciones pendientes, no el estado de modales
  whitelist: ['notifications'],
};

const rootReducer = combineReducers({
  products: productsReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  sales: salesReducer,
  customers: customersReducer,
  ui: persistReducer(uiPersistConfig, uiReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist usa acciones no serializables internamente
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Las entidades de dominio usan Date — ignorar esas rutas
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

/** Persistor para usar con <PersistGate> en main.tsx */
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
