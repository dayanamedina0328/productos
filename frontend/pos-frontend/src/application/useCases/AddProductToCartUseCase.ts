import type { CartRepository, AddToCartRequest } from '../../domain/ports/CartRepository';
import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { AddProductToCart } from '../ports/AddProductToCart';
import type { Cart } from '../../domain/entities/Cart';
import { CartValidations } from '../../domain/validations/CartValidations';

export class AddProductToCartUseCase implements AddProductToCart {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(request: AddToCartRequest): Promise<Cart> {
    const product = await this.productRepository.findById(request.productId);

    if (request.cartId) {
      const cart = await this.cartRepository.findById(request.cartId);
      const validation = CartValidations.validateAddItem(cart, product, request.quantity);
      if (!validation.isValid) {
        throw new Error(validation.errors?.join(', '));
      }
      return this.cartRepository.addItem(request.cartId, request);
    }

    // Create new cart and add item
    const newCart = await this.cartRepository.save({});
    const validation = CartValidations.validateAddItem(newCart, product, request.quantity);
    if (!validation.isValid) {
      throw new Error(validation.errors?.join(', '));
    }
    return this.cartRepository.addItem(newCart.id, request);
  }
}
