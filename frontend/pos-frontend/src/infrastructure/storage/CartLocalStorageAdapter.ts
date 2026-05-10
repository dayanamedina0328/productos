import type { CartRepository, CreateCartRequest, AddToCartRequest } from '../../domain/ports/CartRepository';
import type { Cart, CartItem } from '../../domain/entities/Cart';

const STORAGE_KEY = 'pos_active_cart';

/**
 * CartLocalStorageAdapter — persiste el carrito activo en localStorage.
 * Permite que el carrito sobreviva recargas de página.
 * Implementa CartRepository completo para ser intercambiable con CartAPIAdapter.
 */
export class CartLocalStorageAdapter implements CartRepository {
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private load(): Cart | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Cart;
      // Restaurar fechas como objetos Date
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch {
      return null;
    }
  }

  private persist(cart: Cart): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  private recalculate(cart: Cart): Cart {
    const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    const discount = cart.items.reduce((sum, i) => sum + (i.unitPrice * i.quantity * i.discount) / 100, 0);
    const tax = (subtotal - discount) * 0.19; // IVA 19%
    const total = subtotal - discount + tax;

    return { ...cart, subtotal, discount, tax, total, updatedAt: new Date() };
  }

  async findById(id: string): Promise<Cart> {
    const cart = this.load();
    if (!cart || cart.id !== id) {
      throw new Error(`Cart "${id}" not found in localStorage`);
    }
    return cart;
  }

  async save(request: CreateCartRequest): Promise<Cart> {
    const now = new Date();
    const cart: Cart = {
      id: this.generateId(),
      items: [],
      customerId: request.customerId,
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.persist(cart);
    return cart;
  }

  async addItem(cartId: string, request: AddToCartRequest): Promise<Cart> {
    const cart = await this.findById(cartId);

    const existingIndex = cart.items.findIndex(
      (i) => i.product.id === request.productId
    );

    let updatedItems: CartItem[];

    if (existingIndex >= 0) {
      // Incrementar cantidad del ítem existente
      const existing = cart.items[existingIndex];
      const newQty = existing.quantity + request.quantity;
      const updatedItem: CartItem = {
        ...existing,
        quantity: newQty,
        subtotal: existing.unitPrice * newQty * (1 - existing.discount / 100),
      };
      updatedItems = cart.items.map((item, idx) =>
        idx === existingIndex ? updatedItem : item
      );
    } else {
      // Agregar nuevo ítem (el precio viene del producto en el carrito)
      // En un escenario real, el precio se obtendría del ProductRepository
      const newItem: CartItem = {
        id: this.generateId(),
        product: {
          id: request.productId,
          sku: '',
          name: '',
          description: '',
          price: 0,
          cost: 0,
          stock: 0,
          minStock: 0,
          category: { id: '', name: '', level: 1, isActive: true },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        quantity: request.quantity,
        unitPrice: 0,
        discount: 0,
        subtotal: 0,
      };
      updatedItems = [...cart.items, newItem];
    }

    const updated = this.recalculate({ ...cart, items: updatedItems });
    this.persist(updated);
    return updated;
  }

  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.findById(cartId);
    const updatedItems = cart.items.filter((i) => i.id !== itemId);
    const updated = this.recalculate({ ...cart, items: updatedItems });
    this.persist(updated);
    return updated;
  }

  async clear(cartId: string): Promise<void> {
    const cart = await this.findById(cartId);
    const cleared = this.recalculate({ ...cart, items: [] });
    this.persist(cleared);
  }
}
