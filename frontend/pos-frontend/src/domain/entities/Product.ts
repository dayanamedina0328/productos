import type { Category } from './Category';

export interface Product {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly cost: number;
  readonly stock: number;
  readonly minStock: number;
  readonly category: Category;
  readonly imageUrl?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
