import type { CartRepository } from '../../domain/ports/CartRepository';
import type { RemoveFromCart } from '../ports/RemoveFromCart';
import type { Cart } from '../../domain/entities/Cart';

export class RemoveFromCartUseCase implements RemoveFromCart {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(cartId: string, itemId: string): Promise<Cart> {
    return this.cartRepository.removeItem(cartId, itemId);
  }
}
