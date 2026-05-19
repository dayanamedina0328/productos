import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../components/base/AdminLayout';
import type { AdminTab } from '../../components/base/AdminLayout';

/**
 * AdminPage — página de administración con navegación por tabs.
 * Usa React Router para manejar las sub-rutas de cada tab.
 */
const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar el tab activo según la ruta actual
  const getActiveTab = (): AdminTab => {
    if (location.pathname.includes('/admin/sales')) return 'sales';
    if (location.pathname.includes('/admin/reports')) return 'reports';
    return 'sales'; // Por defecto, ventas
  };

  const handleTabChange = (tab: AdminTab) => {
    navigate(`/admin/${tab}`);
  };

  return (
    <AdminLayout activeTab={getActiveTab()} onTabChange={handleTabChange}>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminPage;
