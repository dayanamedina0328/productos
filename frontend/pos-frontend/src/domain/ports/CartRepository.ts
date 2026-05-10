import type { Cart } from '../entities/Cart';

export interface CreateCartRequest {
  customerId?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  cartId?: string;
}

export interface CartRepository {
  findById(id: string): Promise<Cart>;
  save(request: CreateCartRequest): Promise<Cart>;
  addItem(cartId: string, request: AddToCartRequest): Promise<Cart>;
  removeItem(cartId: string, itemId: string): Promise<Cart>;
  clear(cartId: string): Promise<void>;
}
