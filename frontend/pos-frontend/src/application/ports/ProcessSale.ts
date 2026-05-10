import type { Sale, PaymentMethod, PaymentDetails } from '../../domain/entities/Sale';

export interface ProcessSaleRequest {
  cartId: string;
  customerId?: string;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
}

export interface ProcessSale {
  execute(request: ProcessSaleRequest): Promise<Sale>;
}
