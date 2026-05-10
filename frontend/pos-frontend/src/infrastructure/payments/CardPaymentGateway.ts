import type { PaymentGateway, PaymentResult } from '../../domain/ports/PaymentGateway';
import type { PaymentDetails } from '../../domain/entities/Sale';

/**
 * CardPaymentGateway — procesa pagos con tarjeta.
 * Valida los datos de la tarjeta (últimos 4 dígitos y código de autorización).
 * En producción, este gateway se conectaría a un proveedor de pagos real.
 */
export class CardPaymentGateway implements PaymentGateway {
  async process(_amount: number, details: PaymentDetails): Promise<PaymentResult> {
    const card = details.cardDetails;

    if (!card) {
      return { success: false, error: 'Se requieren los datos de la tarjeta' };
    }

    if (!card.lastFourDigits || !/^\d{4}$/.test(card.lastFourDigits)) {
      return { success: false, error: 'Los últimos 4 dígitos de la tarjeta son inválidos' };
    }

    if (!card.authorizationCode || card.authorizationCode.trim().length === 0) {
      return { success: false, error: 'El código de autorización es requerido' };
    }

    // Tokenización simulada: en producción se enviaría al proveedor de pagos
    const tokenized = this.tokenize(card.lastFourDigits, card.authorizationCode);

    return {
      success: true,
      transactionId: tokenized,
    };
  }

  /** Genera un token de transacción (simulado) */
  private tokenize(lastFour: string, authCode: string): string {
    return `CARD-${lastFour}-${authCode.toUpperCase()}-${Date.now()}`;
  }
}
