import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('renderiza los hijos', () => {
    render(<Card><p>Contenido</p></Card>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('aplica padding por defecto', () => {
    const { container } = render(<Card>X</Card>);
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('no aplica padding cuando padded=false', () => {
    const { container } = render(<Card padded={false}>X</Card>);
    expect(container.firstChild).not.toHaveClass('p-4');
  });

  it('aplica hover cuando hoverable=true', () => {
    const { container } = render(<Card hoverable>X</Card>);
    expect(container.firstChild).toHaveClass('hover:shadow-md');
  });

  it('es interactivo cuando tiene onClick', async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Clic</Card>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('CardHeader', () => {
  it('renderiza los hijos', () => {
    render(<CardHeader><span>Header</span></CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renderiza el título', () => {
    render(<CardTitle>Mi Título</CardTitle>);
    expect(screen.getByText('Mi Título')).toBeInTheDocument();
  });
});
