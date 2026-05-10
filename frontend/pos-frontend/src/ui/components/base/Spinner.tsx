import { clsx } from 'clsx';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

/**
 * Spinner de carga accesible.
 * Usa `aria-label` cuando es visible para el usuario,
 * o `aria-hidden="true"` cuando es decorativo (dentro de un Button con loading).
 */
export function Spinner({
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Cargando...',
  'aria-hidden': ariaHidden,
}: SpinnerProps) {
  return (
    <span
      role={ariaHidden ? undefined : 'status'}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      className={clsx(
        'inline-block animate-spin rounded-full',
        'border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}
