import { describe, it, expect, vi } from 'vitest';
import { GetCustomersUseCase } from './GetCustomersUseCase';
import type { CustomerRepository } from '../../domain/ports/CustomerRepository';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { Customer } from '../../domain/entities/Customer';
import { CustomerType } from '../../domain/entities/Customer';

function makePaginatedCustomers(items: Customer[] = []): PaginatedResponse<Customer> {
  return {
    items,
    pagination: { page: 1, pageSize: 10, totalItems: items.length, totalPages: 1, hasNext: false, hasPrevious: false },
  };
}

function makeRepo(response: PaginatedResponse<Customer>): CustomerRepository {
  return {
    findAll: vi.fn().mockResolvedValue(response),
    findById: vi.fn(),
    save: vi.fn(),
  };
}

describe('GetCustomersUseCase', () => {
  it('retorna la lista de clientes sin filtros', async () => {
    const response = makePaginatedCustomers();
    const repo = makeRepo(response);
    const useCase = new GetCustomersUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual(response);
    expect(repo.findAll).toHaveBeenCalledWith(undefined);
  });

  it('pasa los filtros al repositorio', async () => {
    const response = makePaginatedCustomers();
    const repo = makeRepo(response);
    const useCase = new GetCustomersUseCase(repo);

    const filters = { type: CustomerType.VIP, page: 1, pageSize: 20 };
    await useCase.execute(filters);

    expect(repo.findAll).toHaveBeenCalledWith(filters);
  });

  it('retorna la respuesta paginada correctamente', async () => {
    const customer: Customer = {
      id: 'cust-1',
      name: 'Ana García',
      nit: '12345678',
      type: CustomerType.REGULAR,
      isActive: true,
      createdAt: new Date(),
    };
    const response = makePaginatedCustomers([customer]);
    const repo = makeRepo(response);
    const useCase = new GetCustomersUseCase(repo);

    const result = await useCase.execute();

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Ana García');
  });
});
