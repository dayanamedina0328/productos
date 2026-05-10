import type { Product } from '../entities/Product';

export function isProductAvailable(product: Product): boolean {
  return product.isActive && product.stock > 0;
}

export function getStockStatus(stock: number, minStock: number): 'ok' | 'low' | 'out' {
  if (stock === 0) return 'out';
  if (stock <= minStock) return 'low';
  return 'ok';
}
