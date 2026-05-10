import type { Customer } from '../../domain/entities/Customer';
import type { CreateCustomerRequest } from '../../domain/ports/CustomerRepository';

export interface CreateCustomer {
  execute(request: CreateCustomerRequest): Promise<Customer>;
}
