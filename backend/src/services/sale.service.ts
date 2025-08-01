import db from '@/configs/db.config';
import { AppError } from '@/helpers/response.helper';
import {
  CreateSaleInput,
  UpdateSaleInput,
} from '@/validations/sale.validation';

class SaleService {
  public async create(data: CreateSaleInput, createdById: string) {
    const { items, payments, notes } = data;

    return db.$transaction(async (prisma) => {
      let subtotal = 0;
      let totalDiscount = 0;
      const saleItemsData = []; // Siapkan array untuk data SaleItem

      // 1. Proses setiap item dalam satu loop yang efisien
      for (const item of items) {
        const stockSourceId = item.productVariantId || item.productId!;

        // ✅ Solusi Race Condition: Update stok secara atomik
        const updatedStock = await prisma.stock.updateMany({
          where: {
            // Tentukan stok mana yang akan diupdate
            OR: [
              { productId: stockSourceId },
              { productVariantId: stockSourceId },
            ],
            // Pastikan stok mencukupi sebelum dikurangi
            quantity: { gte: item.quantity },
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        });

        // Jika tidak ada baris yang ter-update, berarti stok tidak cukup
        if (updatedStock.count === 0) {
          throw new AppError(`Stok untuk produk tidak mencukupi.`, 400);
        }

        // Karena kita tidak mengambil data stok lagi, kita perlu mengambil ID stock untuk history
        const stockRecord = await prisma.stock.findFirst({
          where: {
            OR: [
              { productId: stockSourceId },
              { productVariantId: stockSourceId },
            ],
          },
        });
        if (!stockRecord) throw new AppError('Stock record not found', 500); // Keamanan tambahan

        // Buat riwayat stok
        await prisma.stockHistory.create({
          data: {
            stockId: stockRecord.id,
            change: -item.quantity,
            // newQuantity akan lebih akurat di-handle oleh trigger database jika memungkinkan
            // Tapi untuk saat ini, kita bisa hitung manual setelah decrement
            newQuantity: stockRecord.quantity,
            type: 'SALE',
            notes: `Penjualan item`,
          },
        });

        // Akumulasi total dan siapkan data untuk SaleItem
        const itemSubtotal = item.price * item.quantity;
        const itemDiscount = item.discount ?? 0;

        subtotal += itemSubtotal;
        totalDiscount += itemDiscount;

        saleItemsData.push({
          productId: item.productId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.price,
          discount: itemDiscount,
          subtotal: itemSubtotal - itemDiscount,
        });
      }

      const totalAmount = subtotal - totalDiscount;

      // 2. Validasi total pembayaran (tetap sama, sudah bagus)
      const totalPaymentAmount = payments.reduce((sum, p) => sum + p.amount, 0);
      if (Math.abs(totalPaymentAmount - totalAmount) > 0.01) {
        throw new AppError(
          'Total pembayaran tidak sesuai dengan total tagihan.',
          400
        );
      }

      // 3. Buat entri Penjualan (Sale) utama
      const sale = await prisma.sale.create({
        data: {
          invoiceNumber: `INV-${Date.now()}`,
          saleDate: new Date(),
          subtotal,
          totalDiscount,
          totalAmount,
          notes,
          createdById,
          items: { create: saleItemsData }, // ✅ Gunakan data yang sudah disiapkan
          payments: { create: payments },
        },
        include: {
          items: true,
          payments: true,
          createdBy: { select: { name: true } },
        },
      });

      return sale;
    });
  }

  public async findAll(prismaArgs?: any) {
    return db.sale.findMany({
      ...prismaArgs,
      include: {
        items: true,
        payments: true,
      },
    });
  }

  public async findById(id: string) {
    const sale = await db.sale.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!sale) {
      throw new AppError('Data pembelian tidak ditemukan', 404);
    }
    return sale;
  }

  public async update(saleId: string, data: UpdateSaleInput) {
    const { items, payments, notes } = data;

    return db.$transaction(async (prisma) => {
      // 1. Ambil data penjualan yang ada saat ini, termasuk item-itemnya
      const existingSale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: { items: true },
      });

      if (!existingSale) {
        throw new AppError('Transaksi penjualan tidak ditemukan', 404);
      }

      // 2. KEMBALIKAN STOK dari item-item lama ke inventaris
      for (const oldItem of existingSale.items) {
        const stockSource = oldItem.productVariantId
          ? await prisma.stock.findUnique({
              where: { productVariantId: oldItem.productVariantId },
            })
          : await prisma.stock.findUnique({
              where: { productId: oldItem.productId! },
            });

        if (stockSource) {
          await prisma.stock.update({
            where: { id: stockSource.id },
            data: { quantity: { increment: oldItem.quantity } },
          });
          // Catat riwayat pengembalian stok
          await prisma.stockHistory.create({
            data: {
              stockId: stockSource.id,
              change: oldItem.quantity,
              newQuantity: stockSource.quantity + oldItem.quantity,
              type: 'ADJUSTMENT_IN',
              notes: `Penyesuaian dari update invoice ${existingSale.invoiceNumber}`,
            },
          });
        }
      }

      let newSubtotal = 0;
      let newTotalDiscount = 0;

      // 3. PROSES & KURANGI STOK untuk item-item baru (jika ada)
      if (items) {
        for (const newItem of items) {
          const newStockSource = newItem.productVariantId
            ? await prisma.stock.findUnique({
                where: { productVariantId: newItem.productVariantId },
              })
            : await prisma.stock.findUnique({
                where: { productId: newItem.productId! },
              });

          if (!newStockSource || newStockSource.quantity < newItem.quantity) {
            throw new AppError('Stok untuk item baru tidak mencukupi.', 400);
          }

          await prisma.stock.update({
            where: { id: newStockSource.id },
            data: { quantity: { decrement: newItem.quantity } },
          });
          await prisma.stockHistory.create({
            data: {
              stockId: newStockSource.id,
              change: -newItem.quantity,
              newQuantity: newStockSource.quantity - newItem.quantity,
              type: 'ADJUSTMENT_OUT',
              notes: `Penyesuaian dari update invoice ${existingSale.invoiceNumber}`,
            },
          });

          newSubtotal += Number(newItem.price) * newItem.quantity;
          newTotalDiscount += Number(newItem.discount ?? 0);
        }
      }

      const newTotalAmount = items
        ? Number(newSubtotal) - Number(newTotalDiscount)
        : Number(existingSale.totalAmount);
      // CATATAN: Logika validasi pembayaran baru tidak disertakan di sini.

      if (payments) {
        const totalPaymentAmount = payments.reduce(
          (sum, p) => sum + p.amount,
          0
        );
        if (Math.abs(totalPaymentAmount - newTotalAmount) > 0.01) {
          throw new AppError(
            'Total pembayaran baru tidak sesuai dengan total tagihan baru.',
            400
          );
        }
      }
      // Anda mungkin perlu menambahkan logika refund atau pembayaran tambahan secara terpisah.

      await prisma.payment.deleteMany({ where: { saleId } });

      // 4. Hapus semua item penjualan lama
      await prisma.saleItem.deleteMany({ where: { saleId } });

      // 5. Update data Penjualan utama dengan data baru
      const updatedSale = await prisma.sale.update({
        where: { id: saleId },
        data: {
          notes: notes ?? existingSale.notes,
          subtotal: items ? newSubtotal : existingSale.subtotal,
          totalDiscount: items ? newTotalDiscount : existingSale.totalDiscount,
          totalAmount: items ? newTotalAmount : existingSale.totalAmount,
          // Buat kembali item-item penjualan dengan data yang baru
          items: {
            create: items?.map((item) => ({
              ...item,
              subtotal: item.price * item.quantity - (item.discount ?? 0),
            })),
          },
          payments: {
            create: payments,
          },
        },
        include: {
          items: true,
          payments: true,
          createdBy: { select: { name: true } },
        },
      });

      return updatedSale;
    });
  }

  public async delete(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.sale.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  
  public async restore(id: string) {
    await this.findById(id); // Memastikan kategori ada sebelum dihapus
    return db.sale.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}

export default new SaleService();
