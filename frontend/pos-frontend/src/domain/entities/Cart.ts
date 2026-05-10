import type { Product } from './Product';

export interface CartItem {
  readonly id: string;
  readonly product: Product;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly discount: number;
  readonly subtotal: number;
}

export interface Cart {
  readonly id: string;
  readonly items: CartItem[];
  readonly customerId?: string;
  readonly subtotal: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
