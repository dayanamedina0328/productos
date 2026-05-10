import { clsx } from 'clsx';
import type { Sale } from '../../../domain/entities/Sale';
import { PaymentMethod } from '../../../domain/entities/Sale';

export interface SaleReceiptProps {
  sale: Sale;
  customerName?: string;
  className?: string;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CARD]: 'Tarjeta',
  [PaymentMethod.TRANSFER]: 'Transferencia',
  [PaymentMethod.MIXED]: 'Pago mixto',
};

/**
 * Recibo de venta imprimible.
 * Muestra todos los detalles de la venta completada.
 */
export function SaleReceipt({ sale, customerName, className }: SaleReceiptProps) {
  const formattedDate = new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(sale.createdAt));

  return (
    <article
      aria-label={`Recibo de venta ${sale.invoiceNumber}`}
      className={clsx(
        'w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      {/* Encabezado */}
      <header className="mb-4 text-center">
        <h2 className="text-lg font-bold text-gray-900">Recibo de Venta</h2>
        <p className="text-sm text-gray-500">Factura #{sale.invoiceNumber}</p>
        <p className="text-xs text-gray-400">{formattedDate}</p>
      </header>

      {/* Cliente */}
      {customerName && (
        <div className="mb-4 rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Cliente</p>
          <p className="text-sm font-medium text-gray-800">{customerName}</p>
        </div>
      )}

      {/* Ítems */}
      <ul className="mb-4 divide-y divide-gray-100" aria-label="Productos">
        {sale.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between py-2 text-sm">
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-gray-800">{item.product.name}</p>
              <p className="text-xs text-gray-400">
                {item.quantity} × ${item.unitPrice.toFixed(2)}
                {item.discount > 0 && ` (-${item.discount}%)`}
              </p>
            </div>
            <span className="ml-4 font-semibold text-gray-900">${item.subtotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Totales */}
      <div className="space-y-1 border-t border-gray-200 pt-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${sale.subtotal.toFixed(2)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento</span>
            <span>-${sale.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>IVA</span>
          <span>${sale.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
          <span>Total</span>
          <span>${sale.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Método de pago */}
      <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-500">Método de pago</p>
        <p className="text-sm font-medium text-gray-800">
          {paymentMethodLabels[sale.paymentMethod]}
        </p>
        {sale.paymentDetails.cashReceived !== undefined && (
          <p className="text-xs text-gray-500">
            Recibido: ${sale.paymentDetails.cashReceived.toFixed(2)} —
            Cambio: ${(sale.paymentDetails.cashReceived - sale.total).toFixed(2)}
          </p>
        )}
      </div>
    </article>
  );
}
