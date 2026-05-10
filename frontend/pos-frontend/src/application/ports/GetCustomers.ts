import type { Customer } from '../../domain/entities/Customer';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { CustomerFilters } from '../../shared/types/Filters';

export interface GetCustomers {
  execute(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>>;
}
