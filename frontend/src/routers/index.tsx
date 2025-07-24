import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/guest/Login';
import NotFound from '@/layouts/NotFound';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardAdmin from '@/pages/admin/DashboardAdmin';
import CategoryPage from '@/pages/admin/category/CategoryPage';
import ProductPage from '@/pages/admin/products/ProductPage';
import ProductDetail from '@/pages/admin/products/ProductDetail';
import ProtectedRoute from './ProtectedRoute';
import VariantPage from '@/pages/admin/variant/VariantPage';
import BrandPage from '@/pages/admin/brand/BrandPage';
import StockPage from '@/pages/admin/history/stock/StockPage';
import SupplierPage from '@/pages/admin/supplier/SupplierPage';
import PurchasePage from '@/pages/admin/history/purchase/PurchasePage';
import PurchaseDetailPage from '@/pages/admin/history/purchase/PurchaseDetailPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
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
          <Route path="/dashboard" element={<DashboardAdmin />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/variant" element={<VariantPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/supplier" element={<SupplierPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/purchase/detail" element={<PurchaseDetailPage />} />
          <Route path="/product/detail" element={<ProductDetail />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
