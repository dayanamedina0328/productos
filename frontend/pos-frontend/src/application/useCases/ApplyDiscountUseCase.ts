import type { CartRepository } from '../../domain/ports/CartRepository';
import type { ApplyDiscount } from '../ports/ApplyDiscount';
import type { Cart } from '../../domain/entities/Cart';

export class ApplyDiscountUseCase implements ApplyDiscount {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(cartId: string, discount: number): Promise<Cart> {
    if (discount < 0) throw new Error('Discount cannot be negative');
    if (discount > 100) throw new Error('Discount cannot exceed 100%');

    const cart = await this.cartRepository.findById(cartId);
    // Return updated cart — actual discount application is handled by the repository/backend
    return { ...cart, discount };
  }
}
