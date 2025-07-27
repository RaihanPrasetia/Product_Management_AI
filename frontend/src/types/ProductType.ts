// src/types/product.types.ts

import { Brand } from './BrandType';
import { Category } from './CategoryType';
import { Stock } from './StockType';

// Enum berdasarkan data di response
export enum ProductTypeEnum {
  SIMPLE = 'SIMPLE',
  VARIABLE = 'VARIABLE',
}

export enum DiscountTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

// ===============================================
// Tipe untuk Sub-Objek yang ada di dalam Produk
// ===============================================

export interface Discount {
  id: string;
  name: string;
  type: DiscountTypeEnum;
  value: string; // `value` diskon adalah string di JSON
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

export interface VariantDetail {
  id: string;
  name: string; // Contoh: "Warna"
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

export interface ProductVariant {
  id: string;
  value: string; // Contoh: "Hitam"
  sku: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productId: string;
  variantId: string;
  createdById: string;
  stock: Stock;
  variant: VariantDetail;
}

// ===============================================
// Tipe Utama untuk Objek Produk
// ===============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string | null;
  price: string;
  type: ProductTypeEnum;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  brandId: string;
  createdById: string;
  category: Category;
  brand: Brand;
  discounts: Discount[];
  stock: Stock | null; // Bisa null untuk produk VARIABLE
  productVariants: ProductVariant[];
}

/**
 * Mendefinisikan struktur data untuk satu varian saat membuat produk baru.
 */
export interface VariantRequest {
  id?: string;
  variantId: string;
  value: string;
  sku: string;
  price?: number;
  initialStock?: number;
}

/**
 * Mendefinisikan data yang dibutuhkan untuk membuat produk tipe SIMPLE.
 */
export interface SimpleProductRequest {
  type: 'SIMPLE';
  name: string;
  description?: string;
  categoryId: string;
  brandId: string;
  discountIds?: string[];
  // Field wajib untuk produk simple
  sku: string;
  price: number;
  initialStock?: number;
}

/**
 * Mendefinisikan data yang dibutuhkan untuk membuat produk tipe VARIABLE.
 */
export interface VariableProductRequest {
  type: 'VARIABLE';
  name: string;
  description?: string;
  categoryId: string;
  brandId: string;
  discountIds?: string[];
  sku?: string;
  price?: number;
  variants: VariantRequest[];
}

/**
 * Tipe gabungan (union) untuk Product Request.
 * TypeScript akan otomatis mengenali field mana yang valid berdasarkan nilai `type`.
 */
export type ProductRequest = SimpleProductRequest | VariableProductRequest;
