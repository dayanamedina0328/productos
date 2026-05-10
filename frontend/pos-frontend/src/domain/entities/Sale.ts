import type { Product } from './Product';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  MIXED = 'mixed',
}

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface PaymentDetails {
  cashReceived?: number;
  cardDetails?: { lastFourDigits: string; authorizationCode: string };
  transferReference?: string;
}

export interface SaleItem {
  readonly id: string;
  readonly product: Product;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly discount: number;
  readonly subtotal: number;
}

export interface Sale {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly customerId?: string;
  readonly items: SaleItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly paymentMethod: PaymentMethod;
  readonly paymentDetails: PaymentDetails;
  readonly status: SaleStatus;
  readonly createdAt: Date;
  readonly createdBy: string;
}
