import type { Product } from '../../domain/entities/Product';

export interface SearchProducts {
  execute(query: string): Promise<Product[]>;
}
