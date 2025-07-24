import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(3, 'Nama supplier minimal 3 karakter'),
  phone: z.string().min(6, 'Nomor telepon tidak valid').optional(),
  address: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();
