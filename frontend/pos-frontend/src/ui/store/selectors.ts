import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

// ---------------------------------------------------------------------------
// Selectores de productos
// ---------------------------------------------------------------------------

export const selectProductsState = (state: RootState) => state.products;
export const selectProductsList = (state: RootState) => state.products.list.data;
export const selectProductsLoading = (state: RootState) => state.products.list.loading;
export const selectProductsError = (state: RootState) => state.products.list.error;
export const selectProductsFilters = (state: RootState) => state.products.filters;

/** Productos activos solamente */
export const selectActiveProducts = createSelector(
  selectProductsList,
  (data) => data?.items.filter((p) => p.isActive) ?? []
);

// ---------------------------------------------------------------------------
// Selectores del carrito
// ---------------------------------------------------------------------------

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectCartItemCount = createSelector(
  selectCart,
  (cart) => cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart) => cart?.total ?? 0
);

// ---------------------------------------------------------------------------
// Selectores de ventas
// ---------------------------------------------------------------------------

export const selectSalesList = (state: RootState) => state.sales.list.data;
export const selectSalesLoading = (state: RootState) => state.sales.list.loading;

// ---------------------------------------------------------------------------
// Selectores de clientes
// ---------------------------------------------------------------------------

export const selectCustomersList = (state: RootState) => state.customers.list.data;
export const selectSelectedCustomer = (state: RootState) => state.customers.selectedCustomer;
export const selectCustomersLoading = (state: RootState) => state.customers.list.loading;

// ---------------------------------------------------------------------------
// Selectores de UI
// ---------------------------------------------------------------------------

export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectModals = (state: RootState) => state.ui.modals;
export const selectIsCheckoutOpen = (state: RootState) => state.ui.modals.checkout;
export const selectIsCustomerSelectorOpen = (state: RootState) => state.ui.modals.customerSelector;
