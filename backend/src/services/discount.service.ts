import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';
import { DiscountType } from '@prisma/client';

class DiscountService {
  // Method create menerima data lengkap
  public async create(
    data: { name: string; type: DiscountType; value: number },
    createdById: string
  ) {
    return db.discount.create({
      data: { ...data, createdById },
    });
  }

  // Method find, findAll, dan delete bisa sama persis dengan CategoryService
  public async findAll() {
    return db.discount.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
  public async findById(id: string) {
    const discount = await db.discount.findUnique({
      where: { id, deletedAt: null },
    });
    if (!discount) {
      throw new AppError('Kategori tidak ditemukan', 404);
    }
    return discount;
  }
  public async delete(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.discount.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Method update menerima data parsial
  public async update(
    id: string,
    data: { name?: string; type?: DiscountType; value?: number }
  ) {
    await this.findById(id);
    return db.discount.update({
      where: { id },
      data,
    });
  }
}

export default new DiscountService();
