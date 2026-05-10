import { describe, it, expect, vi } from 'vitest';
import { RefundSaleUseCase } from './RefundSaleUseCase';
import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { Sale } from '../../domain/entities/Sale';
import { PaymentMethod, SaleStatus } from '../../domain/entities/Sale';

function makeSale(status: SaleStatus): Sale {
  return {
    id: 'sale-1',
    invoiceNumber: 'INV-001',
    items: [],
    subtotal: 100,
    tax: 19,
    discount: 0,
    total: 119,
    paymentMethod: PaymentMethod.CASH,
    paymentDetails: {},
    status,
    createdAt: new Date(),
    createdBy: 'user-1',
  };
}

function makeRepo(sale: Sale): SaleRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn().mockResolvedValue(sale),
    save: vi.fn(),
    cancel: vi.fn().mockResolvedValue({ ...sale, status: SaleStatus.REFUNDED }),
  };
}

describe('RefundSaleUseCase', () => {
  it('reembolsa una venta completada', async () => {
    const sale = makeSale(SaleStatus.COMPLETED);
    const repo = makeRepo(sale);
    const useCase = new RefundSaleUseCase(repo);

    const result = await useCase.execute('sale-1');

    expect(result.status).toBe(SaleStatus.REFUNDED);
    expect(repo.cancel).toHaveBeenCalledWith('sale-1');
  });

  it('lanza error si la venta está pendiente', async () => {
    const sale = makeSale(SaleStatus.PENDING);
    const repo = makeRepo(sale);
    const useCase = new RefundSaleUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow(
      'Cannot refund a sale with status "pending"'
    );
  });

  it('lanza error si la venta ya fue cancelada', async () => {
    const sale = makeSale(SaleStatus.CANCELLED);
    const repo = makeRepo(sale);
    const useCase = new RefundSaleUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow(
      'Cannot refund a sale with status "cancelled"'
    );
  });

  it('lanza error si la venta ya fue reembolsada', async () => {
    const sale = makeSale(SaleStatus.REFUNDED);
    const repo = makeRepo(sale);
    const useCase = new RefundSaleUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow(
      'Cannot refund a sale with status "refunded"'
    );
  });
});
