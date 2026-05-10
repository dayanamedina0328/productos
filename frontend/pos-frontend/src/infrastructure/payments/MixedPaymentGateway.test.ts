import { describe, it, expect } from 'vitest';
import { MixedPaymentGateway } from './MixedPaymentGateway';
import type { MixedPaymentDetails } from './MixedPaymentGateway';

describe('MixedPaymentGateway', () => {
  const gateway = new MixedPaymentGateway();

  it('procesa pago mixto con efectivo y tarjeta', async () => {
    const details: MixedPaymentDetails = {
      cash: { amount: 50, received: 50 },
      card: { amount: 50, details: { cardDetails: { lastFourDigits: '1234', authorizationCode: 'AUTH-001' } } },
    };
    const result = await gateway.process(100, details as unknown as Parameters<typeof gateway.process>[1]);
    expect(result.success).toBe(true);
    expect(result.transactionId).toContain('MIXED');
  });

  it('rechaza cuando los montos parciales no cubren el total', async () => {
    const details: MixedPaymentDetails = {
      cash: { amount: 30, received: 30 },
    };
    const result = await gateway.process(100, details as unknown as Parameters<typeof gateway.process>[1]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('30.00');
  });

  it('rechaza si el pago en efectivo es insuficiente', async () => {
    const details: MixedPaymentDetails = {
      cash: { amount: 100, received: 50 },
    };
    const result = await gateway.process(100, details as unknown as Parameters<typeof gateway.process>[1]);
    expect(result.success).toBe(false);
  });

  it('procesa solo con transferencia', async () => {
    const details: MixedPaymentDetails = {
      transfer: { amount: 100, details: { transferReference: 'REF-123456' } },
    };
    const result = await gateway.process(100, details as unknown as Parameters<typeof gateway.process>[1]);
    expect(result.success).toBe(true);
  });
});
