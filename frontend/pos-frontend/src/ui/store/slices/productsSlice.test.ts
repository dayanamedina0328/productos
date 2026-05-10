import { describe, it, expect } from 'vitest';
import productsReducer, { setFilters, clearError } from './productsSlice';

describe('productsSlice reducers', () => {
  it('estado inicial correcto', () => {
    const state = productsReducer(undefined, { type: '@@INIT' });
    expect(state.list.data).toBeNull();
    expect(state.list.loading).toBe(false);
    expect(state.list.error).toBeNull();
    expect(state.filters).toEqual({ page: 1, pageSize: 20 });
  });

  it('setFilters actualiza los filtros', () => {
    const state = productsReducer(undefined, setFilters({ page: 2, pageSize: 10 }));
    expect(state.filters.page).toBe(2);
    expect(state.filters.pageSize).toBe(10);
  });

  it('setFilters hace merge con los filtros existentes', () => {
    let state = productsReducer(undefined, setFilters({ page: 2 }));
    state = productsReducer(state, setFilters({ pageSize: 5 }));
    expect(state.filters.page).toBe(2);
    expect(state.filters.pageSize).toBe(5);
  });

  it('clearError limpia el error', () => {
    const withError = {
      list: { data: null, loading: false, error: 'Error de red' },
      filters: {},
    };
    const state = productsReducer(withError, clearError());
    expect(state.list.error).toBeNull();
  });
});
