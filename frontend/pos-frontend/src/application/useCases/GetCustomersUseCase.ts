import type { CustomerRepository } from '../../domain/ports/CustomerRepository';
import type { GetCustomers } from '../ports/GetCustomers';
import type { Customer } from '../../domain/entities/Customer';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { CustomerFilters } from '../../shared/types/Filters';

/**
 * GetCustomersUseCase
 *
 * Retorna la lista paginada de clientes con soporte de filtros:
 * - Por tipo (type)
 * - Por búsqueda de texto (search)
 * - Por estado activo (active)
 * - Paginación (page / pageSize)
 */
export class GetCustomersUseCase implements GetCustomers {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
    return this.customerRepository.findAll(filters);
  }
}
