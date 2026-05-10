import { describe, it, expect, vi } from 'vitest';
import { GetSalesHistoryUseCase } from './GetSalesHistoryUseCase';
import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { Sale } from '../../domain/entities/Sale';
import { SaleStatus, PaymentMethod } from '../../domain/entities/Sale';

function makePaginatedSales(items: Sale[] = []): PaginatedResponse<Sale> {
  return {
    items,
    pagination: { page: 1, pageSize: 10, totalItems: items.length, totalPages: 1, hasNext: false, hasPrevious: false },
  };
}

function makeRepo(response: PaginatedResponse<Sale>): SaleRepository {
  return {
    findAll: vi.fn().mockResolvedValue(response),
    findById: vi.fn(),
    save: vi.fn(),
    cancel: vi.fn(),
  };
}

describe('GetSalesHistoryUseCase', () => {
  it('retorna el historial de ventas sin filtros', async () => {
    const response = makePaginatedSales();
    const repo = makeRepo(response);
    const useCase = new GetSalesHistoryUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual(response);
    expect(repo.findAll).toHaveBeenCalledWith(undefined);
  });

  it('pasa los filtros al repositorio', async () => {
    const response = makePaginatedSales();
    const repo = makeRepo(response);
    const useCase = new GetSalesHistoryUseCase(repo);

    const filters = {
      status: SaleStatus.COMPLETED,
      paymentMethod: PaymentMethod.CASH,
      page: 2,
      pageSize: 5,
    };

    await useCase.execute(filters);

    expect(repo.findAll).toHaveBeenCalledWith(filters);
  });

  it('retorna la respuesta paginada correctamente', async () => {
    const sale: Sale = {
      id: 'sale-1',
      invoiceNumber: 'INV-001',
      items: [],
      subtotal: 100,
      tax: 19,
      discount: 0,
      total: 119,
      paymentMethod: PaymentMethod.CASH,
      paymentDetails: {},
      status: SaleStatus.COMPLETED,
      createdAt: new Date(),
      createdBy: 'user-1',
    };
    const response = makePaginatedSales([sale]);
    const repo = makeRepo(response);
    const useCase = new GetSalesHistoryUseCase(repo);

    const result = await useCase.execute();

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('sale-1');
    expect(result.pagination.totalItems).toBe(1);
  });
});
