import type { Cart } from '../../../domain/entities/Cart';
import type { Customer } from '../../../domain/entities/Customer';
import type { PaymentMethod, PaymentDetails } from '../../../domain/entities/Sale';
import { Modal } from '../base/Modal';
import { Button } from '../base/Button';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { useState } from 'react';
import { PaymentMethod as PM } from '../../../domain/entities/Sale';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  customer?: Customer | null;
  /** Recibe método y detalles de pago — ambos parámetros requeridos (tarea 6.4) */
  onComplete: (method: PaymentMethod, details: PaymentDetails) => void;
  isProcessing?: boolean;
}

/**
 * CheckoutModal — modal de confirmación de pago.
 * onComplete(method, details) recibe ambos parámetros (tarea 6.4).
 * Muestra resumen del pedido y selector de método de pago.
 */
export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  customer,
  onComplete,
  isProcessing = false,
}: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PM.CASH);
  const [selectedDetails, setSelectedDetails] = useState<PaymentDetails>({
    cashReceived: cart.total,
  });

  const handlePaymentChange = (method: PaymentMethod, details: PaymentDetails) => {
    setSelectedMethod(method);
    setSelectedDetails(details);
  };

  const handleConfirm = () => {
    onComplete(selectedMethod, selectedDetails);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar pago"
      size="md"
      disableBackdropClose={isProcessing}
    >
      <div className="space-y-5">
        {/* Resumen del pedido */}
        <section aria-label="Resumen del pedido">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Resumen</h3>
          <ul className="space-y-1 rounded-lg bg-gray-50 p-3 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between text-gray-600">
                <span className="truncate mr-2">
                  {item.quantity}× {item.product.name}
                </span>
                <span className="shrink-0 font-medium">${item.subtotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>IVA</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          {customer && (
            <p className="mt-2 text-xs text-gray-500">
              Cliente: <span className="font-medium text-gray-700">{customer.name}</span>
            </p>
          )}
        </section>

        {/* Selector de método de pago */}
        <section aria-label="Método de pago">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Método de pago</h3>
          <PaymentMethodSelector
            total={cart.total}
            onChange={handlePaymentChange}
          />
        </section>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={isProcessing}
            className="flex-1"
            aria-label="Confirmar pago (Ctrl+Enter)"
          >
            Confirmar pago
          </Button>
        </div>
      </div>
    </Modal>
  );
}
