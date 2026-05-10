export class Money {
  private readonly cents: number;

  constructor(amount: number) {
    this.cents = Math.round(amount * 100);
  }

  get value(): number {
    return this.cents / 100;
  }

  add(other: Money): Money {
    return new Money((this.cents + other.cents) / 100);
  }

  subtract(other: Money): Money {
    return new Money((this.cents - other.cents) / 100);
  }

  multiply(factor: number): Money {
    return new Money((this.cents * factor) / 100);
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    return `$${this.value.toFixed(2)}`;
  }
}
