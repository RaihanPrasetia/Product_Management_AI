export type StockHistoryType = 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'RETURN';

// Tipe untuk sub-objek product (versi ringkas)
export interface StockProductInfo {
  name: string;
  sku: string;
}

// Tipe untuk sub-objek productVariant (versi ringkas)
export interface StockProductVariantInfo {
  value: string;
  sku: string;
  product: {
    name: string;
  };
}

// Tipe utama untuk setiap objek di dalam array "stocks"
export interface Stock {
  id: string;
  quantity: number;
  updatedAt: string;
  productId: string | null;
  productVariantId: string | null;
  product: StockProductInfo | null;
  productVariant: StockProductVariantInfo | null;
}

export interface StockRequest {
  stockId: string;
  change: number;
  type: StockHistoryType;
  notes: string;
}

// Tipe untuk keseluruhan struktur API response
export interface StockApiResponse {
  success: boolean;
  message: string;
  stocks: Stock[];
}
