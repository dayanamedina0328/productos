import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/ui/pages/LoginPage/LoginPage'
import SalesPage from '@/ui/pages/SalesPage/SalesPage'
import AdminPage from '@/ui/pages/AdminPage/AdminPage'
import ProductManagementPage from '@/ui/pages/AdminPage/ProductManagementPage'
import CustomerManagementPage from '@/ui/pages/AdminPage/CustomerManagementPage'
import SalesHistoryPage from '@/ui/pages/AdminPage/SalesHistoryPage'
import ReportsDashboardPage from '@/ui/pages/AdminPage/ReportsDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sales" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/admin" element={<AdminPage />}>
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="sales" element={<SalesHistoryPage />} />
        <Route path="reports" element={<ReportsDashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
