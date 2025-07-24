import { z } from 'zod';
import { StockHistoryType } from '@prisma/client';

// Hanya izinkan tipe histori yang relevan untuk penyesuaian manual
const validAdjustmentTypes = z.enum([
  StockHistoryType.ADJUSTMENT_IN,
  StockHistoryType.ADJUSTMENT_OUT,
  StockHistoryType.RETURN,
]);

export const adjustStockSchema = z.object({
  stockId: z.string().cuid('ID Stok tidak valid'),
  // `change` adalah perubahan kuantitas (+10 atau -5), tidak boleh 0
  change: z
    .number()
    .int()
    .refine((val) => val !== 0, {
      message: 'Nilai perubahan tidak boleh nol',
    }),
  type: validAdjustmentTypes,
  notes: z.string().min(3, 'Catatan minimal 3 karakter').optional(),
});

export const getStockHistoryParamsSchema = z.object({
  stockId: z.string().cuid('ID Stok tidak valid'),
});

// Skema untuk memvalidasi parameter query untuk paginasi
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
