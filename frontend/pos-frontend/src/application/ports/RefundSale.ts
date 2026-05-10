import type { Sale } from '../../domain/entities/Sale';

export interface RefundSale {
  execute(saleId: string): Promise<Sale>;
}
