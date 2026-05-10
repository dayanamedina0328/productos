import type { Cart } from '../../domain/entities/Cart';

export interface UpdateCartItem {
  execute(cartId: string, itemId: string, quantity: number): Promise<Cart>;
}
