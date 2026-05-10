import type { CustomerType } from '../../domain/entities/Customer';
import type { SaleStatus, PaymentMethod } from '../../domain/entities/Sale';

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CustomerFilters {
  type?: CustomerType;
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SaleFilters {
  customerId?: string;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}
