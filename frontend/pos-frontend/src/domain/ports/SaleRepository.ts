import type { Sale, PaymentMethod, PaymentDetails } from '../entities/Sale';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { SaleFilters } from '../../shared/types/Filters';

export interface ProcessSaleRequest {
  cartId: string;
  customerId?: string;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
}

export interface SaleRepository {
  findAll(filters?: SaleFilters): Promise<PaginatedResponse<Sale>>;
  findById(id: string): Promise<Sale>;
  save(request: ProcessSaleRequest): Promise<Sale>;
  cancel(id: string): Promise<Sale>;
}
