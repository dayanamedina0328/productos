export enum CustomerType {
  REGULAR = 'regular',
  VIP = 'vip',
  CORPORATE = 'corporate',
}

export interface Customer {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly nit: string;
  readonly address?: string;
  readonly type: CustomerType;
  readonly creditLimit?: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
}
