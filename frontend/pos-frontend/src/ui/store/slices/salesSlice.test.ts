import { describe, it, expect } from 'vitest';
import salesReducer from './salesSlice';

describe('salesSlice', () => {
  it('estado inicial correcto', () => {
    const state = salesReducer(undefined, { type: '@@INIT' });
    expect(state.list.data).toBeNull();
    expect(state.list.loading).toBe(false);
    expect(state.list.error).toBeNull();
    expect(state.filters).toEqual({ page: 1, pageSize: 20 });
  });
});
