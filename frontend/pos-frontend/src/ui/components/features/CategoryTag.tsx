import { clsx } from 'clsx';
import type { Category } from '../../../domain/entities/Category';

export interface CategoryTagProps {
  category: Pick<Category, 'id' | 'name'>;
  onRemove?: () => void;
  className?: string;
}

/**
 * Etiqueta de categoría con opción de eliminar.
 */
export function CategoryTag({ category, onRemove, className }: CategoryTagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700',
        className
      )}
    >
      {category.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar categoría ${category.name}`}
          className="ml-0.5 rounded-full p-0.5 hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
