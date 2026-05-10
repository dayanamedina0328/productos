import type { Cart } from '../../domain/entities/Cart';

export interface HoldSale {
  execute(cartId: string): Promise<Cart>;
}
