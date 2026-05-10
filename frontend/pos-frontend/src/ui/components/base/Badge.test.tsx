import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza el texto', () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('aplica variante success', () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText('OK')).toHaveClass('bg-green-100');
  });

  it('aplica variante danger', () => {
    render(<Badge variant="danger">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-red-100');
  });

  it('aplica variante warning', () => {
    render(<Badge variant="warning">Alerta</Badge>);
    expect(screen.getByText('Alerta')).toHaveClass('bg-yellow-100');
  });

  it('aplica variante primary', () => {
    render(<Badge variant="primary">Info</Badge>);
    expect(screen.getByText('Info')).toHaveClass('bg-primary-100');
  });

  it('aplica tamaño sm', () => {
    render(<Badge size="sm">Pequeño</Badge>);
    expect(screen.getByText('Pequeño')).toHaveClass('px-1.5');
  });
});
