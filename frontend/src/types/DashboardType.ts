// src/utils/types/DashboardType.ts

// Tipe untuk data statistik utama (kartu KPI)
export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  lowStockItemsCount: number;
  totalStockValue: string; // Tipe string sesuai response
}

// Tipe untuk setiap item di daftar pembelian terbaru
export interface RecentPurchase {
  id: string;
  invoiceNumber: string;
  totalAmount: string;
  supplier: {
    name: string;
  };
}

// Tipe untuk setiap item di daftar stok rendah
export interface LowStockItem {
  id: string;
  quantity: number;
  updatedAt: string;
  productId: string | null;
  productVariantId: string | null;
  product: {
    id: string;
    name: string;
  } | null;
  productVariant: {
    value: string;
    sku: string;
    product: {
      id: string;
      name: string;
    };
  } | null;
}

// Tipe utama untuk objek "data" di dalam response
export interface Dashboard {
  stats: DashboardStats;
  recentPurchases: RecentPurchase[];
  lowStockItems: LowStockItem[];
}

// Tipe untuk keseluruhan struktur API response
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: Dashboard;
}
