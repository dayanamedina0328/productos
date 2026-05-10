import type { ProductRepository, CreateProductRequest } from '../../domain/ports/ProductRepository';
import type { CreateProduct } from '../ports/CreateProduct';
import type { Product } from '../../domain/entities/Product';
import { ProductValidations } from '../../domain/validations/ProductValidations';

export class CreateProductUseCase implements CreateProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    const priceValidation = ProductValidations.validatePrice(request.price);
    if (!priceValidation.isValid) {
      throw new Error(priceValidation.errors?.join(', '));
    }

    const stockValidation = ProductValidations.validateStock(request.stock, request.minStock);
    if (!stockValidation.isValid) {
      throw new Error(stockValidation.errors?.join(', '));
    }

    return this.productRepository.save(request);
  }
}
