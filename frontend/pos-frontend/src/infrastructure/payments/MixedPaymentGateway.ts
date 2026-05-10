import type { PaymentGateway, PaymentResult } from '../../domain/ports/PaymentGateway';
import type { PaymentDetails } from '../../domain/entities/Sale';
import { CashPaymentGateway } from './CashPaymentGateway';
import { CardPaymentGateway } from './CardPaymentGateway';
import { TransferPaymentGateway } from './TransferPaymentGateway';

export interface MixedPaymentDetails {
  cash?: { amount: number; received: number };
  card?: { amount: number; details: PaymentDetails };
  transfer?: { amount: number; details: PaymentDetails };
}

/**
 * MixedPaymentGateway — combina múltiples métodos de pago.
 * Valida que la suma de los montos parciales cubra el total.
 */
export class MixedPaymentGateway implements PaymentGateway {
  private readonly cashGateway = new CashPaymentGateway();
  private readonly cardGateway = new CardPaymentGateway();
  private readonly transferGateway = new TransferPaymentGateway();

  async process(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    const mixed = details as unknown as MixedPaymentDetails;

    const cashAmount = mixed.cash?.amount ?? 0;
    const cardAmount = mixed.card?.amount ?? 0;
    const transferAmount = mixed.transfer?.amount ?? 0;
    const totalCovered = cashAmount + cardAmount + transferAmount;

    if (totalCovered < amount) {
      return {
        success: false,
        error: `Los montos parciales ($${totalCovered.toFixed(2)}) no cubren el total ($${amount.toFixed(2)})`,
      };
    }

    const transactionIds: string[] = [];

    // Procesar efectivo
    if (cashAmount > 0 && mixed.cash) {
      const result = await this.cashGateway.process(cashAmount, {
        cashReceived: mixed.cash.received,
      });
      if (!result.success) return result;
      if (result.transactionId) transactionIds.push(result.transactionId);
    }

    // Procesar tarjeta
    if (cardAmount > 0 && mixed.card) {
      const result = await this.cardGateway.process(cardAmount, mixed.card.details);
      if (!result.success) return result;
      if (result.transactionId) transactionIds.push(result.transactionId);
    }

    // Procesar transferencia
    if (transferAmount > 0 && mixed.transfer) {
      const result = await this.transferGateway.process(transferAmount, mixed.transfer.details);
      if (!result.success) return result;
      if (result.transactionId) transactionIds.push(result.transactionId);
    }

    return {
      success: true,
      transactionId: `MIXED-${transactionIds.join('|')}`,
    };
  }
}
