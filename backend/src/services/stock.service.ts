import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';

// Tipe data dari skema Zod untuk digunakan di service
import { z } from 'zod';
import { adjustStockSchema } from '@/validations/stock.validation';
type AdjustStockInput = z.infer<typeof adjustStockSchema>;

class StockService {
  /**
   * Mengambil semua data stok dengan paginasi dan relasi ke produk/varian.
   */
  public async findAll() {
    return db.stock.findMany({
      include: {
        product: { select: { name: true, sku: true } }, // Ambil info produk simple
        productVariant: {
          select: {
            value: true,
            sku: true,
            product: { select: { name: true } },
          },
        }, // Ambil info produk varian
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Melakukan penyesuaian stok dalam satu transaksi.
   */
  public async adjustStock(data: AdjustStockInput) {
    const { stockId, change, type, notes } = data;

    return db.$transaction(async (prisma) => {
      // 1. Ambil data stok saat ini dan kunci record untuk update (forUpdate)
      const currentStock = await prisma.stock.findUnique({
        where: { id: stockId },
      });

      if (!currentStock) {
        throw new AppError('Data stok tidak ditemukan', 404);
      }

      // 2. Hitung kuantitas baru
      const newQuantity = currentStock.quantity + change;

      // 3. Validasi: Stok tidak boleh menjadi negatif
      if (newQuantity < 0) {
        throw new AppError(
          'Penyesuaian gagal. Stok akhir tidak boleh negatif.',
          400
        );
      }

      // 4. Update kuantitas stok
      const updatedStock = await prisma.stock.update({
        where: { id: stockId },
        data: { quantity: newQuantity },
      });

      // 5. Buat catatan di riwayat stok (StockHistory)
      await prisma.stockHistory.create({
        data: {
          stockId: stockId,
          change: change,
          newQuantity: newQuantity,
          type: type,
          notes: notes,
        },
      });

      return updatedStock;
    });
  }
  public async findHistoryByStockId(
    stockId: string,
    options: { take: number; skip: number }
  ) {
    // Jalankan kedua query secara bersamaan untuk efisiensi
    const [history, total] = await db.$transaction([
      // Query 1: Ambil data riwayat sesuai paginasi
      db.stockHistory.findMany({
        where: { stockId },
        orderBy: { createdAt: 'desc' }, // Tampilkan yang terbaru dulu
        take: options.take,
        skip: options.skip,
      }),
      // Query 2: Hitung total data untuk paginasi
      db.stockHistory.count({
        where: { stockId },
      }),
    ]);

    if (!history) {
      throw new AppError('Riwayat stok tidak ditemukan', 404);
    }

    return { history, total };
  }
}

export default new StockService();
