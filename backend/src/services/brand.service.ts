import db from '@/configs/db.config';
import { AppError } from '@/helpers/response.helper';

class BrandService {
  public async create(
    data: { name: string; isActive: boolean },
    createdById: string
  ) {
    return db.brand.create({
      data: { ...data, createdById },
    });
  }

  public async findAll(prismaArgs: any) {
    return db.brand.findMany({
      ...prismaArgs,
    });
  }

  public async findById(id: string) {
    const brand = await db.brand.findUnique({
      where: { id },
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
  public async restore(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.brand.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}

export default new BrandService();
