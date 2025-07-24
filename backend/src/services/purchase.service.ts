import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';
import { StockHistoryType } from '@prisma/client';
import { z } from 'zod';
import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from '@/validations/purchase.validation';

type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;

class PurchaseService {
  /**
   * Membuat catatan pembelian baru, mengupdate stok, dan mencatat riwayat.
   */
  public async create(data: CreatePurchaseInput, createdById: string) {
    const { items, ...purchaseData } = data;

    // Gunakan transaksi untuk memastikan semua operasi berhasil atau semua gagal
    return db.$transaction(async (prisma) => {
      // 1. Hitung total harga dari semua item
      const totalAmount = items.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);

      // 2. Buat record Purchase utama
      const newPurchase = await prisma.purchase.create({
        data: {
          ...purchaseData,
          totalAmount,
          createdById,
          invoiceNumber: `INV-${Date.now()}`, // Generate nomor invoice sederhana
        },
      });

      // 3. Proses setiap item: buat PurchaseItem, update Stok, buat StockHistory
      for (const item of items) {
        // Buat record PurchaseItem
        await prisma.purchaseItem.create({
          data: {
            purchaseId: newPurchase.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
          },
        });

        // Tentukan 'where' clause untuk update stok
        const whereStock = item.productId
          ? { productId: item.productId }
          : { productVariantId: item.productVariantId };

        // Update kuantitas stok
        const updatedStock = await prisma.stock.update({
          where: whereStock,
          data: { quantity: { increment: item.quantity } },
        });

        // Buat catatan di riwayat stok
        await prisma.stockHistory.create({
          data: {
            stockId: updatedStock.id,
            change: item.quantity,
            newQuantity: updatedStock.quantity,
            type: StockHistoryType.PURCHASE,
            notes: `Pembelian dari ${newPurchase.invoiceNumber}`,
          },
        });
      }

      // 4. Kembalikan data pembelian yang baru dibuat dengan item-itemnya
      return prisma.purchase.findUnique({
        where: { id: newPurchase.id },
        include: { items: true, supplier: true },
      });
    });
  }

  /**
   * Mengambil semua data pembelian
   */
  public async findAll() {
    return db.purchase.findMany({
      where: { deletedAt: null },
      include: {
        supplier: { select: { id: true, name: true } },
        items: {
          select: {
            id: true,
            productId: true,
            productVariantId: true,
            quantity: true,
            price: true,
          },
        },
        _count: { select: { items: true } },
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  /**
   * Mengambil satu data pembelian berdasarkan ID
   */
  public async findById(id: string) {
    const purchase = await db.purchase.findUnique({
      where: { id, deletedAt: null },
      include: {
        supplier: true,
        items: {
          include: {
            product: { select: { name: true, sku: true } },
            productVariant: {
              select: {
                value: true,
                sku: true,
                product: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      throw new AppError('Data pembelian tidak ditemukan', 404);
    }
    return purchase;
  }

  public async update(
    id: string,
    data: Partial<CreatePurchaseInput>,
    createdById: string
  ) {
    return db.$transaction(async (prisma) => {
      // 1. Pisahkan data. `items` bisa jadi undefined.
      const { items, ...purchaseData } = data;

      // 2. Update data dasar (non-item) dari Purchase terlebih dahulu
      await prisma.purchase.update({
        where: { id },
        data: purchaseData,
      });

      // 3. HANYA proses item jika 'items' ada di dalam data request
      if (items) {
        // Ambil data pembelian lama untuk mengetahui item apa saja yang perlu dikembalikan stoknya
        const oldPurchase = await prisma.purchase.findUnique({
          where: { id },
          include: { items: true },
        });
        if (!oldPurchase) throw new AppError('Pembelian tidak ditemukan', 404);

        // Kembalikan stok dari item-item lama & catat di riwayat
        for (const oldItem of oldPurchase.items) {
          let updatedStock;
          if (oldItem.productId) {
            updatedStock = await prisma.stock.update({
              where: { productId: oldItem.productId },
              data: { quantity: { decrement: oldItem.quantity } },
            });
          } else if (oldItem.productVariantId) {
            updatedStock = await prisma.stock.update({
              where: { productVariantId: oldItem.productVariantId },
              data: { quantity: { decrement: oldItem.quantity } },
            });
          }
          if (updatedStock) {
            await prisma.stockHistory.create({
              data: {
                stockId: updatedStock.id,
                change: -oldItem.quantity,
                newQuantity: updatedStock.quantity,
                type: StockHistoryType.ADJUSTMENT_OUT,
                notes: `Penyesuaian dari update invoice ${oldPurchase.invoiceNumber}`,
              },
            });
          }
        }

        // Hapus semua PurchaseItem yang lama
        await prisma.purchaseItem.deleteMany({ where: { purchaseId: id } });

        // Hitung ulang totalAmount HANYA dari item baru
        const totalAmount = items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

        // Update Purchase lagi dengan totalAmount yang baru
        await prisma.purchase.update({ where: { id }, data: { totalAmount } });

        // Buat PurchaseItem baru dan tambahkan stoknya
        for (const item of items) {
          await prisma.purchaseItem.create({
            data: {
              purchaseId: id,
              productId: item.productId,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.quantity * item.price,
            },
          });

          const whereStock = item.productId
            ? { productId: item.productId }
            : { productVariantId: item.productVariantId };
          if (whereStock.productId || whereStock.productVariantId) {
            const updatedStock = await prisma.stock.update({
              where: whereStock,
              data: { quantity: { increment: item.quantity } },
            });
            await prisma.stockHistory.create({
              data: {
                stockId: updatedStock.id,
                change: item.quantity,
                newQuantity: updatedStock.quantity,
                type: StockHistoryType.PURCHASE,
                notes: `Update pada invoice ${oldPurchase.invoiceNumber}`,
              },
            });
          }
        }
      }

      // 4. Kembalikan data pembelian terbaru yang sudah lengkap
      return prisma.purchase.findUnique({
        where: { id },
        include: { items: true, supplier: true },
      });
    });
  }
}

export default new PurchaseService();
