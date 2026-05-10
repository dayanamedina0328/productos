import type { Cart } from '../../domain/entities/Cart';

export interface ApplyDiscount {
  execute(cartId: string, discount: number): Promise<Cart>;
}
