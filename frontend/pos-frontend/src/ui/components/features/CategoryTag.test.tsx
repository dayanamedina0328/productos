import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryTag } from './CategoryTag';

const category = { id: 'cat-1', name: 'Electrónica' };

describe('CategoryTag', () => {
  it('muestra el nombre de la categoría', () => {
    render(<CategoryTag category={category} />);
    expect(screen.getByText('Electrónica')).toBeInTheDocument();
  });

  it('muestra el botón de eliminar cuando onRemove está definido', () => {
    render(<CategoryTag category={category} onRemove={vi.fn()} />);
    expect(screen.getByLabelText('Quitar categoría Electrónica')).toBeInTheDocument();
  });

  it('no muestra el botón de eliminar cuando onRemove no está definido', () => {
    render(<CategoryTag category={category} />);
    expect(screen.queryByLabelText(/Quitar categoría/i)).not.toBeInTheDocument();
  });

  it('llama a onRemove al hacer clic en el botón', async () => {
    const onRemove = vi.fn();
    render(<CategoryTag category={category} onRemove={onRemove} />);
    await userEvent.click(screen.getByLabelText('Quitar categoría Electrónica'));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
