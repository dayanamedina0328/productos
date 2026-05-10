import { useState } from 'react';
import { clsx } from 'clsx';
import { PaymentMethod, type PaymentDetails } from '../../../domain/entities/Sale';
import { Input } from '../base/Input';

export interface PaymentMethodSelectorProps {
  total: number;
  onChange: (method: PaymentMethod, details: PaymentDetails) => void;
  className?: string;
}

const tabs: { method: PaymentMethod; label: string }[] = [
  { method: PaymentMethod.CASH, label: 'Efectivo' },
  { method: PaymentMethod.CARD, label: 'Tarjeta' },
  { method: PaymentMethod.TRANSFER, label: 'Transferencia' },
];

/**
 * Selector de método de pago con formulario específico por método.
 * Tabs: CASH, CARD, TRANSFER.
 */
export function PaymentMethodSelector({ total, onChange, className }: PaymentMethodSelectorProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashReceived, setCashReceived] = useState<string>(total.toFixed(2));
  const [lastFour, setLastFour] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [transferRef, setTransferRef] = useState('');

  const handleTabChange = (method: PaymentMethod) => {
    setActiveMethod(method);
    emitChange(method);
  };

  const emitChange = (method: PaymentMethod) => {
    const details: PaymentDetails = {};
    if (method === PaymentMethod.CASH) {
      details.cashReceived = parseFloat(cashReceived) || 0;
    } else if (method === PaymentMethod.CARD) {
      details.cardDetails = { lastFourDigits: lastFour, authorizationCode: authCode };
    } else if (method === PaymentMethod.TRANSFER) {
      details.transferReference = transferRef;
    }
    onChange(method, details);
  };

  const change = parseFloat(cashReceived) - total;

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Tabs */}
      <div role="tablist" aria-label="Método de pago" className="flex rounded-lg border border-gray-200 p-1 gap-1">
        {tabs.map(({ method, label }) => (
          <button
            key={method}
            role="tab"
            type="button"
            aria-selected={activeMethod === method}
            aria-controls={`panel-${method}`}
            id={`tab-${method}`}
            onClick={() => handleTabChange(method)}
            className={clsx(
              'flex-1 rounded-md py-2 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              activeMethod === method
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel Efectivo */}
      <div
        role="tabpanel"
        id={`panel-${PaymentMethod.CASH}`}
        aria-labelledby={`tab-${PaymentMethod.CASH}`}
        hidden={activeMethod !== PaymentMethod.CASH}
        className="space-y-3"
      >
        <Input
          label="Monto recibido"
          type="number"
          min={total}
          step="0.01"
          value={cashReceived}
          onChange={(e) => {
            setCashReceived(e.target.value);
            onChange(PaymentMethod.CASH, { cashReceived: parseFloat(e.target.value) || 0 });
          }}
        />
        {parseFloat(cashReceived) >= total && (
          <div className="rounded-lg bg-green-50 px-3 py-2">
            <p className="text-xs text-green-600">Cambio a devolver</p>
            <p className="text-lg font-bold text-green-700">${change.toFixed(2)}</p>
          </div>
        )}
        {parseFloat(cashReceived) < total && parseFloat(cashReceived) > 0 && (
          <p className="text-xs text-red-500">El monto recibido es menor al total</p>
        )}
      </div>

      {/* Panel Tarjeta */}
      <div
        role="tabpanel"
        id={`panel-${PaymentMethod.CARD}`}
        aria-labelledby={`tab-${PaymentMethod.CARD}`}
        hidden={activeMethod !== PaymentMethod.CARD}
        className="space-y-3"
      >
        <Input
          label="Últimos 4 dígitos"
          type="text"
          maxLength={4}
          pattern="[0-9]{4}"
          placeholder="1234"
          value={lastFour}
          onChange={(e) => {
            setLastFour(e.target.value);
            onChange(PaymentMethod.CARD, {
              cardDetails: { lastFourDigits: e.target.value, authorizationCode: authCode },
            });
          }}
        />
        <Input
          label="Código de autorización"
          type="text"
          placeholder="AUTH-XXXXXX"
          value={authCode}
          onChange={(e) => {
            setAuthCode(e.target.value);
            onChange(PaymentMethod.CARD, {
              cardDetails: { lastFourDigits: lastFour, authorizationCode: e.target.value },
            });
          }}
        />
      </div>

      {/* Panel Transferencia */}
      <div
        role="tabpanel"
        id={`panel-${PaymentMethod.TRANSFER}`}
        aria-labelledby={`tab-${PaymentMethod.TRANSFER}`}
        hidden={activeMethod !== PaymentMethod.TRANSFER}
        className="space-y-3"
      >
        <Input
          label="Referencia de transferencia"
          type="text"
          placeholder="REF-XXXXXXXXXX"
          value={transferRef}
          onChange={(e) => {
            setTransferRef(e.target.value);
            onChange(PaymentMethod.TRANSFER, { transferReference: e.target.value });
          }}
        />
        <p className="text-xs text-gray-500">
          Ingresa el número de referencia del comprobante de transferencia.
        </p>
      </div>
    </div>
  );
}
