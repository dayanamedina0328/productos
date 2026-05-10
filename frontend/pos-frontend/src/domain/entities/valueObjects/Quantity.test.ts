import { describe, it, expect } from 'vitest';
import { Quantity } from './Quantity';

describe('Quantity', () => {
  it('crea una cantidad válida', () => {
    expect(Quantity.create(5).amount).toBe(5);
  });

  it('lanza error para cantidad no entera', () => {
    expect(() => Quantity.create(1.5)).toThrow('integer');
  });

  it('lanza error para cantidad menor al mínimo', () => {
    expect(() => Quantity.create(0)).toThrow('less than 1');
  });

  it('lanza error para cantidad mayor al máximo', () => {
    expect(() => Quantity.create(10000)).toThrow('exceed 9999');
  });

  it('acepta cantidad en el límite mínimo', () => {
    expect(Quantity.create(1).amount).toBe(1);
  });

  it('acepta cantidad en el límite máximo', () => {
    expect(Quantity.create(9999).amount).toBe(9999);
  });

  it('increment aumenta en 1', () => {
    expect(Quantity.create(5).increment().amount).toBe(6);
  });

  it('decrement disminuye en 1', () => {
    expect(Quantity.create(5).decrement().amount).toBe(4);
  });

  it('decrement lanza error si llega por debajo del mínimo', () => {
    expect(() => Quantity.create(1).decrement()).toThrow();
  });

  it('equals retorna true para cantidades iguales', () => {
    expect(Quantity.create(5).equals(Quantity.create(5))).toBe(true);
  });

  it('equals retorna false para cantidades distintas', () => {
    expect(Quantity.create(5).equals(Quantity.create(6))).toBe(false);
  });

  it('acepta min y max personalizados', () => {
    expect(Quantity.create(5, 2, 10).amount).toBe(5);
    expect(() => Quantity.create(1, 2, 10)).toThrow();
    expect(() => Quantity.create(11, 2, 10)).toThrow();
  });
});
