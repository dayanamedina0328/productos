import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../domain/entities/Product';
import type { PaginatedResponse } from '../../../shared/types/PaginatedResponse';
import type { ProductFilters } from '../../../shared/types/Filters';
import { getProductsUseCase, searchProductsUseCase } from '../../../infrastructure/di/container';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ProductsState {
  list: AsyncState<PaginatedResponse<Product>>;
  filters: ProductFilters;
}

const initialState: ProductsState = {
  list: { data: null, loading: false, error: null },
  filters: { page: 1, pageSize: 20 },
};

// Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      return await getProductsUseCase.execute(filters);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al cargar productos');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const items = await searchProductsUseCase.execute(query);
      // Envolver en PaginatedResponse para mantener el tipo del estado consistente
      const result: PaginatedResponse<Product> = {
        items,
        pagination: {
          page: 1,
          pageSize: items.length,
          totalItems: items.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
      return result;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error al buscar productos');
    }
  }
);

/**
 * productsSlice — estado AsyncState<PaginatedResponse<Product>>.
 * Tarea 7.1.
 */
export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError(state) {
      state.list.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload as string;
      })
      .addCase(searchProducts.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError } = productsSlice.actions;
export default productsSlice.reducer;
