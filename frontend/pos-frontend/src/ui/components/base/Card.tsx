import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Si true, agrega efecto hover con sombra */
  hoverable?: boolean;
  /** Si true, agrega padding interno estándar */
  padded?: boolean;
  onClick?: () => void;
}

/**
 * Contenedor tipo tarjeta con borde, sombra y esquinas redondeadas.
 */
export function Card({ children, className, hoverable = false, padded = true, onClick }: CardProps) {
  const isInteractive = !!onClick;

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        padded && 'p-4',
        hoverable && 'transition-shadow duration-150 hover:shadow-md',
        isInteractive && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-3 flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('text-base font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}
