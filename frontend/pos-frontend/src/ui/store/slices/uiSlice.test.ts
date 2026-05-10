import { describe, it, expect } from 'vitest';
import uiReducer, {
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} from './uiSlice';

const initialState = {
  notifications: [],
  modals: {
    checkout: false,
    customerSelector: false,
    productForm: false,
    customerForm: false,
  },
};

describe('uiSlice', () => {
  it('estado inicial correcto', () => {
    expect(uiReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('addNotification agrega una notificación con id generado', () => {
    const state = uiReducer(undefined, addNotification({ type: 'success', title: 'OK' }));
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0].title).toBe('OK');
    expect(state.notifications[0].id).toBeDefined();
  });

  it('addNotification acumula múltiples notificaciones', () => {
    let state = uiReducer(undefined, addNotification({ type: 'success', title: 'A' }));
    state = uiReducer(state, addNotification({ type: 'error', title: 'B' }));
    expect(state.notifications).toHaveLength(2);
  });

  it('removeNotification elimina por id', () => {
    let state = uiReducer(undefined, addNotification({ type: 'info', title: 'Test' }));
    const id = state.notifications[0].id;
    state = uiReducer(state, removeNotification(id));
    expect(state.notifications).toHaveLength(0);
  });

  it('clearNotifications vacía todas las notificaciones', () => {
    let state = uiReducer(undefined, addNotification({ type: 'success', title: 'A' }));
    state = uiReducer(state, addNotification({ type: 'error', title: 'B' }));
    state = uiReducer(state, clearNotifications());
    expect(state.notifications).toHaveLength(0);
  });

  it('openModal abre el modal especificado', () => {
    const state = uiReducer(undefined, openModal('checkout'));
    expect(state.modals.checkout).toBe(true);
    expect(state.modals.customerSelector).toBe(false);
  });

  it('closeModal cierra el modal especificado', () => {
    let state = uiReducer(undefined, openModal('checkout'));
    state = uiReducer(state, closeModal('checkout'));
    expect(state.modals.checkout).toBe(false);
  });

  it('closeAllModals cierra todos los modales', () => {
    let state = uiReducer(undefined, openModal('checkout'));
    state = uiReducer(state, openModal('customerSelector'));
    state = uiReducer(state, closeAllModals());
    expect(state.modals.checkout).toBe(false);
    expect(state.modals.customerSelector).toBe(false);
    expect(state.modals.productForm).toBe(false);
    expect(state.modals.customerForm).toBe(false);
  });
});
