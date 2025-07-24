import { z } from 'zod';
import { DiscountType } from '@prisma/client';

export const createDiscountSchema = z.object({
  name: z.string().min(3),
  type: z.nativeEnum(DiscountType), // Validasi enum
  value: z.number().positive(), // Validasi angka positif
  isActive: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.toLowerCase() === 'true') return true;
      if (typeof val === 'string' && val.toLowerCase() === 'false')
        return false;
      return val;
    },
    // Ganti errorMap dengan invalid_type_error
    z.boolean({
      error: 'Status Aktif harus bernilai boolean (true/false)',
    })
  ),
});

export const updateDiscountSchema = createDiscountSchema.partial();
