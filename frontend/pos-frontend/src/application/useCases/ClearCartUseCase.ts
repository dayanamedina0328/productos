import type { CartRepository } from '../../domain/ports/CartRepository';
import type { ClearCart } from '../ports/ClearCart';

export class ClearCartUseCase implements ClearCart {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(cartId: string): Promise<void> {
    return this.cartRepository.clear(cartId);
  }
}
