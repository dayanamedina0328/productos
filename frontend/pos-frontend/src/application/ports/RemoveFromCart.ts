import type { Cart } from '../../domain/entities/Cart';

export interface RemoveFromCart {
  execute(cartId: string, itemId: string): Promise<Cart>;
}
