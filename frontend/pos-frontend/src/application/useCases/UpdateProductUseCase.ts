import type { ProductRepository, UpdateProductRequest } from '../../domain/ports/ProductRepository';
import type { UpdateProduct } from '../ports/UpdateProduct';
import type { Product } from '../../domain/entities/Product';
import { ProductValidations } from '../../domain/validations/ProductValidations';

export class UpdateProductUseCase implements UpdateProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, request: UpdateProductRequest): Promise<Product> {
    if (request.price !== undefined) {
      const priceValidation = ProductValidations.validatePrice(request.price);
      if (!priceValidation.isValid) {
        throw new Error(priceValidation.errors?.join(', '));
      }
    }

    if (request.stock !== undefined && request.minStock !== undefined) {
      const stockValidation = ProductValidations.validateStock(request.stock, request.minStock);
      if (!stockValidation.isValid) {
        throw new Error(stockValidation.errors?.join(', '));
      }
    }

    return this.productRepository.update(id, request);
  }
}
