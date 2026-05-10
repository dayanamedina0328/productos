import { clsx } from 'clsx';
import type { Customer } from '../../../domain/entities/Customer';

export interface CustomerChipProps {
  customer: Pick<Customer, 'id' | 'name' | 'nit' | 'type'>;
  /** Callback al hacer clic en el chip (para cambiar cliente) */
  onSelect: () => void;
  /** Callback al hacer clic en el botón X (para quitar el cliente) */
  onClear: () => void;
  className?: string;
}

/**
 * Chip que muestra el cliente seleccionado en el carrito.
 * `onSelect` y `onClear` son props separadas (no colisionan).
 */
export function CustomerChip({ customer, onSelect, onClear, className }: CustomerChipProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5',
        className
      )}
    >
      {/* Avatar inicial */}
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white"
      >
        {customer.name.charAt(0).toUpperCase()}
      </span>

      {/* Nombre — clic para cambiar */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Cliente: ${customer.name}. Clic para cambiar`}
        className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
      >
        <span className="block truncate text-sm font-medium text-primary-800">
          {customer.name}
        </span>
        <span className="block text-xs text-primary-500">NIT: {customer.nit}</span>
      </button>

      {/* Botón quitar */}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Quitar cliente ${customer.name}`}
        className="ml-auto shrink-0 rounded-full p-0.5 text-primary-400 hover:bg-primary-200 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
