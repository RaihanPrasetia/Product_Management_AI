// src/utils/types/DashboardType.ts

// Tipe untuk data statistik utama (kartu KPI)
export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  lowStockItemsCount: number;
  totalStockValue: string; // Tipe string sesuai response
  totalSales: string;
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

export interface SalesByDay {
  date: string;
  total: string;
}

// Tipe untuk distribusi metode pembayaran
export interface PaymentMethodDistribution {
  paymentMethod: string;
  amount: string;
}

// Tipe untuk produk terlaris
export interface TopSellingProduct {
  name: string;
  quantitySold: number;
}

// Tipe untuk penjualan terbaru
export interface RecentSale {
  id: string;
  invoiceNumber: string;
  totalAmount: string;
  createdBy: {
    name: string;
  };
}

// Tipe untuk setiap item di daftar stok rendah
export interface LowStockItem {
  id: string;
  quantity: number;
  product: { name: string; id: string } | null;
  productVariant: {
    value: string;
    product: { name: string; id: string };
  } | null;
}

// Tipe utama untuk objek "data" di dalam response
export interface Dashboard {
  stats: DashboardStats;
  recentPurchases: RecentPurchase[];
  lowStockItems: LowStockItem[];
  salesByDay: SalesByDay[]; // <-- Tambahan
  paymentMethodDistribution: PaymentMethodDistribution[]; // <-- Tambahan
  topSellingProducts: TopSellingProduct[]; // <-- Tambahan
  recentSales: RecentSale[]; // <-- Tambahan
}

// Tipe untuk keseluruhan struktur API response
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: Dashboard;
}
