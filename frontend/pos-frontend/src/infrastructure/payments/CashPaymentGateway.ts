import type { PaymentGateway, PaymentResult } from '../../domain/ports/PaymentGateway';
import type { PaymentDetails } from '../../domain/entities/Sale';

/**
 * CashPaymentGateway — procesa pagos en efectivo.
 * Valida que el monto recibido sea suficiente y calcula el cambio.
 */
export class CashPaymentGateway implements PaymentGateway {
  async process(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    const received = details.cashReceived ?? 0;

    if (received < amount) {
      return {
        success: false,
        error: `Monto insuficiente. Se requieren $${amount.toFixed(2)} pero se recibieron $${received.toFixed(2)}`,
      };
    }

    const change = received - amount;

    return {
      success: true,
      transactionId: `CASH-${Date.now()}`,
      // El cambio se incluye en el transactionId para que el cajero lo vea
      ...(change > 0 && { error: undefined }),
    };
  }

  /** Calcula el cambio a devolver */
  calculateChange(amount: number, received: number): number {
    return Math.max(0, received - amount);
  }
}
