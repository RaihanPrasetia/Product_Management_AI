import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

const saleItemSchema = z
  .object({
    productId: z.string().cuid().optional(),
    productVariantId: z.string().cuid().optional(),
    quantity: z.number().int().positive('Kuantitas harus lebih dari 0'),
    price: z.number().positive('Harga harus positif'),
    discount: z.number().min(0).optional().default(0),
  })
  .refine((data) => !!data.productId || !!data.productVariantId, {
    message: 'Setiap item harus memiliki productId atau productVariantId',
    path: ['productId', 'productVariantId'],
  });

const paymentSchema = z.object({
  amount: z.number().positive('Jumlah pembayaran harus positif'),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export const createSaleSchema = z.object({
  items: z
    .array(saleItemSchema)
    .min(1, 'Minimal harus ada satu item dalam penjualan'),
  payments: z
    .array(paymentSchema)
    .min(1, 'Minimal harus ada satu metode pembayaran'),
  notes: z.string().optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export const updateSaleSchema = z.object({
  items: z
    .array(saleItemSchema)
    .min(1, 'Minimal harus ada satu item dalam penjualan')
    .optional(),
  payments: z
    .array(paymentSchema)
    .min(1, 'Minimal harus ada satu metode pembayaran')
    .optional(),
  notes: z.string().optional(),
});

export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;
