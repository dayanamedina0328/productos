import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CacheManager } from './CacheManager';

describe('CacheManager', () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('almacena y recupera un valor', () => {
    cache.set('key1', { data: 42 });
    expect(cache.get('key1')).toEqual({ data: 42 });
  });

  it('retorna null para una clave inexistente', () => {
    expect(cache.get('no-existe')).toBeNull();
  });

  it('has() retorna true para clave existente', () => {
    cache.set('key2', 'valor');
    expect(cache.has('key2')).toBe(true);
  });

  it('has() retorna false para clave inexistente', () => {
    expect(cache.has('no-existe')).toBe(false);
  });

  it('expira la entrada después del TTL', () => {
    cache.registerPolicy('test:', { ttl: 1000 });
    cache.set('test:item', 'valor');

    vi.advanceTimersByTime(1001);

    expect(cache.get('test:item')).toBeNull();
  });

  it('no expira antes del TTL', () => {
    cache.registerPolicy('test:', { ttl: 1000 });
    cache.set('test:item', 'valor');

    vi.advanceTimersByTime(999);

    expect(cache.get('test:item')).toBe('valor');
  });

  it('invalidate() elimina una clave específica', () => {
    cache.set('key3', 'valor');
    cache.invalidate('key3');
    expect(cache.get('key3')).toBeNull();
  });

  it('invalidateByPrefix() elimina todas las claves con ese prefijo', () => {
    cache.set('products:1', 'a');
    cache.set('products:2', 'b');
    cache.set('customers:1', 'c');

    cache.invalidateByPrefix('products:');

    expect(cache.get('products:1')).toBeNull();
    expect(cache.get('products:2')).toBeNull();
    expect(cache.get('customers:1')).toBe('c');
  });

  it('clear() elimina todas las entradas', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBeNull();
  });

  it('purgeExpired() elimina solo las entradas expiradas', () => {
    cache.registerPolicy('short:', { ttl: 500 });
    cache.registerPolicy('long:', { ttl: 5000 });

    cache.set('short:item', 'expira');
    cache.set('long:item', 'persiste');

    vi.advanceTimersByTime(600);
    cache.purgeExpired();

    expect(cache.get('short:item')).toBeNull();
    expect(cache.get('long:item')).toBe('persiste');
  });
});
