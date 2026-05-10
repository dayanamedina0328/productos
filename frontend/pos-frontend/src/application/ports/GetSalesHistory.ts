import type { Sale } from '../../domain/entities/Sale';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { SaleFilters } from '../../shared/types/Filters';

export interface GetSalesHistory {
  execute(filters?: SaleFilters): Promise<PaginatedResponse<Sale>>;
}
