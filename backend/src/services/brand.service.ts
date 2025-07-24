import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';

class BrandService {
  public async create(
    data: { name: string; isActive: boolean },
    createdById: string
  ) {
    return db.brand.create({
      data: { ...data, createdById },
    });
  }

  public async findAll() {
    return db.brand.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  public async findById(id: string) {
    const brand = await db.brand.findUnique({
      where: { id, deletedAt: null },
    });
    if (!brand) {
      throw new AppError('Merk tidak ditemukan', 404);
    }
    return brand;
  }

  public async update(id: string, data: { name?: string; isActive?: boolean }) {
    await this.findById(id); // Memastikan kategori ada sebelum update
    return db.brand.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new BrandService();
