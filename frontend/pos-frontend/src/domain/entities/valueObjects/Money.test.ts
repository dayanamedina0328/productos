import { describe, it, expect } from 'vitest';
import { Money } from './Money';

describe('Money', () => {
  it('crea un valor monetario', () => {
    expect(new Money(10.5).value).toBe(10.5);
  });

  it('redondea correctamente los centavos', () => {
    expect(new Money(0.1 + 0.2).value).toBe(0.3);
  });

  it('suma dos valores', () => {
    expect(new Money(10).add(new Money(5)).value).toBe(15);
  });

  it('resta dos valores', () => {
    expect(new Money(10).subtract(new Money(3)).value).toBe(7);
  });

  it('multiplica por un factor', () => {
    expect(new Money(10).multiply(3).value).toBe(30);
  });

  it('isGreaterThan retorna true cuando es mayor', () => {
    expect(new Money(10).isGreaterThan(new Money(5))).toBe(true);
  });

  it('isGreaterThan retorna false cuando es menor', () => {
    expect(new Money(5).isGreaterThan(new Money(10))).toBe(false);
  });

  it('isLessThan retorna true cuando es menor', () => {
    expect(new Money(5).isLessThan(new Money(10))).toBe(true);
  });

  it('equals retorna true para valores iguales', () => {
    expect(new Money(10).equals(new Money(10))).toBe(true);
  });

  it('equals retorna false para valores distintos', () => {
    expect(new Money(10).equals(new Money(11))).toBe(false);
  });

  it('toString formatea con símbolo de dólar', () => {
    expect(new Money(9.99).toString()).toBe('$9.99');
  });
});
