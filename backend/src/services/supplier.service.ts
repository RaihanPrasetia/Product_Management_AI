import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';
import { z } from 'zod';
import { createSupplierSchema } from '@/validations/supplier.validation';

type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

class SupplierService {
  public async create(data: CreateSupplierInput, createdById: string) {
    return db.supplier.create({
      data: { ...data, createdById },
    });
  }

  public async findAll() {
    return db.supplier.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  public async findById(id: string) {
    const supplier = await db.supplier.findUnique({
      where: { id, deletedAt: null },
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
}

export default new SupplierService();
