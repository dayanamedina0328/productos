import { describe, it, expect, vi } from 'vitest';
import { CreateProductUseCase } from './CreateProductUseCase';
import type { ProductRepository, CreateProductRequest } from '../../domain/ports/ProductRepository';
import type { Product } from '../../domain/entities/Product';

function makeProduct(): Product {
  return {
    id: 'prod-1', sku: 'SKU-001', name: 'Producto A', description: 'Desc',
    price: 10, cost: 5, stock: 20, minStock: 2, isActive: true,
    category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makeRepo(): ProductRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn().mockResolvedValue(makeProduct()),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

const validRequest: CreateProductRequest = {
  sku: 'SKU-001', name: 'Producto A', description: 'Desc',
  price: 10, cost: 5, stock: 20, minStock: 2, categoryId: 'c1',
};

describe('CreateProductUseCase', () => {
  it('crea un producto con datos válidos', async () => {
    const repo = makeRepo();
    const useCase = new CreateProductUseCase(repo);

    const result = await useCase.execute(validRequest);

    expect(result.id).toBe('prod-1');
    expect(repo.save).toHaveBeenCalledWith(validRequest);
  });

  it('lanza error si el precio es 0', async () => {
    const repo = makeRepo();
    const useCase = new CreateProductUseCase(repo);

    await expect(useCase.execute({ ...validRequest, price: 0 })).rejects.toThrow();
  });

  it('lanza error si el precio es negativo', async () => {
    const repo = makeRepo();
    const useCase = new CreateProductUseCase(repo);

    await expect(useCase.execute({ ...validRequest, price: -5 })).rejects.toThrow();
  });

  it('lanza error si el stock es negativo', async () => {
    const repo = makeRepo();
    const useCase = new CreateProductUseCase(repo);

    await expect(useCase.execute({ ...validRequest, stock: -1 })).rejects.toThrow();
  });
});
