import db from '@/configs/db.config';

const LOW_STOCK_THRESHOLD = 10; // Tentukan ambang batas stok rendah di sini

class DashboardService {
  public async getSummary() {
    // Jalankan semua query agregat secara paralel untuk performa maksimal
    const [
      totalProducts,
      totalSuppliers,
      lowStockCount,
      totalStockValueResult,
      recentPurchases,
      lowStockItems,
    ] = await Promise.all([
      // 1. Hitung total produk aktif
      db.product.count({ where: { deletedAt: null } }),

      // 2. Hitung total supplier aktif
      db.supplier.count({ where: { deletedAt: null } }),

      // 3. Hitung jumlah item dengan stok rendah
      db.stock.count({
        where: { quantity: { lte: LOW_STOCK_THRESHOLD, gt: 0 } },
      }),

      // 4. Hitung total nilai inventaris menggunakan query SQL mentah
      db.$queryRaw<[{ totalvalue: number }]>`
        SELECT SUM(s.quantity * COALESCE(pv.price, p.price)) as totalValue
        FROM "Stock" s
        LEFT JOIN "ProductVariant" pv ON s."productVariantId" = pv.id
        LEFT JOIN "Product" p ON s."productId" = p.id
        WHERE p."deletedAt" IS NULL OR pv."deletedAt" IS NULL
      `,

      // 5. Ambil 5 pembelian terbaru
      db.purchase.findMany({
        where: { deletedAt: null },
        orderBy: { purchaseDate: 'desc' },
        take: 5,
        select: {
          id: true,
          invoiceNumber: true,
          totalAmount: true,
          supplier: { select: { name: true } },
        },
      }),

      // 6. Ambil 5 item dengan stok terendah
      db.stock.findMany({
        where: { quantity: { lte: LOW_STOCK_THRESHOLD, gt: 0 } },
        orderBy: { quantity: 'asc' },
        take: 5,
        include: {
          product: { select: { name: true, sku: true } },
          productVariant: {
            select: {
              value: true,
              sku: true,
              product: { select: { id: true, name: true } },
            },
          },
        },
      }),
    ]);

    // Format hasil untuk response
    const summary = {
      stats: {
        totalProducts,
        totalSuppliers,
        lowStockItemsCount: lowStockCount,
        totalStockValue: totalStockValueResult[0]?.totalvalue || 0,
      },
      recentPurchases,
      lowStockItems,
    };

    return summary;
  }
}

export default new DashboardService();
