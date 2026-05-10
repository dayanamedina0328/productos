import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renderiza el input de búsqueda', () => {
    render(<SearchInput onChange={vi.fn()} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('muestra el placeholder', () => {
    render(<SearchInput onChange={vi.fn()} placeholder="Buscar..." />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('muestra el botón limpiar cuando hay texto', async () => {
    render(<SearchInput onChange={vi.fn()} value="hola" />);
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument();
  });

  it('no muestra el botón limpiar cuando está vacío', () => {
    render(<SearchInput onChange={vi.fn()} value="" />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('llama a onChange al limpiar', async () => {
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} value="texto" />);
    await userEvent.click(screen.getByLabelText('Limpiar búsqueda'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('está deshabilitado cuando disabled=true', () => {
    render(<SearchInput onChange={vi.fn()} disabled />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });
});
