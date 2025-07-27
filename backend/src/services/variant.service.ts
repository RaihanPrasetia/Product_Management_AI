import db from '@/configs/db.config';
import { AppError } from '@/helpers/response.helper';

class VariantService {
  public async create(
    data: { name: string; isActive: boolean },
    createdById: string
  ) {
    return db.variant.create({
      data: { ...data, createdById },
    });
  }

  public async findAll(prismaArgs: any) {
    return db.variant.findMany({
      ...prismaArgs,
    });
  }

  public async findById(id: string) {
    const variant = await db.variant.findUnique({
      where: { id },
    });
    if (!variant) {
      throw new AppError('Varian tidak ditemukan', 404);
    }
    return variant;
  }

  public async update(id: string, data: { name?: string; isActive?: boolean }) {
    await this.findById(id); // Memastikan varian ada sebelum update
    return db.variant.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    await this.findById(id); // Memastikan varian ada sebelum dihapus
    return db.variant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public async restore(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.variant.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}

export default new VariantService();
