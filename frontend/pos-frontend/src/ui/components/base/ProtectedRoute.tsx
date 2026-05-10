import { Navigate, useLocation } from 'react-router-dom';

/** Roles disponibles en la aplicación */
export type UserRole = 'CASHIER' | 'ADMIN';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Si se especifica, solo usuarios con ese rol pueden acceder */
  requiredRole?: UserRole;
}

/**
 * Obtiene el usuario autenticado del localStorage.
 * En producción se usaría un contexto de autenticación real.
 */
function getAuthUser(): { role: UserRole } | null {
  const raw = localStorage.getItem('pos_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { role: UserRole };
  } catch {
    return null;
  }
}

/**
 * ProtectedRoute — redirige a /login si no hay sesión activa.
 * Tarea 7.15.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * AdminRoute — redirige a /sales si el usuario no tiene rol ADMIN.
 * Tarea 7.15.
 */
export function AdminRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/sales" replace />;
  }

  return <>{children}</>;
}
