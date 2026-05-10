import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGridSkeleton } from './ProductGridSkeleton';

describe('ProductGridSkeleton', () => {
  it('tiene role="status" con aria-label', () => {
    render(<ProductGridSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Cargando productos...')).toBeInTheDocument();
  });

  it('renderiza 8 skeletons por defecto', () => {
    const { container } = render(<ProductGridSkeleton />);
    // Cada skeleton tiene aria-hidden="true"
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBe(8);
  });

  it('renderiza el número de skeletons especificado', () => {
    const { container } = render(<ProductGridSkeleton count={4} />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBe(4);
  });
});
