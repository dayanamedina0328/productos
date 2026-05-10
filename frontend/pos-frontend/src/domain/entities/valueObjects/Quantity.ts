export class Quantity {
  private constructor(
    private readonly value: number,
    private readonly min: number,
    private readonly max: number
  ) {}

  static create(value: number, min = 1, max = 9999): Quantity {
    if (!Number.isInteger(value)) throw new Error('Quantity must be an integer');
    if (value < min) throw new Error(`Quantity cannot be less than ${min}`);
    if (value > max) throw new Error(`Quantity cannot exceed ${max}`);
    return new Quantity(value, min, max);
  }

  get amount(): number {
    return this.value;
  }

  increment(): Quantity {
    return Quantity.create(this.value + 1, this.min, this.max);
  }

  decrement(): Quantity {
    return Quantity.create(this.value - 1, this.min, this.max);
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }
}
