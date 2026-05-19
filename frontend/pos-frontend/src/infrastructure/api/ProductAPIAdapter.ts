import type { ProductRepository, CreateProductRequest, UpdateProductRequest } from '../../domain/ports/ProductRepository';
import type { Product } from '../../domain/entities/Product';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { ProductFilters } from '../../shared/types/Filters';
import { apiClient, withRetry } from './axiosInstance';
import { ProductMapper, type ProductApiResponse } from '../mappers/ProductMapper';

interface PaginatedApiResponse<T> {
  items: T[];
  pagination: {
    page: number;
    page_size?: number;
    pageSize?: number;
    total_items?: number;
    totalItems?: number;
    total_pages?: number;
    totalPages?: number;
    has_next?: boolean;
    hasNext?: boolean;
    has_previous?: boolean;
    hasPrevious?: boolean;
  };
}

/**
 * ProductAPIAdapter — implementa ProductRepository usando la API REST.
 */
export class ProductAPIAdapter implements ProductRepository {
  private readonly base = '/products';

  async findAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return withRetry(async () => {
      const { data } = await apiClient.get<any>(this.base, {
        params: filters,
      });
      
      // Manejar ambos formatos: con pagination anidado o campos planos
      const pagination = data.pagination ? {
        page: data.pagination.page,
        pageSize: data.pagination.pageSize ?? data.pagination.page_size ?? 10,
        totalItems: data.pagination.totalItems ?? data.pagination.total_items ?? 0,
        totalPages: data.pagination.totalPages ?? data.pagination.total_pages ?? 1,
        hasNext: data.pagination.hasNext ?? data.pagination.has_next ?? false,
        hasPrevious: data.pagination.hasPrevious ?? data.pagination.has_previous ?? false,
      } : {
        page: data.page ?? 0,
        pageSize: data.pageSize ?? data.page_size ?? 10,
        totalItems: data.totalItems ?? data.total_items ?? 0,
        totalPages: data.totalPages ?? data.total_pages ?? 1,
        hasNext: data.hasNext ?? data.has_next ?? false,
        hasPrevious: data.hasPrevious ?? data.has_previous ?? false,
      };
      
      return {
        items: ProductMapper.toDomainList(data.items || []),
        pagination,
      };
    });
  }

  async findById(id: string): Promise<Product> {
    return withRetry(async () => {
      const { data } = await apiClient.get<ProductApiResponse>(`${this.base}/${id}`);
      return ProductMapper.toDomain(data);
    });
  }

  async save(request: CreateProductRequest): Promise<Product> {
    const { data } = await apiClient.post<ProductApiResponse>(this.base, request);
    return ProductMapper.toDomain(data);
  }

  async update(id: string, request: UpdateProductRequest): Promise<Product> {
    const { data } = await apiClient.patch<ProductApiResponse>(`${this.base}/${id}`, request);
    return ProductMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.base}/${id}`);
  }
}
