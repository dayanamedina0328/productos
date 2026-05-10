import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomerChip } from './CustomerChip';
import { CustomerType } from '../../../domain/entities/Customer';

const customer = {
  id: 'cust-1',
  name: 'Ana García',
  nit: '12345678',
  type: CustomerType.REGULAR,
};

describe('CustomerChip', () => {
  it('muestra el nombre del cliente', () => {
    render(<CustomerChip customer={customer} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('muestra el NIT del cliente', () => {
    render(<CustomerChip customer={customer} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText('NIT: 12345678')).toBeInTheDocument();
  });

  it('llama a onSelect al hacer clic en el nombre', async () => {
    const onSelect = vi.fn();
    render(<CustomerChip customer={customer} onSelect={onSelect} onClear={vi.fn()} />);
    await userEvent.click(screen.getByLabelText(/Cliente: Ana García/i));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('llama a onClear al hacer clic en el botón X', async () => {
    const onClear = vi.fn();
    render(<CustomerChip customer={customer} onSelect={vi.fn()} onClear={onClear} />);
    await userEvent.click(screen.getByLabelText(/Quitar cliente Ana García/i));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('muestra la inicial del nombre en el avatar', () => {
    render(<CustomerChip customer={customer} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
