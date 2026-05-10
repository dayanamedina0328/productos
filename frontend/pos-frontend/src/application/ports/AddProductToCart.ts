import type { Cart } from '../../domain/entities/Cart';
import type { AddToCartRequest } from '../../domain/ports/CartRepository';

export interface AddProductToCart {
  execute(request: AddToCartRequest): Promise<Cart>;
}
