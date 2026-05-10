import { describe, it, expect, vi } from 'vitest';
import { SearchCustomersUseCase } from './SearchCustomersUseCase';
import type { CustomerRepository } from '../../domain/ports/CustomerRepository';
import type { Customer } from '../../domain/entities/Customer';
import { CustomerType } from '../../domain/entities/Customer';

function makeCustomer(name: string, nit: string): Customer {
  return {
    id: `cust-${nit}`,
    name,
    nit,
    type: CustomerType.REGULAR,
    isActive: true,
    createdAt: new Date(),
  };
}

function makeRepo(items: Customer[] = []): CustomerRepository {
  return {
    findAll: vi.fn().mockResolvedValue({
      items,
      pagination: { page: 1, pageSize: 10, totalItems: items.length, totalPages: 1, hasNext: false, hasPrevious: false },
    }),
    findById: vi.fn(),
    save: vi.fn(),
  };
}

describe('SearchCustomersUseCase', () => {
  it('busca clientes con una consulta válida', async () => {
    const customers = [makeCustomer('Ana García', '12345678')];
    const repo = makeRepo(customers);
    const useCase = new SearchCustomersUseCase(repo);

    const result = await useCase.execute('Ana');

    expect(repo.findAll).toHaveBeenCalledWith({ search: 'Ana' });
    expect(result.items).toHaveLength(1);
  });

  it('retorna todos los clientes si la consulta está vacía', async () => {
    const repo = makeRepo();
    const useCase = new SearchCustomersUseCase(repo);

    await useCase.execute('');

    expect(repo.findAll).toHaveBeenCalledWith();
  });

  it('elimina espacios al inicio y final de la consulta', async () => {
    const repo = makeRepo();
    const useCase = new SearchCustomersUseCase(repo);

    await useCase.execute('  García  ');

    expect(repo.findAll).toHaveBeenCalledWith({ search: 'García' });
  });

  it('retorna todos los clientes si la consulta es solo espacios', async () => {
    const repo = makeRepo();
    const useCase = new SearchCustomersUseCase(repo);

    await useCase.execute('   ');

    expect(repo.findAll).toHaveBeenCalledWith();
  });
});
