import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { CancelSale } from '../ports/CancelSale';
import type { Sale } from '../../domain/entities/Sale';
import { SaleStatus } from '../../domain/entities/Sale';

/**
 * CancelSaleUseCase
 *
 * Cancela una venta existente y revierte el stock de los productos involucrados.
 * La reversión del stock la gestiona el repositorio/backend al cambiar el estado a CANCELLED.
 */
export class CancelSaleUseCase implements CancelSale {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(saleId: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(saleId);

    if (sale.status === SaleStatus.CANCELLED) {
      throw new Error('Sale is already cancelled');
    }

    if (sale.status === SaleStatus.REFUNDED) {
      throw new Error('Cannot cancel a refunded sale');
    }

    return this.saleRepository.cancel(saleId);
  }
}
