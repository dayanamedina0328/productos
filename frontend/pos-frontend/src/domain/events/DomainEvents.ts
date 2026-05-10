import type { PaymentMethod } from '../entities/Sale';

export interface DomainEvent {
  id: string;
  timestamp: Date;
  aggregateId: string;
  eventType: string;
}

export interface ProductAddedToCart extends DomainEvent {
  eventType: 'ProductAddedToCart';
  data: { productId: string; cartId: string; quantity: number };
}

export interface SaleCompleted extends DomainEvent {
  eventType: 'SaleCompleted';
  data: { saleId: string; totalAmount: number; paymentMethod: PaymentMethod };
}

export interface StockUpdated extends DomainEvent {
  eventType: 'StockUpdated';
  data: { productId: string; newStock: number; previousStock: number };
}
