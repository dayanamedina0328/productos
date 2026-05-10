import type { CustomerRepository } from '../../domain/ports/CustomerRepository';
import type { SearchCustomers } from '../ports/SearchCustomers';
import type { Customer } from '../../domain/entities/Customer';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';

/**
 * SearchCustomersUseCase
 *
 * Busca clientes por nombre o NIT.
 * Retorna una respuesta paginada con los resultados que coincidan con la consulta.
 */
export class SearchCustomersUseCase implements SearchCustomers {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(query: string): Promise<PaginatedResponse<Customer>> {
    if (!query || query.trim().length === 0) {
      return this.customerRepository.findAll();
    }

    return this.customerRepository.findAll({ search: query.trim() });
  }
}
