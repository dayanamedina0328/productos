import type { Product } from '../../domain/entities/Product';
import type { Category } from '../../domain/entities/Category';

/** Forma que devuelve la API para un producto */
export interface ProductApiResponse {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number | string;
  cost: number | string;
  stock: number | string;
  min_stock?: number | string;
  minStock?: number | string;
  category: {
    id: string;
    name: string;
    description?: string;
    parent_id?: string;
    parentId?: string;
    level?: number;
    is_active?: boolean;
    isActive?: boolean;
  };
  image_url?: string;
  imageUrl?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

/**
 * ProductMapper — convierte entre la respuesta de la API y la entidad de dominio.
 */
export class ProductMapper {
  static toDomain(raw: ProductApiResponse): Product {
    const category: Category = {
      id: raw.category.id,
      name: raw.category.name,
      description: raw.category.description,
      parentId: raw.category.parentId ?? raw.category.parent_id,
      level: raw.category.level ?? 1,
      isActive: raw.category.isActive ?? raw.category.is_active ?? true,
    };

    return {
      id: raw.id,
      sku: raw.sku,
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      cost: Number(raw.cost),
      stock: Number(raw.stock),
      minStock: Number(raw.minStock ?? raw.min_stock ?? 0),
      category,
      imageUrl: raw.imageUrl ?? raw.image_url,
      isActive: raw.isActive ?? raw.is_active ?? true,
      createdAt: new Date(raw.createdAt ?? raw.created_at ?? Date.now()),
      updatedAt: new Date(raw.updatedAt ?? raw.updated_at ?? Date.now()),
    };
  }

  static toDomainList(rawList: ProductApiResponse[]): Product[] {
    return rawList.map(ProductMapper.toDomain);
  }
}
