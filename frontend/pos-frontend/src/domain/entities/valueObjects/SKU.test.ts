import { describe, it, expect } from 'vitest';
import { SKU } from './SKU';

describe('SKU', () => {
  it('crea un SKU válido', () => {
    expect(SKU.create('ABC-123').toString()).toBe('ABC-123');
  });

  it('normaliza a mayúsculas', () => {
    expect(SKU.create('abc-123').toString()).toBe('ABC-123');
  });

  it('elimina espacios al inicio y final', () => {
    expect(SKU.create('  SKU-001  ').toString()).toBe('SKU-001');
  });

  it('lanza error para SKU demasiado corto (< 3 chars)', () => {
    expect(() => SKU.create('AB')).toThrow('Invalid SKU format');
  });

  it('lanza error para SKU demasiado largo (> 20 chars)', () => {
    expect(() => SKU.create('A'.repeat(21))).toThrow('Invalid SKU format');
  });

  it('lanza error para SKU con caracteres especiales', () => {
    expect(() => SKU.create('SKU@001')).toThrow('Invalid SKU format');
  });

  it('isValid retorna true para SKU válido', () => {
    expect(SKU.isValid('SKU-001')).toBe(true);
  });

  it('isValid retorna false para SKU inválido', () => {
    expect(SKU.isValid('ab')).toBe(false);
  });

  it('acepta SKU con solo números', () => {
    expect(SKU.create('12345').toString()).toBe('12345');
  });
});
