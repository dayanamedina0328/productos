import { clsx } from 'clsx';
import { getStockStatus } from '../../../domain/validations/productHelpers';

export interface StockIndicatorProps {
  stock: number;
  minStock: number;
  /** Si true, muestra el número de unidades además del indicador */
  showCount?: boolean;
  className?: string;
}

const statusConfig = {
  ok: {
    label: 'En stock',
    dot: 'bg-stock-ok',
    text: 'text-green-700',
    bg: 'bg-green-50',
  },
  low: {
    label: 'Stock bajo',
    dot: 'bg-stock-low',
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
  },
  out: {
    label: 'Sin stock',
    dot: 'bg-stock-out',
    text: 'text-red-700',
    bg: 'bg-red-50',
  },
} as const;

/**
 * Indicador visual del estado del stock.
 * Usa colores diferenciados: verde (ok), amarillo (bajo), rojo (sin stock).
 */
export function StockIndicator({ stock, minStock, showCount = false, className }: StockIndicatorProps) {
  const status = getStockStatus(stock, minStock);
  const config = statusConfig[status];

  return (
    <span
      aria-label={`${config.label}${showCount ? `: ${stock} unidades` : ''}`}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
      {showCount && <span className="font-normal">({stock})</span>}
    </span>
  );
}
