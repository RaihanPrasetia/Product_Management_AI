import { z } from 'zod';

// Skema untuk setiap item di dalam array pembelian
const purchaseItemSchema = z
  .object({
    productId: z.string().cuid().optional(),
    productVariantId: z.string().cuid().optional(),
    quantity: z.number().int().positive('Kuantitas harus lebih dari 0'),
    price: z.number().positive('Harga harus lebih dari 0'),
  })
  .superRefine((data, ctx) => {
    // Pastikan HANYA SATU dari productId atau productVariantId yang diisi
    if (data.productId && data.productVariantId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Satu item tidak boleh memiliki productId dan productVariantId sekaligus.',
      });
    }
    if (!data.productId && !data.productVariantId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Satu item harus memiliki productId atau productVariantId.',
      });
    }
  });

export const createPurchaseSchema = z.object({
  supplierId: z.string().cuid('ID Supplier tidak valid'),
  purchaseDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  items: z
    .array(purchaseItemSchema)
    .min(1, 'Minimal ada satu item dalam pembelian'),
});

export const updatePurchaseSchema = createPurchaseSchema.partial();
