import { describe, it, expect } from 'vitest';
import { SaleMapper } from './SaleMapper';
import type { SaleApiResponse } from './SaleMapper';
import { PaymentMethod, SaleStatus } from '../../domain/entities/Sale';

function makeRaw(overrides: Partial<SaleApiResponse> = {}): SaleApiResponse {
  return {
    id: 'sale-1',
    invoice_number: 'INV-001',
    items: [],
    subtotal: '100.00',
    tax: '19.00',
    discount: '0',
    total: '119.00',
    payment_method: 'cash',
    payment_details: { cashReceived: 150 },
    status: 'completed',
    created_at: '2024-01-15T10:00:00Z',
    created_by: 'user-1',
    ...overrides,
  };
}

describe('SaleMapper.toDomain', () => {
  it('convierte los campos básicos', () => {
    const sale = SaleMapper.toDomain(makeRaw());
    expect(sale.id).toBe('sale-1');
    expect(sale.invoiceNumber).toBe('INV-001');
  });

  it('convierte los totales de string a number', () => {
    const sale = SaleMapper.toDomain(makeRaw());
    expect(sale.subtotal).toBe(100);
    expect(sale.tax).toBe(19);
    expect(sale.total).toBe(119);
  });

  it('mapea método de pago "cash" a PaymentMethod.CASH', () => {
    expect(SaleMapper.toDomain(makeRaw({ payment_method: 'cash' })).paymentMethod).toBe(PaymentMethod.CASH);
  });

  it('mapea método de pago "card" a PaymentMethod.CARD', () => {
    expect(SaleMapper.toDomain(makeRaw({ payment_method: 'card' })).paymentMethod).toBe(PaymentMethod.CARD);
  });

  it('mapea método de pago "transfer" a PaymentMethod.TRANSFER', () => {
    expect(SaleMapper.toDomain(makeRaw({ payment_method: 'transfer' })).paymentMethod).toBe(PaymentMethod.TRANSFER);
  });

  it('mapea estado "completed" a SaleStatus.COMPLETED', () => {
    expect(SaleMapper.toDomain(makeRaw({ status: 'completed' })).status).toBe(SaleStatus.COMPLETED);
  });

  it('mapea estado "cancelled" a SaleStatus.CANCELLED', () => {
    expect(SaleMapper.toDomain(makeRaw({ status: 'cancelled' })).status).toBe(SaleStatus.CANCELLED);
  });

  it('mapea estado "refunded" a SaleStatus.REFUNDED', () => {
    expect(SaleMapper.toDomain(makeRaw({ status: 'refunded' })).status).toBe(SaleStatus.REFUNDED);
  });

  it('acepta invoiceNumber en camelCase', () => {
    const sale = SaleMapper.toDomain(makeRaw({ invoiceNumber: 'INV-002', invoice_number: undefined }));
    expect(sale.invoiceNumber).toBe('INV-002');
  });

  it('convierte createdAt a Date', () => {
    expect(SaleMapper.toDomain(makeRaw()).createdAt).toBeInstanceOf(Date);
  });

  it('toDomainList convierte un array', () => {
    const list = SaleMapper.toDomainList([makeRaw(), makeRaw({ id: 'sale-2' })]);
    expect(list).toHaveLength(2);
    expect(list[1].id).toBe('sale-2');
  });
});
