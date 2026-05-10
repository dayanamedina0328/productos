import type { CartRepository, CreateCartRequest, AddToCartRequest } from '../../domain/ports/CartRepository';
import type { Cart } from '../../domain/entities/Cart';
import { apiClient, withRetry } from './axiosInstance';
import { CartMapper, type CartApiResponse } from '../mappers/CartMapper';

/**
 * CartAPIAdapter — implementa CartRepository usando la API REST.
 */
export class CartAPIAdapter implements CartRepository {
  private readonly base = '/carts';

  async findById(id: string): Promise<Cart> {
    return withRetry(async () => {
      const { data } = await apiClient.get<CartApiResponse>(`${this.base}/${id}`);
      return CartMapper.toDomain(data);
    });
  }

  async save(request: CreateCartRequest): Promise<Cart> {
    const { data } = await apiClient.post<CartApiResponse>(this.base, request);
    return CartMapper.toDomain(data);
  }

  async addItem(cartId: string, request: AddToCartRequest): Promise<Cart> {
    const { data } = await apiClient.post<CartApiResponse>(
      `${this.base}/${cartId}/items`,
      request
    );
    return CartMapper.toDomain(data);
  }

  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    const { data } = await apiClient.delete<CartApiResponse>(
      `${this.base}/${cartId}/items/${itemId}`
    );
    return CartMapper.toDomain(data);
  }

  async clear(cartId: string): Promise<void> {
    await apiClient.delete(`${this.base}/${cartId}/items`);
  }
}
