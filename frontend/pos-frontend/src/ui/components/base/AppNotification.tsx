import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  /** Duración en ms antes de auto-cerrar. 0 = no auto-cierra */
  duration?: number;
}

export interface AppNotificationProps extends AppNotificationItem {
  onClose: (id: string) => void;
}

const typeConfig: Record<
  NotificationType,
  { bg: string; border: string; icon: React.ReactNode; titleColor: string }
> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    titleColor: 'text-green-800',
    icon: (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    titleColor: 'text-red-800',
    icon: (
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    titleColor: 'text-yellow-800',
    icon: (
      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    titleColor: 'text-blue-800',
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

/**
 * Componente de notificación individual tipo toast.
 * Nombre: AppNotification (evita colisión con la API DOM Notification).
 */
export function AppNotification({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: AppNotificationProps) {
  const config = typeConfig[type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => onClose(id), duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={clsx(
        'flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg',
        config.bg,
        config.border
      )}
    >
      <span className="mt-0.5 shrink-0">{config.icon}</span>

      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-semibold', config.titleColor)}>{title}</p>
        {message && <p className="mt-0.5 text-sm text-gray-600">{message}</p>}
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Cerrar notificación"
        className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/** Contenedor que posiciona las notificaciones en la esquina superior derecha */
export interface AppNotificationContainerProps {
  notifications: AppNotificationItem[];
  onClose: (id: string) => void;
}

export function AppNotificationContainer({ notifications, onClose }: AppNotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div
      aria-label="Notificaciones"
      className="fixed right-4 top-4 z-[100] flex flex-col gap-2"
    >
      {notifications.map((n) => (
        <AppNotification key={n.id} {...n} onClose={onClose} />
      ))}
    </div>
  );
}
