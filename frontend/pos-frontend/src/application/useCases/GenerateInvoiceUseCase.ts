import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { GenerateInvoice, InvoiceData } from '../ports/GenerateInvoice';
import { SaleStatus } from '../../domain/entities/Sale';

/**
 * GenerateInvoiceUseCase
 *
 * Genera los datos de factura para una venta completada.
 * Solo se puede generar factura de ventas con estado COMPLETED.
 */
export class GenerateInvoiceUseCase implements GenerateInvoice {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(saleId: string): Promise<InvoiceData> {
    const sale = await this.saleRepository.findById(saleId);

    if (sale.status !== SaleStatus.COMPLETED) {
      throw new Error(`Cannot generate invoice for a sale with status "${sale.status}"`);
    }

    return {
      saleId: sale.id,
      invoiceNumber: sale.invoiceNumber,
      issuedAt: sale.createdAt,
      sale,
    };
  }
}
