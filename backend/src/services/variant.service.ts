import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';

class VariantService {
  public async create(
    data: { name: string; isActive: boolean },
    createdById: string
  ) {
    return db.variant.create({
      data: { ...data, createdById },
    });
  }

  public async findAll() {
    return db.variant.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  public async findById(id: string) {
    const variant = await db.variant.findUnique({
      where: { id, deletedAt: null },
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
}

export default new VariantService();
