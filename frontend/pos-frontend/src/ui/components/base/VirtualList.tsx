import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { clsx } from 'clsx';

export interface VirtualListProps<T> {
  items: T[];
  /** Altura estimada de cada ítem en px */
  estimateSize?: number;
  /** Función para renderizar cada ítem */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Clave única por ítem */
  getItemKey: (item: T, index: number) => string | number;
  /** Altura máxima del contenedor */
  height?: number | string;
  className?: string;
  /** Umbral: solo virtualizar si hay más de N ítems */
  virtualizationThreshold?: number;
}

/**
 * VirtualList — lista virtualizada para rendimiento con > 100 ítems.
 * Usa @tanstack/react-virtual para renderizar solo los ítems visibles.
 * Por debajo del umbral (default 100), renderiza todos los ítems normalmente.
 */
export function VirtualList<T>({
  items,
  estimateSize = 48,
  renderItem,
  getItemKey,
  height = 400,
  className,
  virtualizationThreshold = 100,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const shouldVirtualize = items.length > virtualizationThreshold;

  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? items.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5,
    getItemKey: (index) => getItemKey(items[index], index),
  });

  if (!shouldVirtualize) {
    // Renderizado normal para listas pequeñas
    return (
      <div className={clsx('overflow-auto', className)} style={{ height }}>
        {items.map((item, index) => (
          <div key={getItemKey(item, index)}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // Renderizado virtualizado para listas grandes
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={clsx('overflow-auto', className)}
      style={{ height }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
