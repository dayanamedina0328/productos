import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/ui/components/base/ErrorBoundary';
import { ProtectedRoute, AdminRoute } from '@/ui/components/base/ProtectedRoute';
import { Spinner } from '@/ui/components/base/Spinner';

// ---------------------------------------------------------------------------
// Lazy loading — code splitting por ruta (tarea 7.14)
// ---------------------------------------------------------------------------

const LoginPage = lazy(() => import('@/ui/pages/LoginPage/LoginPage'));
const SalesPage = lazy(() => import('@/ui/pages/SalesPage/SalesPage'));
const AdminPage = lazy(() => import('@/ui/pages/AdminPage/AdminPage'));
const ProductManagementPage = lazy(() => import('@/ui/pages/AdminPage/ProductManagementPage'));
const CustomerManagementPage = lazy(() => import('@/ui/pages/AdminPage/CustomerManagementPage'));
const SalesHistoryPage = lazy(() => import('@/ui/pages/AdminPage/SalesHistoryPage'));
const ReportsDashboardPage = lazy(() => import('@/ui/pages/AdminPage/ReportsDashboardPage'));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" aria-label="Cargando página..." />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/sales" replace />} />

          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Terminal de ventas — requiere autenticación */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <SalesPage />
              </ProtectedRoute>
            }
          />

          {/* Administración — requiere rol ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="customers" element={<CustomerManagementPage />} />
            <Route path="sales" element={<SalesHistoryPage />} />
            <Route path="reports" element={<ReportsDashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/sales" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
