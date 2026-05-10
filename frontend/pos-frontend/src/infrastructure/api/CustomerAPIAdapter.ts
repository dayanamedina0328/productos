import type { CustomerRepository, CreateCustomerRequest } from '../../domain/ports/CustomerRepository';
import type { Customer } from '../../domain/entities/Customer';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { CustomerFilters } from '../../shared/types/Filters';
import { apiClient, withRetry } from './axiosInstance';
import { CustomerMapper, type CustomerApiResponse } from '../mappers/CustomerMapper';

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
 * CustomerAPIAdapter — implementa CustomerRepository usando la API REST.
 */
export class CustomerAPIAdapter implements CustomerRepository {
  private readonly base = '/customers';

  async findAll(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
    return withRetry(async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<CustomerApiResponse>>(this.base, {
        params: filters,
      });
      return {
        items: CustomerMapper.toDomainList(data.items),
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

  async findById(id: string): Promise<Customer> {
    return withRetry(async () => {
      const { data } = await apiClient.get<CustomerApiResponse>(`${this.base}/${id}`);
      return CustomerMapper.toDomain(data);
    });
  }

  async save(request: CreateCustomerRequest): Promise<Customer> {
    const { data } = await apiClient.post<CustomerApiResponse>(this.base, request);
    return CustomerMapper.toDomain(data);
  }
}
