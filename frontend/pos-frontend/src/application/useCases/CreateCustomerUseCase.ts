import type { CustomerRepository, CreateCustomerRequest } from '../../domain/ports/CustomerRepository';
import type { CreateCustomer } from '../ports/CreateCustomer';
import type { Customer } from '../../domain/entities/Customer';

/**
 * CreateCustomerUseCase
 *
 * Crea un nuevo cliente validando la unicidad del NIT.
 * El NIT es el identificador fiscal único del cliente.
 */
export class CreateCustomerUseCase implements CreateCustomer {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(request: CreateCustomerRequest): Promise<Customer> {
    if (!request.nit || request.nit.trim().length === 0) {
      throw new Error('NIT is required');
    }

    // Verificar unicidad del NIT buscando clientes con ese NIT
    const existing = await this.customerRepository.findAll({ search: request.nit });
    const duplicate = existing.items.find(
      (c) => c.nit.toLowerCase() === request.nit.toLowerCase()
    );

    if (duplicate) {
      throw new Error(`A customer with NIT "${request.nit}" already exists`);
    }

    return this.customerRepository.save(request);
  }
}
