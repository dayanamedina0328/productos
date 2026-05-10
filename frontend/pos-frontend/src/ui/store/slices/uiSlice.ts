import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppNotificationItem } from '../../components/base/AppNotification';

export interface ModalState {
  checkout: boolean;
  customerSelector: boolean;
  productForm: boolean;
  customerForm: boolean;
}

interface UIState {
  notifications: AppNotificationItem[];
  modals: ModalState;
}

const initialState: UIState = {
  notifications: [],
  modals: {
    checkout: false,
    customerSelector: false,
    productForm: false,
    customerForm: false,
  },
};

/**
 * uiSlice — gestiona AppNotification[] y ModalState.
 * Tarea 7.5.
 */
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<AppNotificationItem, 'id'>>) {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    openModal(state, action: PayloadAction<keyof ModalState>) {
      state.modals[action.payload] = true;
    },
    closeModal(state, action: PayloadAction<keyof ModalState>) {
      state.modals[action.payload] = false;
    },
    closeAllModals(state) {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof ModalState] = false;
      });
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
