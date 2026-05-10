import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { GetSalesHistory } from '../ports/GetSalesHistory';
import type { Sale } from '../../domain/entities/Sale';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { SaleFilters } from '../../shared/types/Filters';

/**
 * GetSalesHistoryUseCase
 *
 * Retorna el historial de ventas con soporte de filtros:
 * - Por cliente (customerId)
 * - Por estado (status)
 * - Por método de pago (paymentMethod)
 * - Por rango de fechas (startDate / endDate)
 * - Paginación (page / pageSize)
 */
export class GetSalesHistoryUseCase implements GetSalesHistory {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(filters?: SaleFilters): Promise<PaginatedResponse<Sale>> {
    return this.saleRepository.findAll(filters);
  }
}
