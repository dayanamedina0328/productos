import type { Product } from '../entities/Product';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { ProductFilters } from '../../shared/types/Filters';

export interface CreateProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  categoryId: string;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  categoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  findById(id: string): Promise<Product>;
  save(request: CreateProductRequest): Promise<Product>;
  update(id: string, request: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<void>;
}
