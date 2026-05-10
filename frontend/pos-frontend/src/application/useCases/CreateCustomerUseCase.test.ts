import { describe, it, expect, vi } from 'vitest';
import { CreateCustomerUseCase } from './CreateCustomerUseCase';
import type { CustomerRepository, CreateCustomerRequest } from '../../domain/ports/CustomerRepository';
import type { Customer } from '../../domain/entities/Customer';
import { CustomerType } from '../../domain/entities/Customer';

function makeCustomer(nit: string): Customer {
  return {
    id: 'cust-1',
    name: 'Ana García',
    nit,
    type: CustomerType.REGULAR,
    isActive: true,
    createdAt: new Date(),
  };
}

function makeRequest(nit: string): CreateCustomerRequest {
  return {
    name: 'Ana García',
    nit,
    type: CustomerType.REGULAR,
  };
}

function makeRepo(existingNit?: string): CustomerRepository {
  const existing = existingNit ? [makeCustomer(existingNit)] : [];
  return {
    findAll: vi.fn().mockResolvedValue({
      items: existing,
      pagination: { page: 1, pageSize: 10, totalItems: existing.length, totalPages: 1, hasNext: false, hasPrevious: false },
    }),
    findById: vi.fn(),
    save: vi.fn().mockImplementation((req: CreateCustomerRequest) =>
      Promise.resolve(makeCustomer(req.nit))
    ),
  };
}

describe('CreateCustomerUseCase', () => {
  it('crea un cliente con NIT único', async () => {
    const repo = makeRepo(); // sin clientes existentes
    const useCase = new CreateCustomerUseCase(repo);

    const result = await useCase.execute(makeRequest('99999999'));

    expect(result.nit).toBe('99999999');
    expect(repo.save).toHaveBeenCalled();
  });

  it('lanza error si el NIT ya existe', async () => {
    const repo = makeRepo('12345678'); // NIT ya registrado
    const useCase = new CreateCustomerUseCase(repo);

    await expect(useCase.execute(makeRequest('12345678'))).rejects.toThrow(
      'A customer with NIT "12345678" already exists'
    );
  });

  it('lanza error si el NIT está vacío', async () => {
    const repo = makeRepo();
    const useCase = new CreateCustomerUseCase(repo);

    await expect(useCase.execute(makeRequest(''))).rejects.toThrow('NIT is required');
  });

  it('lanza error si el NIT es solo espacios', async () => {
    const repo = makeRepo();
    const useCase = new CreateCustomerUseCase(repo);

    await expect(useCase.execute(makeRequest('   '))).rejects.toThrow('NIT is required');
  });

  it('no distingue mayúsculas al verificar duplicados de NIT', async () => {
    const repo = makeRepo('ABC-123');
    const useCase = new CreateCustomerUseCase(repo);

    await expect(useCase.execute(makeRequest('abc-123'))).rejects.toThrow(
      'A customer with NIT "abc-123" already exists'
    );
  });
});
