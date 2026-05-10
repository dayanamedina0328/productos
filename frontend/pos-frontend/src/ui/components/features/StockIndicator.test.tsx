import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockIndicator } from './StockIndicator';

describe('StockIndicator', () => {
  it('muestra "En stock" cuando el stock es suficiente', () => {
    render(<StockIndicator stock={10} minStock={3} />);
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('muestra "Stock bajo" cuando el stock es igual al mínimo', () => {
    render(<StockIndicator stock={3} minStock={3} />);
    expect(screen.getByText('Stock bajo')).toBeInTheDocument();
  });

  it('muestra "Sin stock" cuando el stock es 0', () => {
    render(<StockIndicator stock={0} minStock={3} />);
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });

  it('muestra el conteo cuando showCount=true', () => {
    render(<StockIndicator stock={7} minStock={2} showCount />);
    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  it('tiene aria-label descriptivo', () => {
    render(<StockIndicator stock={5} minStock={2} showCount />);
    const el = screen.getByLabelText(/En stock: 5 unidades/i);
    expect(el).toBeInTheDocument();
  });
});
