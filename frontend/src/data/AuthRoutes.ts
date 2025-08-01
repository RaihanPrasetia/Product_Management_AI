import BrandPage from '@/pages/admin/brand/BrandPage';
import CategoryPage from '@/pages/admin/category/CategoryPage';
import DashboardAdmin from '@/pages/admin/DashboardAdmin';
import PurchaseDetailPage from '@/pages/admin/history/purchase/PurchaseDetailPage';
import PurchasePage from '@/pages/admin/history/purchase/PurchasePage';
import StockPage from '@/pages/admin/history/stock/StockPage';
import ProductDetail from '@/pages/admin/products/ProductDetail';
import ProductPage from '@/pages/admin/products/ProductPage';
import SaleDetail from '@/pages/admin/sale/SaleDetail';
import SalePage from '@/pages/admin/sale/SalePage';
import SupplierPage from '@/pages/admin/supplier/SupplierPage';
import TransactionPage from '@/pages/admin/transaction/TransactionPage';
import VariantPage from '@/pages/admin/variant/VariantPage';

export const adminRoutes = [
  { path: '/dashboard', Component: DashboardAdmin },
  { path: '/product', Component: ProductPage },
  { path: '/product/detail', Component: ProductDetail },
  { path: '/category', Component: CategoryPage },
  { path: '/variant', Component: VariantPage },
  { path: '/brand', Component: BrandPage },
  { path: '/supplier', Component: SupplierPage },
  { path: '/sale', Component: SalePage },
  { path: '/sale/detail', Component: SaleDetail },
  { path: '/transaction', Component: TransactionPage },
  { path: '/stock', Component: StockPage },
  { path: '/purchase', Component: PurchasePage },
  { path: '/purchase/detail', Component: PurchaseDetailPage },
];
