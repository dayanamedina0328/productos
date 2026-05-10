import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '../../../domain/entities/Customer';
import type { PaginatedResponse } from '../../../shared/types/PaginatedResponse';
import type { CustomerFilters } from '../../../shared/types/Filters';
import { getCustomersUseCase, searchCustomersUseCase } from '../../../infrastructure/di/container';
import type { AsyncState } from './productsSlice';

interface CustomersState {
  list: AsyncState<PaginatedResponse<Customer>>;
  selectedCustomer: Customer | null;
  filters: CustomerFilters;
}

const initialState: CustomersState = {
  list: { data: null, loading: false, error: null },
  selectedCustomer: null,
  filters: { page: 1, pageSize: 20 },
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (filters: CustomerFilters | undefined, { rejectWithValue }) => {
    try {
      return await getCustomersUseCase.execute(filters);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al cargar clientes');
    }
  }
);

export const searchCustomersThunk = createAsyncThunk(
  'customers/search',
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchCustomersUseCase.execute(query);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al buscar clientes');
    }
  }
);

/**
 * customersSlice — gestión de clientes y cliente seleccionado.
 * Tarea 7.4.
 */
export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    selectCustomer(state, action: PayloadAction<Customer>) {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer(state) {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.list.loading = true; state.list.error = null; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.list.loading = false; state.list.data = action.payload; })
      .addCase(fetchCustomers.rejected, (state, action) => { state.list.loading = false; state.list.error = action.payload as string; })
      .addCase(searchCustomersThunk.pending, (state) => { state.list.loading = true; state.list.error = null; })
      .addCase(searchCustomersThunk.fulfilled, (state, action) => { state.list.loading = false; state.list.data = action.payload; })
      .addCase(searchCustomersThunk.rejected, (state, action) => { state.list.loading = false; state.list.error = action.payload as string; });
  },
});

export const { selectCustomer, clearSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
