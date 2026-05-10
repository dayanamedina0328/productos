import { describe, it, expect } from 'vitest';
import { CardPaymentGateway } from './CardPaymentGateway';

describe('CardPaymentGateway', () => {
  const gateway = new CardPaymentGateway();

  it('procesa el pago con datos válidos', async () => {
    const result = await gateway.process(100, {
      cardDetails: { lastFourDigits: '1234', authorizationCode: 'AUTH-001' },
    });
    expect(result.success).toBe(true);
    expect(result.transactionId).toContain('1234');
  });

  it('rechaza cuando no hay datos de tarjeta', async () => {
    const result = await gateway.process(100, {});
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rechaza cuando los últimos 4 dígitos son inválidos (letras)', async () => {
    const result = await gateway.process(100, {
      cardDetails: { lastFourDigits: 'ABCD', authorizationCode: 'AUTH-001' },
    });
    expect(result.success).toBe(false);
  });

  it('rechaza cuando los últimos 4 dígitos tienen menos de 4 caracteres', async () => {
    const result = await gateway.process(100, {
      cardDetails: { lastFourDigits: '123', authorizationCode: 'AUTH-001' },
    });
    expect(result.success).toBe(false);
  });

  it('rechaza cuando el código de autorización está vacío', async () => {
    const result = await gateway.process(100, {
      cardDetails: { lastFourDigits: '1234', authorizationCode: '' },
    });
    expect(result.success).toBe(false);
  });

  it('rechaza cuando el código de autorización es solo espacios', async () => {
    const result = await gateway.process(100, {
      cardDetails: { lastFourDigits: '1234', authorizationCode: '   ' },
    });
    expect(result.success).toBe(false);
  });
});
