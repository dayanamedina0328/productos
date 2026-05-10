import type { Cart } from '../entities/Cart';
import type { Product } from '../entities/Product';
import type { ValidationResult } from './ProductValidations';

export class CartValidations {
  static validateAddItem(cart: Cart, product: Product, quantity: number): ValidationResult {
    if (quantity <= 0) return { isValid: false, errors: ['Quantity must be greater than 0'] };
    const existing = cart.items.find((i) => i.product.id === product.id);
    const total = (existing?.quantity ?? 0) + quantity;
    if (total > product.stock) {
      return { isValid: false, errors: [`Insufficient stock. Available: ${product.stock}`] };
    }
    return { isValid: true };
  }
}
