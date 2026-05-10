import type { Cart } from '../../../domain/entities/Cart';
import type { Customer } from '../../../domain/entities/Customer';
import { CartItemRow } from './CartItemRow';
import { CustomerChip } from './CustomerChip';
import { EmptyState } from '../base/EmptyState';
import { Button } from '../base/Button';
import { ScrollArea } from '../base/ScrollArea';

export interface CartPanelProps {
  cart: Cart | null;
  selectedCustomer: Customer | null;
  /** Callback al hacer clic en "Seleccionar cliente" o en el chip del cliente */
  onCustomerSelect: () => void;
  /** Callback al hacer clic en X del chip del cliente */
  onCustomerClear: () => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onHold?: () => void;
  onClear?: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * CartPanel — panel del carrito de compras.
 * Muestra ítems, subtotal, IVA y total en tiempo real.
 * onCustomerSelect y onCustomerClear son props separadas (tarea 6.3).
 */
export function CartPanel({
  cart,
  selectedCustomer,
  onCustomerSelect,
  onCustomerClear,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onHold,
  onClear,
  loading = false,
  className,
}: CartPanelProps) {
  const hasItems = (cart?.items.length ?? 0) > 0;

  return (
    <div className={`flex h-full flex-col ${className ?? ''}`}>
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Carrito
            {hasItems && (
              <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700">
                {cart!.items.length}
              </span>
            )}
          </h2>
          {hasItems && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 rounded"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Selector de cliente */}
        <div className="mt-2">
          {selectedCustomer ? (
            <CustomerChip
              customer={selectedCustomer}
              onSelect={onCustomerSelect}
              onClear={onCustomerClear}
            />
          ) : (
            <button
              type="button"
              onClick={onCustomerSelect}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400 hover:border-primary-400 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Agregar cliente (F3)
            </button>
          )}
        </div>
      </div>

      {/* Lista de ítems */}
      <ScrollArea className="flex-1 px-4" direction="vertical">
        {!hasItems ? (
          <EmptyState
            title="Carrito vacío"
            description="Agrega productos desde el catálogo"
            icon={
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        ) : (
          <ul className="divide-y divide-gray-100" aria-label="Ítems del carrito">
            {cart!.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={(itemId, qty) => onQuantityChange(itemId, qty)}
                onRemove={onRemoveItem}
                loading={loading}
              />
            ))}
          </ul>
        )}
      </ScrollArea>

      {/* Totales */}
      {hasItems && (
        <div className="shrink-0 border-t border-gray-200 px-4 py-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${cart!.subtotal.toFixed(2)}</span>
          </div>
          {cart!.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-${cart!.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <span>IVA (19%)</span>
            <span>${cart!.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
            <span>Total</span>
            <span>${cart!.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="shrink-0 border-t border-gray-200 p-4 space-y-2">
        <Button
          variant="primary"
          size="lg"
          disabled={!hasItems || loading}
          onClick={onCheckout}
          className="w-full"
          aria-label="Proceder al pago (Ctrl+Enter)"
        >
          Cobrar ${cart?.total.toFixed(2) ?? '0.00'}
        </Button>
        {onHold && hasItems && (
          <Button
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={onHold}
            className="w-full"
          >
            Poner en espera
          </Button>
        )}
      </div>
    </div>
  );
}
