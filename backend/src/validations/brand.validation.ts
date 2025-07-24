import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(3, 'Nama brand minimal 3 karakter'),
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

export const updateBrandSchema = createBrandSchema.partial();
