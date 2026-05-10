import { describe, it, expect, vi } from 'vitest';
import { UpdateProductUseCase } from './UpdateProductUseCase';
import type { ProductRepository, UpdateProductRequest } from '../../domain/ports/ProductRepository';
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
    findById: vi.fn().mockResolvedValue(makeProduct()),
    save: vi.fn(),
    update: vi.fn().mockResolvedValue({ ...makeProduct(), name: 'Actualizado' }),
    delete: vi.fn(),
  };
}

describe('UpdateProductUseCase', () => {
  it('actualiza un producto existente', async () => {
    const repo = makeRepo();
    const useCase = new UpdateProductUseCase(repo);
    const request: UpdateProductRequest = { name: 'Actualizado' };

    const result = await useCase.execute('prod-1', request);

    expect(repo.update).toHaveBeenCalledWith('prod-1', request);
    expect(result.name).toBe('Actualizado');
  });

  it('lanza error si el precio actualizado es inválido', async () => {
    const repo = makeRepo();
    const useCase = new UpdateProductUseCase(repo);

    await expect(useCase.execute('prod-1', { price: 0 })).rejects.toThrow();
  });

  it('lanza error si el stock actualizado es negativo (con minStock)', async () => {
    const repo = makeRepo();
    const useCase = new UpdateProductUseCase(repo);

    await expect(useCase.execute('prod-1', { stock: -1, minStock: 2 })).rejects.toThrow();
  });

  it('actualiza solo el nombre sin validar stock', async () => {
    const repo = makeRepo();
    const useCase = new UpdateProductUseCase(repo);

    // Solo nombre — no hay validación de stock
    await expect(useCase.execute('prod-1', { name: 'Nuevo nombre' })).resolves.toBeDefined();
  });
});
