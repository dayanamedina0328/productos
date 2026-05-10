import { describe, it, expect } from 'vitest';
import { ProductMapper } from './ProductMapper';
import type { ProductApiResponse } from './ProductMapper';

function makeRaw(overrides: Partial<ProductApiResponse> = {}): ProductApiResponse {
  return {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Producto A',
    description: 'Descripción',
    price: '10.50',
    cost: '5.00',
    stock: '20',
    min_stock: '3',
    category: { id: 'cat-1', name: 'Categoría', level: 1, is_active: true },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    ...overrides,
  };
}

describe('ProductMapper.toDomain', () => {
  it('convierte correctamente los campos básicos', () => {
    const product = ProductMapper.toDomain(makeRaw());
    expect(product.id).toBe('prod-1');
    expect(product.sku).toBe('SKU-001');
    expect(product.name).toBe('Producto A');
  });

  it('convierte precio y costo de string a number', () => {
    const product = ProductMapper.toDomain(makeRaw({ price: '99.99', cost: '50.00' }));
    expect(product.price).toBe(99.99);
    expect(product.cost).toBe(50);
  });

  it('convierte stock y minStock de string a number', () => {
    const product = ProductMapper.toDomain(makeRaw({ stock: '15', min_stock: '5' }));
    expect(product.stock).toBe(15);
    expect(product.minStock).toBe(5);
  });

  it('acepta minStock en formato camelCase', () => {
    const product = ProductMapper.toDomain(makeRaw({ minStock: '7', min_stock: undefined }));
    expect(product.minStock).toBe(7);
  });

  it('convierte imageUrl desde snake_case', () => {
    const product = ProductMapper.toDomain(makeRaw({ image_url: 'https://img.com/p.jpg' }));
    expect(product.imageUrl).toBe('https://img.com/p.jpg');
  });

  it('convierte imageUrl desde camelCase', () => {
    const product = ProductMapper.toDomain(makeRaw({ imageUrl: 'https://img.com/p2.jpg' }));
    expect(product.imageUrl).toBe('https://img.com/p2.jpg');
  });

  it('convierte createdAt a Date', () => {
    const product = ProductMapper.toDomain(makeRaw());
    expect(product.createdAt).toBeInstanceOf(Date);
  });

  it('mapea la categoría correctamente', () => {
    const product = ProductMapper.toDomain(makeRaw());
    expect(product.category.id).toBe('cat-1');
    expect(product.category.name).toBe('Categoría');
    expect(product.category.isActive).toBe(true);
  });

  it('toDomainList convierte un array', () => {
    const list = ProductMapper.toDomainList([makeRaw(), makeRaw({ id: 'prod-2' })]);
    expect(list).toHaveLength(2);
    expect(list[1].id).toBe('prod-2');
  });
});
