import { describe, it, expect, vi } from 'vitest';
import { CancelSaleUseCase } from './CancelSaleUseCase';
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
    cancel: vi.fn().mockResolvedValue({ ...sale, status: SaleStatus.CANCELLED }),
  };
}

describe('CancelSaleUseCase', () => {
  it('cancela una venta completada', async () => {
    const sale = makeSale(SaleStatus.COMPLETED);
    const repo = makeRepo(sale);
    const useCase = new CancelSaleUseCase(repo);

    const result = await useCase.execute('sale-1');

    expect(result.status).toBe(SaleStatus.CANCELLED);
    expect(repo.cancel).toHaveBeenCalledWith('sale-1');
  });

  it('cancela una venta pendiente', async () => {
    const sale = makeSale(SaleStatus.PENDING);
    const repo = makeRepo(sale);
    const useCase = new CancelSaleUseCase(repo);

    await useCase.execute('sale-1');

    expect(repo.cancel).toHaveBeenCalledWith('sale-1');
  });

  it('lanza error si la venta ya está cancelada', async () => {
    const sale = makeSale(SaleStatus.CANCELLED);
    const repo = makeRepo(sale);
    const useCase = new CancelSaleUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow('Sale is already cancelled');
  });

  it('lanza error si la venta ya fue reembolsada', async () => {
    const sale = makeSale(SaleStatus.REFUNDED);
    const repo = makeRepo(sale);
    const useCase = new CancelSaleUseCase(repo);

    await expect(useCase.execute('sale-1')).rejects.toThrow('Cannot cancel a refunded sale');
  });
});
