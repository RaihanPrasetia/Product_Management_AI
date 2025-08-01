import db from '@/configs/db.config';

const LOW_STOCK_THRESHOLD = 10;

interface DateRange {
  startDate: Date;
  endDate: Date;
}

class DashboardService {
  public async getAdvancedSummary({ startDate, endDate }: DateRange) {
    const [
      totalProducts,
      totalSuppliers,
      lowStockCount,
      salesSummary,
      salesByDay,
      paymentMethodDistribution,
      topSellingItems,
      recentSales,
      lowStockItems,
    ] = await db.$transaction([
      db.product.count({ where: { deletedAt: null } }),
      db.supplier.count({ where: { deletedAt: null } }),
      db.stock.count({
        where: { quantity: { lte: LOW_STOCK_THRESHOLD, gt: 0 } },
      }),
      db.sale.aggregate({
        where: {
          saleDate: { gte: startDate, lte: endDate },
          deletedAt: null,
        },
        _sum: { totalAmount: true },
      }),
      db.$queryRaw<[{ date: Date; total: number }]>`
        SELECT DATE_TRUNC('day', "saleDate") as date, SUM("totalAmount") as total
        FROM "Sale"
        WHERE "saleDate" >= ${startDate} AND "saleDate" <= ${endDate} AND "deletedAt" IS NULL
        GROUP BY date
        ORDER BY date ASC
      `,
      db.payment.groupBy({
        by: ['paymentMethod'],
        _sum: { amount: true },
        where: {
          sale: {
            saleDate: { gte: startDate, lte: endDate },
            deletedAt: null,
          },
        },
        // PERBAIKAN 1: Tambahkan orderBy
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
      }),
      db.saleItem.groupBy({
        by: ['productId', 'productVariantId'],
        _sum: { quantity: true },
        where: {
          sale: {
            saleDate: { gte: startDate, lte: endDate },
            deletedAt: null,
          },
        },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      db.sale.findMany({
        where: { deletedAt: null },
        orderBy: { saleDate: 'desc' },
        take: 5,
        select: {
          id: true,
          invoiceNumber: true,
          totalAmount: true,
          createdBy: { select: { name: true } },
        },
      }),
      db.stock.findMany({
        where: { quantity: { lte: LOW_STOCK_THRESHOLD, gt: 0 } },
        orderBy: { quantity: 'asc' },
        take: 5,
        include: {
          product: { select: { name: true, sku: true, id: true } },
          productVariant: {
            select: {
              value: true,
              sku: true,
              product: { select: { name: true, id: true } },
            },
          },
        },
      }),
    ]);

    const topSellingProducts = await this.getTopSellingProductDetails(
      topSellingItems
    );

    return {
      stats: {
        totalProducts,
        totalSuppliers,
        lowStockItemsCount: lowStockCount,
        totalSales: salesSummary._sum.totalAmount || 0,
      },
      salesByDay,
      // PERBAIKAN 3: Gunakan optional chaining dan nullish coalescing
      paymentMethodDistribution: paymentMethodDistribution.map((p) => ({
        paymentMethod: p.paymentMethod,
        amount: p._sum?.amount ?? 0,
      })),
      topSellingProducts,
      recentSales,
      lowStockItems,
    };
  }

  // PERBAIKAN 2: Perbarui tipe parameter agar lebih toleran
  private async getTopSellingProductDetails(
    items: {
      productId: string | null;
      productVariantId: string | null;
      _sum?: { quantity?: number | null };
    }[]
  ) {
    const productIds = items
      .map((i) => i.productId)
      .filter(Boolean) as string[];
    const variantIds = items
      .map((i) => i.productVariantId)
      .filter(Boolean) as string[];

    const [products, variants] = await Promise.all([
      db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      }),
      db.productVariant.findMany({
        where: { id: { in: variantIds } },
        select: {
          id: true,
          value: true,
          product: { select: { name: true } },
        },
      }),
    ]);

    const productMap = new Map(products.map((p) => [p.id, p.name]));
    const variantMap = new Map(
      variants.map((v) => [v.id, `${v.product.name} - ${v.value}`])
    );

    return items.map((item) => ({
      name: item.productVariantId
        ? variantMap.get(item.productVariantId)
        : productMap.get(item.productId!),
      // Gunakan optional chaining di sini juga
      quantitySold: item._sum?.quantity ?? 0,
    }));
  }
}

export default new DashboardService();
