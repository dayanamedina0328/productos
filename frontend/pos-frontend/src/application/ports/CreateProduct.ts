import type { Product } from '../../domain/entities/Product';
import type { CreateProductRequest } from '../../domain/ports/ProductRepository';

export interface CreateProduct {
  execute(request: CreateProductRequest): Promise<Product>;
}
