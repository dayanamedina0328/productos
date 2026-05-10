import type { CartRepository } from '../../domain/ports/CartRepository';
import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { UpdateCartItem } from '../ports/UpdateCartItem';
import type { Cart } from '../../domain/entities/Cart';
import { CartValidations } from '../../domain/validations/CartValidations';

export class UpdateCartItemUseCase implements UpdateCartItem {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new Error(`Cart item ${itemId} not found`);

    const product = await this.productRepository.findById(item.product.id);
    // Validate as if adding from scratch (replace, not add)
    const tempCart = { ...cart, items: cart.items.filter((i) => i.id !== itemId) };
    const validation = CartValidations.validateAddItem(tempCart, product, quantity);
    if (!validation.isValid) {
      throw new Error(validation.errors?.join(', '));
    }

    await this.cartRepository.removeItem(cartId, itemId);
    return this.cartRepository.addItem(cartId, { productId: product.id, quantity, cartId });
  }
}
