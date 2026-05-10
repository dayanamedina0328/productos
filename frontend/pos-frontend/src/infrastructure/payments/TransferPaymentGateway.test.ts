import { describe, it, expect } from 'vitest';
import { TransferPaymentGateway } from './TransferPaymentGateway';

describe('TransferPaymentGateway', () => {
  const gateway = new TransferPaymentGateway();

  it('procesa el pago con referencia válida', async () => {
    const result = await gateway.process(100, { transferReference: 'REF-123456' });
    expect(result.success).toBe(true);
    expect(result.transactionId).toContain('REF-123456');
  });

  it('rechaza cuando no hay referencia', async () => {
    const result = await gateway.process(100, {});
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rechaza cuando la referencia está vacía', async () => {
    const result = await gateway.process(100, { transferReference: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza cuando la referencia es solo espacios', async () => {
    const result = await gateway.process(100, { transferReference: '   ' });
    expect(result.success).toBe(false);
  });

  it('rechaza cuando la referencia tiene menos de 6 caracteres', async () => {
    const result = await gateway.process(100, { transferReference: 'REF' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('6');
  });

  it('acepta referencia exactamente de 6 caracteres', async () => {
    const result = await gateway.process(100, { transferReference: 'REF001' });
    expect(result.success).toBe(true);
  });
});
