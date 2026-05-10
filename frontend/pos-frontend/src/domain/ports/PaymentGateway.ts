import type { PaymentDetails } from '../entities/Sale';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentGateway {
  process(amount: number, details: PaymentDetails): Promise<PaymentResult>;
}
