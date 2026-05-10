export interface Category {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly parentId?: string;
  readonly level: number;
  readonly isActive: boolean;
}
