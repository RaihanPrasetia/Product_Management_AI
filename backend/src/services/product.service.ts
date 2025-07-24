// src/services/product.service.ts
import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';
import { Prisma, ProductType } from '@prisma/client';
import {
  CreateProductInput,
  UpdateProductInput,
} from '@/validations/product.validation';

class ProductService {
  // Method untuk membuat produk
  public async create(data: CreateProductInput, createdById: string) {
    return db.$transaction(async (prisma) => {
      if (data.type === 'SIMPLE') {
        const { initialStock = 0, discountIds, ...productData } = data;
        return prisma.product.create({
          data: {
            ...productData,
            createdById,
            discounts: { connect: discountIds?.map((id) => ({ id })) },
            stock: { create: { quantity: initialStock } },
          },
        });
      }

      if (data.type === 'VARIABLE') {
        const { variants, discountIds, ...productData } = data;
        const product = await prisma.product.create({
          data: {
            ...productData,
            createdById,
            discounts: { connect: discountIds?.map((id) => ({ id })) },
          },
        });

        await Promise.all(
          variants.map((variant) => {
            const { initialStock = 0, ...variantData } = variant;
            return prisma.productVariant.create({
              data: {
                ...variantData,
                productId: product.id,
                createdById,
                stock: { create: { quantity: initialStock } },
              },
            });
          })
        );
        return prisma.product.findUnique({
          where: { id: product.id },
          include: { productVariants: true },
        });
      }
    });
  }

  // Method untuk mengambil semua produk
  public async findAll(options?: { includeDeleted?: boolean }) {
    const where: Prisma.ProductWhereInput = {};

    // Jika opsi 'includeDeleted' true, tambahkan flag kustom ke 'where'
    // Middleware akan membaca flag ini dan menghapus filter `deletedAt: null`
    if (options?.includeDeleted) {
      (where as any).includeDeleted = true;
    }
    return db.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        discounts: true,
        stock: true,
        productVariants: { include: { stock: true, variant: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Method untuk mengambil produk by ID
  public async findById(id: string) {
    const product = await db.product.findFirst({
      where: { id, includeDeleted: true } as any,
      include: {
        category: true,
        brand: true,
        discounts: true,
        stock: true,
        productVariants: { include: { stock: true, variant: true } },
      },
    });

    if (!product) {
      throw new AppError('Produk tidak ditemukan', 404);
    }
    return product;
  }

  // Method untuk update produk
  public async update(id: string, data: UpdateProductInput, createdBy: string) {
    return db.$transaction(async (prisma) => {
      if (data.type === 'VARIABLE') {
        // FIX 1: Pindahkan destructuring ke dalam blok if
        // Di sini, TypeScript tahu 'data' pasti memiliki 'variants'.
        const { variants, ...productData } = data;

        await prisma.product.update({
          where: { id },
          data: {
            name: productData.name,
            description: productData.description,
            categoryId: productData.categoryId,
            brandId: productData.brandId,
            sku: productData.sku,
            price: productData.price,
          },
        });

        if (variants) {
          const existingVariants = await prisma.productVariant.findMany({
            where: { productId: id },
            select: { id: true },
          });
          // FIX 2: Beri tipe eksplisit untuk 'v'
          const existingVariantIds = existingVariants.map(
            (v: { id: string }) => v.id
          );
          const incomingVariantIds = variants
            .map((v) => v.id)
            .filter(Boolean) as string[];

          const variantsToDelete = existingVariantIds.filter(
            (existingId) => !incomingVariantIds.includes(existingId)
          );
          if (variantsToDelete.length > 0) {
            await prisma.productVariant.deleteMany({
              where: { id: { in: variantsToDelete } },
            });
          }

          // FIX 2: Beri tipe eksplisit untuk 'variant'
          await Promise.all(
            variants.map(async (variant: (typeof variants)[number]) => {
              const { initialStock = 0, ...variantData } = variant;

              if (variant.id) {
                // --- LOGIKA UPDATE ---
                return prisma.productVariant.update({
                  where: { id: variant.id },
                  data: {
                    value: variantData.value,
                    sku: variantData.sku,
                    price: variantData.price,
                    // FIX 3: Untuk update, gunakan 'update' atau 'upsert' pada stock
                    stock: {
                      upsert: {
                        create: { quantity: initialStock },
                        update: { quantity: initialStock },
                      },
                    },
                  },
                });
              } else {
                // --- LOGIKA CREATE ---
                return prisma.productVariant.create({
                  data: {
                    value: variantData.value,
                    sku: variantData.sku,
                    price: variantData.price,
                    product: { connect: { id } },
                    variant: { connect: { id: variantData.variantId } },
                    createdBy: { connect: { id: createdBy } },
                    // FIX 3: Untuk create, hanya gunakan 'create' pada stock
                    stock: {
                      create: { quantity: initialStock },
                    },
                  },
                });
              }
            })
          );
        }
      } else if (data.type === 'SIMPLE') {
        // Logika untuk produk simple (sudah benar)
        const { initialStock, ...simpleProductData } = data;
        await prisma.product.update({
          where: { id },
          data: {
            ...simpleProductData,
            stock: {
              update: { quantity: initialStock },
            },
          },
        });
      }

      return prisma.product.findUnique({
        where: { id },
        include: { productVariants: { include: { stock: true } }, stock: true },
      });
    });
  }

  // Method untuk soft delete produk
  public async delete(id: string) {
    await this.findById(id); // Validasi produk ada
    return db.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Memulihkan produk yang sudah di-soft delete.
   */
  public async restore(id: string) {
    const product = await db.product.findFirst({
      where: { id, includeDeleted: true } as any,
    });

    if (!product) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    if (product.deletedAt === null) {
      throw new AppError('Produk tidak dalam kondisi dihapus', 400);
    }

    return db.product.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}

export default new ProductService();
