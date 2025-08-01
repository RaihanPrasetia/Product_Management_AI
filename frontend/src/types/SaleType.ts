// src/utils/types/SaleTypes.ts

import { Product, ProductVariant } from './ProductType';

// Enum untuk metode pembayaran, harus cocok dengan yang ada di schema.prisma
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  QRIS = 'QRIS',
}

// Tipe untuk data Pembayaran (Payment)
export interface Payment {
  id: string;
  amount: number; // Decimal menjadi number
  paymentMethod: PaymentMethod;
  transactionId: string | null;
  paymentDate: string; // DateTime menjadi string (format ISO)
  createdAt: string;
  updatedAt: string;
  saleId: string;
}

// Tipe untuk data Item Penjualan (SaleItem)
export interface SaleItem {
  id: string;
  quantity: number;
  price: number; // Decimal menjadi number
  discount: number; // Decimal menjadi number
  subtotal: number; // Decimal menjadi number
  createdAt: string;
  updatedAt: string;
  saleId: string;
  productId: string | null;
  productVariantId: string | null;
  // Data relasi ini opsional, tergantung 'include' pada query Prisma Anda
  product?: Product;
  productVariant?: ProductVariant;
}

// Tipe utama untuk data Penjualan (Sale)
export interface Sale {
  id: string;
  invoiceNumber: string;
  saleDate: string; // DateTime menjadi string
  subtotal: number; // Decimal menjadi number
  totalDiscount: number; // Decimal menjadi number
  totalAmount: number; // Decimal menjadi number
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;

  // Data relasi yang di-include dari database
  createdBy: { name: string }; // Contoh jika Anda hanya select 'name'
  items: SaleItem[];
  payments: Payment[];
}
// Tipe untuk satu item dalam request
export interface SaleItemRequest {
  itemId: string; // ID unik untuk item di keranjang (bisa productId atau variantId)
  productId?: string;
  productVariantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  stock: number;
}

// Tipe untuk satu pembayaran dalam request
export interface PaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
}

// Tipe untuk request body saat MEMBUAT penjualan baru (POST)
export interface CreateSaleRequest {
  items: SaleItemRequest[];
  payments: PaymentRequest[];
  notes?: string;
}

// Tipe untuk request body saat MENG-UPDATE penjualan (PUT/PATCH)
export interface UpdateSaleRequest {
  items?: SaleItemRequest[];
  payments?: PaymentRequest[];
  notes?: string;
}
