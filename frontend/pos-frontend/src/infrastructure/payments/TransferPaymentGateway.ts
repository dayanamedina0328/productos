import type { PaymentGateway, PaymentResult } from '../../domain/ports/PaymentGateway';
import type { PaymentDetails } from '../../domain/entities/Sale';

/**
 * TransferPaymentGateway — procesa pagos por transferencia bancaria.
 * Valida que se haya ingresado la referencia del comprobante.
 */
export class TransferPaymentGateway implements PaymentGateway {
  async process(_amount: number, details: PaymentDetails): Promise<PaymentResult> {
    const reference = details.transferReference?.trim();

    if (!reference || reference.length === 0) {
      return {
        success: false,
        error: 'La referencia de transferencia es requerida',
      };
    }

    if (reference.length < 6) {
      return {
        success: false,
        error: 'La referencia de transferencia debe tener al menos 6 caracteres',
      };
    }

    return {
      success: true,
      transactionId: `TRF-${reference.toUpperCase()}-${Date.now()}`,
    };
  }
}
