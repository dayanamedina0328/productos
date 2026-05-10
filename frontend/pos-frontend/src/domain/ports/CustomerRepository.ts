import type { Customer, CustomerType } from '../entities/Customer';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { CustomerFilters } from '../../shared/types/Filters';

export interface CreateCustomerRequest {
  name: string;
  nit: string;
  email?: string;
  phone?: string;
  address?: string;
  type: CustomerType;
  creditLimit?: number;
}

export interface CustomerRepository {
  findAll(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>>;
  findById(id: string): Promise<Customer>;
  save(request: CreateCustomerRequest): Promise<Customer>;
}
