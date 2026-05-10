import type { Product } from '../../domain/entities/Product';
import type { UpdateProductRequest } from '../../domain/ports/ProductRepository';

export interface UpdateProduct {
  execute(id: string, request: UpdateProductRequest): Promise<Product>;
}
