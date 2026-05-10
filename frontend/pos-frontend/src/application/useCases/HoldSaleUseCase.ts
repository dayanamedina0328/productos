import type { CartRepository } from '../../domain/ports/CartRepository';
import type { HoldSale } from '../ports/HoldSale';
import type { Cart } from '../../domain/entities/Cart';

export class HoldSaleUseCase implements HoldSale {
  private static readonly HOLD_KEY = 'pos_held_sales';

  constructor(private readonly cartRepository: CartRepository) {}

  async execute(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);

    // Persist held sales in localStorage
    const held: Cart[] = JSON.parse(localStorage.getItem(HoldSaleUseCase.HOLD_KEY) ?? '[]');
    const existing = held.findIndex((c) => c.id === cartId);
    if (existing >= 0) {
      held[existing] = cart;
    } else {
      held.push(cart);
    }
    localStorage.setItem(HoldSaleUseCase.HOLD_KEY, JSON.stringify(held));

    return cart;
  }
}
