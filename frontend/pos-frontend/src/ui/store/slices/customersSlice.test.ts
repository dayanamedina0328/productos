import { describe, it, expect } from 'vitest';
import customersReducer, { selectCustomer, clearSelectedCustomer } from './customersSlice';
import type { Customer } from '../../../domain/entities/Customer';
import { CustomerType } from '../../../domain/entities/Customer';

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

describe('customersSlice reducers', () => {
  it('estado inicial correcto', () => {
    const state = customersReducer(undefined, { type: '@@INIT' });
    expect(state.selectedCustomer).toBeNull();
    expect(state.list.data).toBeNull();
    expect(state.list.loading).toBe(false);
  });

  it('selectCustomer establece el cliente seleccionado', () => {
    const customer = makeCustomer();
    const state = customersReducer(undefined, selectCustomer(customer));
    expect(state.selectedCustomer?.id).toBe('cust-1');
    expect(state.selectedCustomer?.name).toBe('Ana García');
  });

  it('clearSelectedCustomer limpia el cliente seleccionado', () => {
    const withCustomer = customersReducer(undefined, selectCustomer(makeCustomer()));
    const cleared = customersReducer(withCustomer, clearSelectedCustomer());
    expect(cleared.selectedCustomer).toBeNull();
  });
});
