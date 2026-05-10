import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { GetProducts } from '../ports/GetProducts';
import type { Product } from '../../domain/entities/Product';
import type { PaginatedResponse } from '../../shared/types/PaginatedResponse';
import type { ProductFilters } from '../../shared/types/Filters';

export class GetProductsUseCase implements GetProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return this.productRepository.findAll(filters);
  }
}
