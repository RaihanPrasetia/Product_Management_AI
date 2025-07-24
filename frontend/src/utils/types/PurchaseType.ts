// src/utils/types/PurchaseType.ts

// Tipe untuk data Supplier yang ada di dalam Purchase
export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

// Tipe untuk sub-objek Product di dalam PurchaseItem
export interface PurchaseItemProductInfo {
  name: string;
  sku: string;
}

// Tipe untuk sub-objek ProductVariant di dalam PurchaseItem
export interface PurchaseItemProductVariantInfo {
  value: string;
  sku: string;
  product: {
    name: string;
  };
}

// Tipe untuk setiap objek di dalam array "items"
export interface PurchaseItem {
  id: string;
  quantity: number;
  price: string;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
  purchaseId: string;
  productId: string | null;
  productVariantId: string | null;
  product: PurchaseItemProductInfo | null;
  productVariant: PurchaseItemProductVariantInfo | null;
}

// Tipe utama untuk objek "purchase"
export interface Purchase {
  id: string;
  invoiceNumber: string;
  purchaseDate: string;
  totalAmount: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  supplierId: string;
  createdById: string;
  supplier: Supplier;
  items: PurchaseItem[];
}

// Tipe untuk keseluruhan struktur API response
export interface PurchaseApiResponse {
  success: boolean;
  purchase?: Purchase;
  purchases?: Purchase[];
}

// ===============================================
// BONUS: Tipe untuk Request Body (dikirim ke API)
// =urutanyg sudah kita buat di backend Zod
// ===============================================

export interface PurchaseItemRequest {
  productId?: string;
  productVariantId?: string;
  quantity: number;
  price: number;
}

export interface PurchaseRequest {
  supplierId: string;
  purchaseDate?: string; // Opsional, bisa di-default oleh backend
  notes?: string;
  items: PurchaseItemRequest[];
}
