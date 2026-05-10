import { clsx } from 'clsx';

export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  /** Altura máxima del área de scroll */
  maxHeight?: string;
  /** Dirección del scroll */
  direction?: 'vertical' | 'horizontal' | 'both';
}

/**
 * Área de scroll con scrollbar estilizada.
 * Usa overflow-auto con estilos personalizados para la scrollbar.
 */
export function ScrollArea({
  children,
  className,
  maxHeight,
  direction = 'vertical',
}: ScrollAreaProps) {
  const overflowClass = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto',
  }[direction];

  return (
    <div
      className={clsx(
        overflowClass,
        // Scrollbar personalizada (webkit)
        '[&::-webkit-scrollbar]:w-1.5',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-thumb]:bg-gray-300',
        'hover:[&::-webkit-scrollbar-thumb]:bg-gray-400',
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {children}
    </div>
  );
}
