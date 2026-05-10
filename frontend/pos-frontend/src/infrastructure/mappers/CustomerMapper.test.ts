import { describe, it, expect } from 'vitest';
import { CustomerMapper } from './CustomerMapper';
import type { CustomerApiResponse } from './CustomerMapper';
import { CustomerType } from '../../domain/entities/Customer';

function makeRaw(overrides: Partial<CustomerApiResponse> = {}): CustomerApiResponse {
  return {
    id: 'cust-1',
    name: 'Ana García',
    nit: '12345678',
    type: 'regular',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('CustomerMapper.toDomain', () => {
  it('convierte los campos básicos', () => {
    const c = CustomerMapper.toDomain(makeRaw());
    expect(c.id).toBe('cust-1');
    expect(c.name).toBe('Ana García');
    expect(c.nit).toBe('12345678');
  });

  it('mapea tipo "regular" a CustomerType.REGULAR', () => {
    expect(CustomerMapper.toDomain(makeRaw({ type: 'regular' })).type).toBe(CustomerType.REGULAR);
  });

  it('mapea tipo "vip" a CustomerType.VIP', () => {
    expect(CustomerMapper.toDomain(makeRaw({ type: 'vip' })).type).toBe(CustomerType.VIP);
  });

  it('mapea tipo "corporate" a CustomerType.CORPORATE', () => {
    expect(CustomerMapper.toDomain(makeRaw({ type: 'corporate' })).type).toBe(CustomerType.CORPORATE);
  });

  it('usa REGULAR como fallback para tipo desconocido', () => {
    expect(CustomerMapper.toDomain(makeRaw({ type: 'unknown' })).type).toBe(CustomerType.REGULAR);
  });

  it('convierte is_active a isActive', () => {
    expect(CustomerMapper.toDomain(makeRaw({ is_active: false })).isActive).toBe(false);
  });

  it('convierte creditLimit desde snake_case', () => {
    expect(CustomerMapper.toDomain(makeRaw({ credit_limit: 5000 })).creditLimit).toBe(5000);
  });

  it('convierte createdAt a Date', () => {
    expect(CustomerMapper.toDomain(makeRaw()).createdAt).toBeInstanceOf(Date);
  });

  it('toDomainList convierte un array', () => {
    const list = CustomerMapper.toDomainList([makeRaw(), makeRaw({ id: 'cust-2' })]);
    expect(list).toHaveLength(2);
  });
});
