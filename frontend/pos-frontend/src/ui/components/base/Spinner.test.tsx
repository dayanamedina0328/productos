import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renderiza con role status por defecto', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('muestra el aria-label por defecto', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Cargando...')).toBeInTheDocument();
  });

  it('usa aria-label personalizado', () => {
    render(<Spinner aria-label="Procesando pago..." />);
    expect(screen.getByLabelText('Procesando pago...')).toBeInTheDocument();
  });

  it('no tiene role cuando aria-hidden=true', () => {
    render(<Spinner aria-hidden="true" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('aplica tamaño sm', () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-4');
  });

  it('aplica tamaño lg', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('h-8', 'w-8');
  });
});
