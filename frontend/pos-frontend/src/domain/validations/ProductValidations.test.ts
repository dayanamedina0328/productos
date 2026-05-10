import { describe, it, expect } from 'vitest';
import { ProductValidations } from './ProductValidations';
import { isProductAvailable, getStockStatus } from './productHelpers';

// ---------------------------------------------------------------------------
// ProductValidations.validatePrice
// ---------------------------------------------------------------------------

describe('ProductValidations.validatePrice', () => {
  it('acepta un precio válido', () => {
    expect(ProductValidations.validatePrice(100).isValid).toBe(true);
  });

  it('rechaza precio igual a 0', () => {
    const result = ProductValidations.validatePrice(0);
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('rechaza precio negativo', () => {
    expect(ProductValidations.validatePrice(-1).isValid).toBe(false);
  });

  it('rechaza precio mayor a 999 999', () => {
    expect(ProductValidations.validatePrice(1_000_000).isValid).toBe(false);
  });

  it('acepta precio exactamente en el límite superior (999 999)', () => {
    expect(ProductValidations.validatePrice(999_999).isValid).toBe(true);
  });

  it('acepta precio decimal válido', () => {
    expect(ProductValidations.validatePrice(9.99).isValid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ProductValidations.validateStock
// ---------------------------------------------------------------------------

describe('ProductValidations.validateStock', () => {
  it('acepta stock válido por encima del mínimo', () => {
    expect(ProductValidations.validateStock(10, 5).isValid).toBe(true);
  });

  it('acepta stock igual al mínimo', () => {
    expect(ProductValidations.validateStock(5, 5).isValid).toBe(true);
  });

  it('rechaza stock negativo', () => {
    expect(ProductValidations.validateStock(-1, 0).isValid).toBe(false);
  });

  it('rechaza stock por debajo del mínimo', () => {
    const result = ProductValidations.validateStock(2, 5);
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('acepta stock 0 cuando minStock es 0', () => {
    expect(ProductValidations.validateStock(0, 0).isValid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isProductAvailable
// ---------------------------------------------------------------------------

describe('isProductAvailable', () => {
  const base = {
    id: '1', sku: 'SKU-001', name: 'P', description: '', price: 10, cost: 5,
    minStock: 1, category: { id: 'c1', name: 'Cat', level: 1, isActive: true },
    createdAt: new Date(), updatedAt: new Date(),
  };

  it('retorna true cuando el producto está activo y tiene stock', () => {
    expect(isProductAvailable({ ...base, stock: 5, isActive: true })).toBe(true);
  });

  it('retorna false cuando el producto está inactivo', () => {
    expect(isProductAvailable({ ...base, stock: 5, isActive: false })).toBe(false);
  });

  it('retorna false cuando el stock es 0', () => {
    expect(isProductAvailable({ ...base, stock: 0, isActive: true })).toBe(false);
  });

  it('retorna false cuando está inactivo y sin stock', () => {
    expect(isProductAvailable({ ...base, stock: 0, isActive: false })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getStockStatus
// ---------------------------------------------------------------------------

describe('getStockStatus', () => {
  it('retorna "out" cuando stock es 0', () => {
    expect(getStockStatus(0, 5)).toBe('out');
  });

  it('retorna "low" cuando stock es igual al mínimo', () => {
    expect(getStockStatus(5, 5)).toBe('low');
  });

  it('retorna "low" cuando stock es menor al mínimo pero mayor a 0', () => {
    expect(getStockStatus(3, 5)).toBe('low');
  });

  it('retorna "ok" cuando stock supera el mínimo', () => {
    expect(getStockStatus(10, 5)).toBe('ok');
  });

  it('retorna "ok" cuando minStock es 0 y hay stock', () => {
    expect(getStockStatus(1, 0)).toBe('ok');
  });
});
