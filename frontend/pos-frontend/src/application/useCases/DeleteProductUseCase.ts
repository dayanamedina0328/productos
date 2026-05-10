import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { SaleRepository } from '../../domain/ports/SaleRepository';
import type { DeleteProduct } from '../ports/DeleteProduct';

export class DeleteProductUseCase implements DeleteProduct {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: string): Promise<void> {
    // Check if product has associated sales
    const sales = await this.saleRepository.findAll({ page: 1, pageSize: 1 } as never);
    const hasSales = sales.items.some((sale) =>
      sale.items.some((item) => item.product.id === id)
    );

    if (hasSales) {
      throw new Error('Cannot delete a product that has associated sales. Deactivate it instead.');
    }

    return this.productRepository.delete(id);
  }
}
