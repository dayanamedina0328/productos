import type { Product } from '../../domain/entities/Product';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { ProductFilters } from '../../shared/types/Filters';

export interface GetProducts {
  execute(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
}
