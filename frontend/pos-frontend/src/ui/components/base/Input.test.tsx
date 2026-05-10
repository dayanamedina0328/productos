import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renderiza el label correctamente', () => {
    render(<Input label="Nombre" />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('muestra el mensaje de error', () => {
    render(<Input label="Email" error="El email es inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('El email es inválido');
  });

  it('aplica aria-invalid cuando hay error', () => {
    render(<Input label="Campo" error="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('no aplica aria-invalid cuando no hay error', () => {
    render(<Input label="Campo" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('muestra el hint cuando no hay error', () => {
    render(<Input label="Campo" hint="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('no muestra el hint cuando hay error', () => {
    render(<Input label="Campo" error="Error" hint="Ayuda" />);
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  it('llama a onChange al escribir', async () => {
    const onChange = vi.fn();
    render(<Input label="Campo" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hola');
    expect(onChange).toHaveBeenCalled();
  });

  it('está deshabilitado cuando disabled=true', () => {
    render(<Input label="Campo" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
