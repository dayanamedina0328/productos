import type { Sale } from '../../domain/entities/Sale';

export interface InvoiceData {
  saleId: string;
  invoiceNumber: string;
  issuedAt: Date;
  sale: Sale;
}

export interface GenerateInvoice {
  execute(saleId: string): Promise<InvoiceData>;
}
