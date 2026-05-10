import type { Cart, CartItem } from '../../domain/entities/Cart';
import { ProductMapper, type ProductApiResponse } from './ProductMapper';

export interface CartItemApiResponse {
  id: string;
  product: ProductApiResponse;
  quantity: number | string;
  unit_price?: number | string;
  unitPrice?: number | string;
  discount?: number | string;
  subtotal?: number | string;
}

export interface CartApiResponse {
  id: string;
  items: CartItemApiResponse[];
  customer_id?: string;
  customerId?: string;
  subtotal: number | string;
  tax: number | string;
  discount?: number | string;
  total: number | string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

/**
 * CartMapper — convierte entre la respuesta de la API y la entidad de dominio.
 */
export class CartMapper {
  static toDomain(raw: CartApiResponse): Cart {
    const items: CartItem[] = raw.items.map((i) => ({
      id: i.id,
      product: ProductMapper.toDomain(i.product),
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice ?? i.unit_price ?? 0),
      discount: Number(i.discount ?? 0),
      subtotal: Number(i.subtotal ?? 0),
    }));

    return {
      id: raw.id,
      items,
      customerId: raw.customerId ?? raw.customer_id,
      subtotal: Number(raw.subtotal),
      tax: Number(raw.tax),
      discount: Number(raw.discount ?? 0),
      total: Number(raw.total),
      createdAt: new Date(raw.createdAt ?? raw.created_at ?? Date.now()),
      updatedAt: new Date(raw.updatedAt ?? raw.updated_at ?? Date.now()),
    };
  }
}
