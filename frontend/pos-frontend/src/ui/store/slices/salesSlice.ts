import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Sale } from '../../../domain/entities/Sale';
import type { PaginatedResponse } from '../../../shared/types/PaginatedResponse';
import type { SaleFilters } from '../../../shared/types/Filters';
import { getSalesHistoryUseCase } from '../../../infrastructure/di/container';
import type { AsyncState } from './productsSlice';

interface SalesState {
  list: AsyncState<PaginatedResponse<Sale>>;
  filters: SaleFilters;
}

const initialState: SalesState = {
  list: { data: null, loading: false, error: null },
  filters: { page: 1, pageSize: 20 },
};

export const fetchSalesHistory = createAsyncThunk(
  'sales/fetchHistory',
  async (filters: SaleFilters | undefined, { rejectWithValue }) => {
    try {
      return await getSalesHistoryUseCase.execute(filters);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al cargar ventas');
    }
  }
);

/**
 * salesSlice — estado AsyncState<PaginatedResponse<Sale>>.
 * Tarea 7.3.
 */
export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesHistory.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchSalesHistory.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload;
      })
      .addCase(fetchSalesHistory.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload as string;
      });
  },
});

export default salesSlice.reducer;
