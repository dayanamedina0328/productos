import type { Sale } from '../../domain/entities/Sale';

export interface CancelSale {
  execute(saleId: string): Promise<Sale>;
}
