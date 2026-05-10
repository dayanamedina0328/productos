import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { RefundSale } from '../ports/RefundSale';
import type { Sale } from '../../domain/entities/Sale';
import { SaleStatus } from '../../domain/entities/Sale';

/**
 * RefundSaleUseCase
 *
 * Procesa el reembolso de una venta completada.
 * Solo se pueden reembolsar ventas con estado COMPLETED.
 * El repositorio/backend se encarga de revertir el stock y registrar el reembolso.
 */
export class RefundSaleUseCase implements RefundSale {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(saleId: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(saleId);

    if (sale.status !== SaleStatus.COMPLETED) {
      throw new Error(`Cannot refund a sale with status "${sale.status}". Only COMPLETED sales can be refunded`);
    }

    // El repositorio cambia el estado a REFUNDED y revierte el stock
    return this.saleRepository.cancel(saleId);
  }
}
