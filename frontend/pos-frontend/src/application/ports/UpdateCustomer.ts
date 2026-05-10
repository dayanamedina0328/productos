import type { Customer } from '../../domain/entities/Customer';

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit?: number;
  isActive?: boolean;
}

export interface UpdateCustomer {
  execute(id: string, request: UpdateCustomerRequest): Promise<Customer>;
}
