import { describe, it, expect, beforeEach } from 'vitest';
import { CartLocalStorageAdapter } from './CartLocalStorageAdapter';

describe('CartLocalStorageAdapter', () => {
  let adapter: CartLocalStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new CartLocalStorageAdapter();
  });

  it('crea un carrito nuevo y lo persiste', async () => {
    const cart = await adapter.save({});
    expect(cart.id).toBeDefined();
    expect(cart.items).toHaveLength(0);
    expect(localStorage.getItem('pos_active_cart')).not.toBeNull();
  });

  it('recupera el carrito por id', async () => {
    const created = await adapter.save({});
    const found = await adapter.findById(created.id);
    expect(found.id).toBe(created.id);
  });

  it('lanza error si el id no coincide', async () => {
    await adapter.save({});
    await expect(adapter.findById('id-inexistente')).rejects.toThrow();
  });

  it('elimina un ítem del carrito', async () => {
    const cart = await adapter.save({});
    // Agregar ítem manualmente al localStorage para simular estado
    const withItem = {
      ...cart,
      items: [{
        id: 'item-1',
        product: { id: 'p1', sku: 'S', name: 'P', description: '', price: 10, cost: 5, stock: 10, minStock: 1, category: { id: 'c', name: 'C', level: 1, isActive: true }, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        quantity: 2, unitPrice: 10, discount: 0, subtotal: 20,
      }],
      subtotal: 20, tax: 3.8, total: 23.8,
    };
    localStorage.setItem('pos_active_cart', JSON.stringify(withItem));

    const updated = await adapter.removeItem(cart.id, 'item-1');
    expect(updated.items).toHaveLength(0);
  });

  it('vacía el carrito con clear()', async () => {
    const cart = await adapter.save({});
    const withItem = {
      ...cart,
      items: [{ id: 'item-1', product: { id: 'p1', sku: 'S', name: 'P', description: '', price: 10, cost: 5, stock: 10, minStock: 1, category: { id: 'c', name: 'C', level: 1, isActive: true }, isActive: true, createdAt: new Date(), updatedAt: new Date() }, quantity: 1, unitPrice: 10, discount: 0, subtotal: 10 }],
      subtotal: 10, tax: 1.9, total: 11.9,
    };
    localStorage.setItem('pos_active_cart', JSON.stringify(withItem));

    await adapter.clear(cart.id);
    const cleared = await adapter.findById(cart.id);
    expect(cleared.items).toHaveLength(0);
    expect(cleared.total).toBe(0);
  });

  it('crea el carrito con customerId si se proporciona', async () => {
    const cart = await adapter.save({ customerId: 'cust-99' });
    expect(cart.customerId).toBe('cust-99');
  });
});
