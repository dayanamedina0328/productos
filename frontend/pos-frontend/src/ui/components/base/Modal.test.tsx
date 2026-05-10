import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('no renderiza nada cuando isOpen=false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test"><p>Contenido</p></Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renderiza el dialog cuando isOpen=true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Mi Modal"><p>Contenido</p></Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('muestra el título', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Título del modal"><p>X</p></Modal>);
    expect(screen.getByText('Título del modal')).toBeInTheDocument();
  });

  it('llama a onClose al hacer clic en el botón cerrar', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>X</p></Modal>);
    await userEvent.click(screen.getByLabelText('Cerrar modal'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('llama a onClose al presionar Escape', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>X</p></Modal>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('tiene aria-modal="true"', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>X</p></Modal>);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('tiene aria-labelledby apuntando al título', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>X</p></Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
