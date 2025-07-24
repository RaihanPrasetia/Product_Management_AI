import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';

class CategoryService {
  public async create(
    data: { name: string; isActive: boolean },
    createdById: string
  ) {
    return db.category.create({
      data: { ...data, createdById },
    });
  }

  public async findAll() {
    return db.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  public async findById(id: string) {
    const category = await db.category.findUnique({
      where: { id, deletedAt: null },
    });
    if (!category) {
      throw new AppError('Kategori tidak ditemukan', 404);
    }
    return category;
  }

  public async update(id: string, data: { name?: string; isActive?: boolean }) {
    await this.findById(id); // Memastikan kategori ada sebelum update
    return db.category.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new CategoryService();
