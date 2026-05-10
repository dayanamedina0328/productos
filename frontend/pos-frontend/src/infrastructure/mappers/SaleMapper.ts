import type { Sale, SaleItem } from '../../domain/entities/Sale';
import { PaymentMethod, SaleStatus } from '../../domain/entities/Sale';
import { ProductMapper, type ProductApiResponse } from './ProductMapper';

export interface SaleItemApiResponse {
  id: string;
  product: ProductApiResponse;
  quantity: number | string;
  unit_price?: number | string;
  unitPrice?: number | string;
  discount?: number | string;
  subtotal?: number | string;
}

export interface SaleApiResponse {
  id: string;
  invoice_number?: string;
  invoiceNumber?: string;
  customer_id?: string;
  customerId?: string;
  items: SaleItemApiResponse[];
  subtotal: number | string;
  tax: number | string;
  discount?: number | string;
  total: number | string;
  payment_method?: string;
  paymentMethod?: string;
  payment_details?: Record<string, unknown>;
  paymentDetails?: Record<string, unknown>;
  status?: string;
  created_at?: string;
  createdAt?: string;
  created_by?: string;
  createdBy?: string;
}

/**
 * SaleMapper — convierte entre la respuesta de la API y la entidad de dominio.
 */
export class SaleMapper {
  static toDomain(raw: SaleApiResponse): Sale {
    const methodMap: Record<string, PaymentMethod> = {
      cash: PaymentMethod.CASH,
      card: PaymentMethod.CARD,
      transfer: PaymentMethod.TRANSFER,
      mixed: PaymentMethod.MIXED,
    };

    const statusMap: Record<string, SaleStatus> = {
      pending: SaleStatus.PENDING,
      completed: SaleStatus.COMPLETED,
      cancelled: SaleStatus.CANCELLED,
      refunded: SaleStatus.REFUNDED,
    };

    const items: SaleItem[] = raw.items.map((i) => ({
      id: i.id,
      product: ProductMapper.toDomain(i.product),
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice ?? i.unit_price ?? 0),
      discount: Number(i.discount ?? 0),
      subtotal: Number(i.subtotal ?? 0),
    }));

    const rawMethod = (raw.paymentMethod ?? raw.payment_method ?? 'cash').toLowerCase();
    const rawStatus = (raw.status ?? 'pending').toLowerCase();
    const rawDetails = (raw.paymentDetails ?? raw.payment_details ?? {}) as {
      cashReceived?: number;
      cardDetails?: { lastFourDigits: string; authorizationCode: string };
      transferReference?: string;
    };

    return {
      id: raw.id,
      invoiceNumber: raw.invoiceNumber ?? raw.invoice_number ?? '',
      customerId: raw.customerId ?? raw.customer_id,
      items,
      subtotal: Number(raw.subtotal),
      tax: Number(raw.tax),
      discount: Number(raw.discount ?? 0),
      total: Number(raw.total),
      paymentMethod: methodMap[rawMethod] ?? PaymentMethod.CASH,
      paymentDetails: rawDetails,
      status: statusMap[rawStatus] ?? SaleStatus.PENDING,
      createdAt: new Date(raw.createdAt ?? raw.created_at ?? Date.now()),
      createdBy: raw.createdBy ?? raw.created_by ?? '',
    };
  }

  static toDomainList(rawList: SaleApiResponse[]): Sale[] {
    return rawList.map(SaleMapper.toDomain);
  }
}
