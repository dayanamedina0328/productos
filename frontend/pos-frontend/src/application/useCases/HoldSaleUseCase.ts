import type { CartRepository } from '../../domain/ports/CartRepository';
import type { HoldSale } from '../ports/HoldSale';
import type { Cart } from '../../domain/entities/Cart';

export class HoldSaleUseCase implements HoldSale {
  static readonly HOLD_KEY = 'pos_held_sales';

  constructor(private readonly cartRepository: CartRepository) {}

  async execute(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);

    if (cart.items.length === 0) {
      throw new Error('Cannot hold an empty cart');
    }

    // Persist held carts in localStorage so the cashier can resume them later
    const stored = localStorage.getItem(HoldSaleUseCase.HOLD_KEY);
    const held: Cart[] = stored ? (JSON.parse(stored) as Cart[]) : [];

    const existingIndex = held.findIndex((c) => c.id === cartId);
    if (existingIndex >= 0) {
      held[existingIndex] = cart;
    } else {
      held.push(cart);
    }

    localStorage.setItem(HoldSaleUseCase.HOLD_KEY, JSON.stringify(held));

    return cart;
  }
}
