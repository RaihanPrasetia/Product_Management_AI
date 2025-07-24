// src/validations/product.validation.ts
import { z } from 'zod';
import { ProductType } from '@prisma/client';

// Skema untuk satu varian saat membuat produk (tetap sama)
const VariantSchema = z.object({
  id: z.string().cuid(),
  variantId: z.string().cuid(),
  value: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().positive('Harga harus lebih dari 0').optional(),
  initialStock: z.coerce.number().int().min(0).default(0),
});

// Skema dasar yang dimiliki semua produk (tetap sama)
const BaseProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  brandId: z.string().cuid(),
  discountIds: z.array(z.string().cuid()).optional(),
});

// Skema untuk CREATE (tetap sama)
const SimpleProductSchema = BaseProductSchema.extend({
  type: z.literal(ProductType.SIMPLE),
  sku: z.string().min(1, 'SKU wajib diisi untuk produk simple'),
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  initialStock: z.coerce.number().int().min(0).default(0),
});

const VariableProductSchema = BaseProductSchema.extend({
  type: z.literal(ProductType.VARIABLE),

  // FIX 1: Otomatis ubah string kosong "" menjadi undefined
  sku: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),

  // Aturan ini sudah benar, masalahnya ada di data yang dikirim frontend
  price: z.coerce.number().positive().optional(),

  variants: z
    .array(VariantSchema)
    .min(1, 'Produk variabel harus memiliki minimal 1 varian'),
});

export const createProductSchema = z.discriminatedUnion('type', [
  SimpleProductSchema,
  VariableProductSchema,
]);

// ======================================================
// BAGIAN YANG DIPERBAIKI UNTUK SKEMA UPDATE
// ======================================================

// Buat versi partial dari setiap skema, tapi pastikan 'type' tetap ada
const UpdateSimpleProductSchema = BaseProductSchema.partial().extend({
  type: z.literal(ProductType.SIMPLE),
  sku: z.string().min(1).optional(),
  price: z.coerce.number().positive().optional(), // <-- DIUBAH
  initialStock: z.coerce.number().int().min(0).optional().default(0),
});

const UpdateVariableProductSchema = BaseProductSchema.partial().extend({
  type: z.literal(ProductType.VARIABLE),
  sku: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)), // Terapkan juga di sini
  price: z.coerce.number().positive().optional(),
  variants: z.array(VariantSchema).min(1).optional(),
});

// Buat discriminatedUnion baru dari skema-skema partial tersebut
export const updateProductSchema = z.discriminatedUnion('type', [
  UpdateSimpleProductSchema,
  UpdateVariableProductSchema,
]);

// Tipe TypeScript diekstrak dari skema yang benar
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
