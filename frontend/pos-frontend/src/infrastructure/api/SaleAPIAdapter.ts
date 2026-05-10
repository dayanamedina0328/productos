import type { SaleRepository, ProcessSaleRequest } from '../../domain/ports/SaleRepository';
import type { Sale } from '../../domain/entities/Sale';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { SaleFilters } from '../../shared/types/Filters';
import { apiClient, withRetry } from './axiosInstance';
import { SaleMapper, type SaleApiResponse } from '../mappers/SaleMapper';

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
 * SaleAPIAdapter — implementa SaleRepository usando la API REST.
 */
export class SaleAPIAdapter implements SaleRepository {
  private readonly base = '/sales';

  async findAll(filters?: SaleFilters): Promise<PaginatedResponse<Sale>> {
    return withRetry(async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<SaleApiResponse>>(this.base, {
        params: filters,
      });
      return {
        items: SaleMapper.toDomainList(data.items),
        pagination: {
          page: data.pagination.page,
          pageSize: data.pagination.pageSize ?? data.pagination.page_size ?? 10,
          totalItems: data.pagination.totalItems ?? data.pagination.total_items ?? 0,
          totalPages: data.pagination.totalPages ?? data.pagination.total_pages ?? 1,
          hasNext: data.pagination.hasNext ?? data.pagination.has_next ?? false,
          hasPrevious: data.pagination.hasPrevious ?? data.pagination.has_previous ?? false,
        },
      };
    });
  }

  async findById(id: string): Promise<Sale> {
    return withRetry(async () => {
      const { data } = await apiClient.get<SaleApiResponse>(`${this.base}/${id}`);
      return SaleMapper.toDomain(data);
    });
  }

  async save(request: ProcessSaleRequest): Promise<Sale> {
    const { data } = await apiClient.post<SaleApiResponse>(this.base, request);
    return SaleMapper.toDomain(data);
  }

  async cancel(id: string): Promise<Sale> {
    const { data } = await apiClient.patch<SaleApiResponse>(`${this.base}/${id}/cancel`);
    return SaleMapper.toDomain(data);
  }
}
