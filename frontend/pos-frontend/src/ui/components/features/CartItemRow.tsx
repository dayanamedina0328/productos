import { clsx } from 'clsx';
import type { CartItem } from '../../../domain/entities/Cart';

// QuantityInput — input numérico para editar cantidad
export interface QuantityInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function QuantityInput({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
  'aria-label': ariaLabel = 'Cantidad',
}: QuantityInputProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (max === undefined || value < max) onChange(value + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= min && (max === undefined || parsed <= max)) {
      onChange(parsed);
    }
  };

  return (
    <div className="flex items-center rounded-lg border border-gray-200" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Disminuir cantidad"
        className="flex h-7 w-7 items-center justify-center rounded-l-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className="h-7 w-10 border-x border-gray-200 bg-white text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label="Aumentar cantidad"
        className="flex h-7 w-7 items-center justify-center rounded-r-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

// QuantityDisplay — solo muestra la cantidad (sin edición)
export interface QuantityDisplayProps {
  value: number;
  unit?: string;
  className?: string;
}

export function QuantityDisplay({ value, unit = 'u', className }: QuantityDisplayProps) {
  return (
    <span className={clsx('text-sm font-medium text-gray-700', className)}>
      {value} {unit}
    </span>
  );
}

// CartItemRow — fila del carrito (nombre diferente a la interfaz CartItem del dominio)
export interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  loading?: boolean;
  className?: string;
}

/**
 * Fila de ítem del carrito.
 * Nombre `CartItemRow` para no colisionar con la interfaz de dominio `CartItem`.
 */
export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  loading = false,
  className,
}: CartItemRowProps) {
  return (
    <li
      className={clsx(
        'flex items-start gap-3 py-3',
        loading && 'opacity-60 pointer-events-none',
        className
      )}
    >
      {/* Info del producto */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
        <p className="text-xs text-gray-400">{item.product.sku}</p>
        {item.discount > 0 && (
          <p className="text-xs text-green-600">-{item.discount}% dto.</p>
        )}
      </div>

      {/* Controles de cantidad */}
      <QuantityInput
        value={item.quantity}
        min={1}
        max={item.product.stock}
        onChange={(qty) => onQuantityChange(item.id, qty)}
        disabled={loading}
        aria-label={`Cantidad de ${item.product.name}`}
      />

      {/* Subtotal */}
      <div className="text-right min-w-[60px]">
        <p className="text-sm font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
        <p className="text-xs text-gray-400">${item.unitPrice.toFixed(2)} c/u</p>
      </div>

      {/* Botón eliminar */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={loading}
        aria-label={`Eliminar ${item.product.name} del carrito`}
        className="shrink-0 rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
}
