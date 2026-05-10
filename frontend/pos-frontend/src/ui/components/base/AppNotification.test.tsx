import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppNotification, AppNotificationContainer } from './AppNotification';

describe('AppNotification', () => {
  it('muestra el título', () => {
    render(<AppNotification id="n1" type="success" title="Operación exitosa" onClose={vi.fn()} />);
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
  });

  it('muestra el mensaje cuando se proporciona', () => {
    render(<AppNotification id="n1" type="info" title="Info" message="Detalle del mensaje" onClose={vi.fn()} />);
    expect(screen.getByText('Detalle del mensaje')).toBeInTheDocument();
  });

  it('llama a onClose al hacer clic en cerrar', async () => {
    const onClose = vi.fn();
    render(<AppNotification id="n1" type="error" title="Error" onClose={onClose} duration={0} />);
    await userEvent.click(screen.getByLabelText('Cerrar notificación'));
    expect(onClose).toHaveBeenCalledWith('n1');
  });

  it('tiene role="alert"', () => {
    render(<AppNotification id="n1" type="warning" title="Alerta" onClose={vi.fn()} duration={0} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('AppNotificationContainer', () => {
  it('no renderiza nada cuando no hay notificaciones', () => {
    const { container } = render(<AppNotificationContainer notifications={[]} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza las notificaciones', () => {
    const notifications = [
      { id: 'n1', type: 'success' as const, title: 'Éxito' },
      { id: 'n2', type: 'error' as const, title: 'Error' },
    ];
    render(<AppNotificationContainer notifications={notifications} onClose={vi.fn()} />);
    expect(screen.getByText('Éxito')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
