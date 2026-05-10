import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('muestra el título', () => {
    render(<EmptyState title="Sin resultados" />);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('muestra la descripción cuando se proporciona', () => {
    render(<EmptyState title="Vacío" description="No hay datos disponibles" />);
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('no muestra descripción cuando no se proporciona', () => {
    render(<EmptyState title="Vacío" />);
    expect(screen.queryByText('No hay datos disponibles')).not.toBeInTheDocument();
  });

  it('muestra el icono cuando se proporciona', () => {
    render(<EmptyState title="Vacío" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('muestra la acción cuando se proporciona', () => {
    render(<EmptyState title="Vacío" action={<button>Crear</button>} />);
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument();
  });
});
