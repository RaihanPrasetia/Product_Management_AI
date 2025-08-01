import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/guest/Login';
import NotFound from '@/@layout/NotFound';
import AdminLayout from '@/@layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { adminRoutes } from '@/data/AuthRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* 2. Gunakan .map() untuk membuat rute secara dinamis */}
        {adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
