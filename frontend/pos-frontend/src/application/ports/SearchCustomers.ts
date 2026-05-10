import type { Customer } from '../../domain/entities/Customer';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';

export interface SearchCustomers {
  execute(query: string): Promise<PaginatedResponse<Customer>>;
}
