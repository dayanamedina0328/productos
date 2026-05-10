import { describe, it, expect } from 'vitest';
import { CashPaymentGateway } from './CashPaymentGateway';

describe('CashPaymentGateway', () => {
  const gateway = new CashPaymentGateway();

  it('procesa el pago cuando el monto recibido es suficiente', async () => {
    const result = await gateway.process(100, { cashReceived: 100 });
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
  });

  it('procesa el pago cuando hay cambio a devolver', async () => {
    const result = await gateway.process(100, { cashReceived: 150 });
    expect(result.success).toBe(true);
  });

  it('rechaza cuando el monto recibido es insuficiente', async () => {
    const result = await gateway.process(100, { cashReceived: 50 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('100.00');
    expect(result.error).toContain('50.00');
  });

  it('rechaza cuando cashReceived es 0', async () => {
    const result = await gateway.process(100, { cashReceived: 0 });
    expect(result.success).toBe(false);
  });

  it('calculateChange retorna el cambio correcto', () => {
    expect(gateway.calculateChange(100, 150)).toBe(50);
  });

  it('calculateChange retorna 0 cuando no hay cambio', () => {
    expect(gateway.calculateChange(100, 100)).toBe(0);
  });

  it('calculateChange retorna 0 cuando el recibido es menor (no negativo)', () => {
    expect(gateway.calculateChange(100, 80)).toBe(0);
  });
});
