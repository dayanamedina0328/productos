import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import customersReducer, { fetchCustomers, searchCustomersThunk } from './customersSlice';
import type { Customer } from '../../../domain/entities/Customer';
import { CustomerType } from '../../../domain/entities/Customer';

vi.mock('../../../infrastructure/di/container', () => ({
  getCustomersUseCase: { execute: vi.fn() },
  searchCustomersUseCase: { execute: vi.fn() },
}));

import { getCustomersUseCase, searchCustomersUseCase } from '../../../infrastructure/di/container';

function makeCustomer(): Customer {
  return {
    id: 'cust-1',
    name: 'Ana García',
    nit: '12345678',
    type: CustomerType.REGULAR,
    isActive: true,
    createdAt: new Date(),
  };
}

function makePaginated(items: Customer[]) {
  return {
    items,
    pagination: { page: 1, pageSize: 10, totalItems: items.length, totalPages: 1, hasNext: false, hasPrevious: false },
  };
}

function makeStore() {
  return configureStore({ reducer: { customers: customersReducer } });
}

describe('customersSlice thunks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchCustomers — fulfilled actualiza la lista', async () => {
    const response = makePaginated([makeCustomer()]);
    vi.mocked(getCustomersUseCase.execute).mockResolvedValue(response);
    const store = makeStore();

    await store.dispatch(fetchCustomers(undefined));

    expect(store.getState().customers.list.data?.items).toHaveLength(1);
    expect(store.getState().customers.list.loading).toBe(false);
  });

  it('fetchCustomers — rejected establece el error', async () => {
    vi.mocked(getCustomersUseCase.execute).mockRejectedValue(new Error('Error de red'));
    const store = makeStore();

    await store.dispatch(fetchCustomers(undefined));

    expect(store.getState().customers.list.error).toBe('Error de red');
  });

  it('searchCustomersThunk — fulfilled actualiza la lista', async () => {
    const response = makePaginated([makeCustomer()]);
    vi.mocked(searchCustomersUseCase.execute).mockResolvedValue(response);
    const store = makeStore();

    await store.dispatch(searchCustomersThunk('Ana'));

    expect(store.getState().customers.list.data?.items).toHaveLength(1);
  });

  it('searchCustomersThunk — rejected establece el error', async () => {
    vi.mocked(searchCustomersUseCase.execute).mockRejectedValue(new Error('Fallo búsqueda'));
    const store = makeStore();

    await store.dispatch(searchCustomersThunk('Ana'));

    expect(store.getState().customers.list.error).toBe('Fallo búsqueda');
  });
});
