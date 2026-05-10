import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { SearchProducts } from '../ports/SearchProducts';
import type { Product } from '../../domain/entities/Product';

export class SearchProductsUseCase implements SearchProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: string): Promise<Product[]> {
    const result = await this.productRepository.findAll({ search: query, pageSize: 50 });
    return result.items;
  }
}
