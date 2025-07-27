import db from '@/configs/db.config';
import { AppError } from '@/helpers/response.helper';
import { z } from 'zod';
import { createSupplierSchema } from '@/validations/supplier.validation';

type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

class SupplierService {
  public async create(data: CreateSupplierInput, createdById: string) {
    return db.supplier.create({
      data: { ...data, createdById },
    });
  }

  public async findAll(prismaArgs: any) {
    return db.supplier.findMany({
      ...prismaArgs,
    });
  }

  public async findById(id: string) {
    const supplier = await db.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      throw new AppError('Supplier tidak ditemukan', 404);
    }
    return supplier;
  }

  public async update(id: string, data: Partial<CreateSupplierInput>) {
    await this.findById(id); // Memastikan supplier ada sebelum update
    return db.supplier.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    await this.findById(id); // Memastikan supplier ada sebelum dihapus
    return db.supplier.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  public async restore(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.supplier.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}

export default new SupplierService();
