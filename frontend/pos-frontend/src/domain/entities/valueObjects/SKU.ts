export class SKU {
  private static readonly PATTERN = /^[A-Z0-9-]{3,20}$/;

  private constructor(private readonly value: string) {}

  static create(value: string): SKU {
    const normalized = value.trim().toUpperCase();
    if (!SKU.PATTERN.test(normalized)) {
      throw new Error(`Invalid SKU format: "${value}". Must be 3-20 alphanumeric characters or hyphens.`);
    }
    return new SKU(normalized);
  }

  static isValid(value: string): boolean {
    return SKU.PATTERN.test(value.trim().toUpperCase());
  }

  toString(): string {
    return this.value;
  }
}
