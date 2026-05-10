export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export class ProductValidations {
  static validatePrice(price: number): ValidationResult {
    if (price <= 0) return { isValid: false, errors: ['Price must be greater than 0'] };
    if (price > 999999) return { isValid: false, errors: ['Price cannot exceed 999,999'] };
    return { isValid: true };
  }

  static validateStock(stock: number, minStock: number): ValidationResult {
    if (stock < 0) return { isValid: false, errors: ['Stock cannot be negative'] };
    if (stock < minStock) return { isValid: false, errors: ['Stock cannot be less than minimum stock'] };
    return { isValid: true };
  }
}
