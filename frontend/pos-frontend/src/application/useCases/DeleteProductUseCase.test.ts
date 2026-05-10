import { describe, it, expect, vi } from 'vitest';
import { DeleteProductUseCase } from './DeleteProductUseCase';
import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { Product } from '../../domain/entities/Product';
import { SaleStatus, PaymentMethod } from '../../domain/entities/Sale';

function makeProduct(): Product {
  return {
    id: 'prod-1', sku: 'SKU-001', name: 'P', description: '', price: 10, cost: 5,
    stock: 10, minStock: 2, isActive: true,
    category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
  };
}

function makeRepos(salesItems: unknown[] = []) {
  const productRepository: ProductRepository = {
    findAll: vi.fn(),
    findById: vi.fn().mockResolvedValue(makeProduct()),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn().mockResolvedValue(undefined),
  };
  const saleRepository: SaleRepository = {
    findAll: vi.fn().mockResolvedValue({
      items: salesItems,
      pagination: { page: 1, pageSize: 10, totalItems: salesItems.length, totalPages: 1, hasNext: false, hasPrevious: false },
    }),
    findById: vi.fn(),
    save: vi.fn(),
    cancel: vi.fn(),
  };
  return { productRepository, saleRepository };
}

describe('DeleteProductUseCase', () => {
  it('elimina un producto sin ventas asociadas', async () => {
    const { productRepository, saleRepository } = makeRepos([]);
    const useCase = new DeleteProductUseCase(productRepository, saleRepository);

    await useCase.execute('prod-1');

    expect(productRepository.delete).toHaveBeenCalledWith('prod-1');
  });

  it('lanza error si el producto tiene ventas asociadas', async () => {
    const saleWithProduct = {
      id: 'sale-1',
      invoiceNumber: 'INV-001',
      items: [{ id: 'i1', product: makeProduct(), quantity: 1, unitPrice: 10, discount: 0, subtotal: 10 }],
      subtotal: 10, tax: 1.9, discount: 0, total: 11.9,
      paymentMethod: PaymentMethod.CASH,
      paymentDetails: {},
      status: SaleStatus.COMPLETED,
      createdAt: new Date(),
      createdBy: 'user-1',
    };
    const { productRepository, saleRepository } = makeRepos([saleWithProduct]);
    const useCase = new DeleteProductUseCase(productRepository, saleRepository);

    await expect(useCase.execute('prod-1')).rejects.toThrow();
  });
});
