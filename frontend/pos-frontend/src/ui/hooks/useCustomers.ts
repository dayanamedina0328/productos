import { useState, useCallback } from 'react';
import type { Customer } from '../../domain/entities/Customer';
import { searchCustomersUseCase } from '../../infrastructure/di/container';

interface UseCustomersState {
  selectedCustomer: Customer | null;
  searchResults: Customer[];
  loading: boolean;
  error: string | null;
}

/**
 * useCustomers — gestiona la selección de cliente en el carrito.
 * Expone: selectedCustomer, selectCustomer, clearCustomer, searchResults, searchCustomers.
 */
export function useCustomers() {
  const [state, setState] = useState<UseCustomersState>({
    selectedCustomer: null,
    searchResults: [],
    loading: false,
    error: null,
  });

  const selectCustomer = useCallback((customer: Customer) => {
    setState((prev) => ({ ...prev, selectedCustomer: customer }));
  }, []);

  const clearCustomer = useCallback(() => {
    setState((prev) => ({ ...prev, selectedCustomer: null }));
  }, []);

  const searchCustomers = useCallback(async (query: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await searchCustomersUseCase.execute(query);
      setState((prev) => ({
        ...prev,
        searchResults: result.items,
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al buscar clientes';
      setState((prev) => ({ ...prev, error: message, loading: false }));
    }
  }, []);

  return {
    selectedCustomer: state.selectedCustomer,
    searchResults: state.searchResults,
    loading: state.loading,
    error: state.error,
    selectCustomer,
    clearCustomer,
    searchCustomers,
  };
}
