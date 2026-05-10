import { describe, it, expect, vi } from 'vitest';
import { GenerateInvoiceUseCase } from './GenerateInvoiceUseCase';
import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { Sale } from '../../domain/entities/Sale';
import { PaymentMethod, SaleStatus } from '../../domain/entities/Sale';

function makeSale(status: SaleStatus): Sale {
  return {
    id: 'sale-1',
    invoiceNumber: 'INV-2024-001',
    items: [],
    subtotal: 100,
    tax: 19,
    discount: 0,
    total: 119,
    paymentMethod: PaymentMethod.CASH,
    paymentDetails: {},
    status,
    createdAt: new Date('2024-01-15'),
    createdBy: 'user-1',
  };
}

function makeRepo(sale: Sale): SaleRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn().mockResolvedValue(sale),
    save: vi.fn(),
    cancel: vi.fn(),
  };
}

describe('GenerateInvoiceUseCase', () => {
  it('genera la factura de una venta completada', async () => {
    const sale = makeSale(SaleStatus.COMPLETED);
    const repo = makeRepo(sale);
    const useCase = new GenerateInvoiceUseCase(repo);

    const result = await useCase.execute('sale-1');

    expect(result.saleId).toBe('sale-1');
    expect(result.invoiceNumber).toBe('INV-2024-001');
    expect(result.sale).toEqual(sale);
    expect(result.issuedAt).toEqual(sale.createdAt);
  });

  it('lanza error si la venta está pendiente', async () => {
    const sale = makeSale(SaleStatus.PENDING);
    const repo = makeRepo(sale);
    const useCase = new GenerateInvoiceUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow(
      'Cannot generate invoice for a sale with status "pending"'
    );
  });

  it('lanza error si la venta fue cancelada', async () => {
    const sale = makeSale(SaleStatus.CANCELLED);
    const repo = makeRepo(sale);
    const useCase = new GenerateInvoiceUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow(
      'Cannot generate invoice for a sale with status "cancelled"'
    );
  });

  it('llama al repositorio con el id correcto', async () => {
    const sale = makeSale(SaleStatus.COMPLETED);
    const repo = makeRepo(sale);
    const useCase = new GenerateInvoiceUseCase(repo);

    await useCase.execute('sale-1');

    expect(repo.findById).toHaveBeenCalledWith('sale-1');
  });
});
