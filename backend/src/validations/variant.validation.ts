import { z } from 'zod';

export const createVariantSchema = z.object({
  name: z.string().min(2, 'Nama varian minimal 2 karakter'),
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

export const updateVariantSchema = createVariantSchema.partial();
