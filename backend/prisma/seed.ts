import { PrismaClient, StockHistoryType, ProductType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // ... (bagian cleanup, roles, users, master data tetap sama)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // CLEANUP ...
  console.log('Cleaning up database...');
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.stockHistory.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // ROLES & USERS ...
  console.log('Seeding roles and users...');
  const adminRole = await prisma.role.create({ data: { name: 'ADMIN' } });
  const staffRole = await prisma.role.create({
    data: { name: 'STAFF_GUDANG' },
  });
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });
  const staffUser = await prisma.user.create({
    data: {
      name: 'Staff Gudang',
      email: 'staff@example.com',
      password: hashedPassword,
      roleId: staffRole.id,
    },
  });

  // MASTER DATA ...
  console.log('Seeding master data...');
  const category1 = await prisma.category.create({
    data: { name: 'Kacamata Baca', createdById: adminUser.id, isActive: true },
  });
  const categoryAksesoris = await prisma.category.create({
    data: { name: 'Aksesoris', createdById: adminUser.id, isActive: true },
  });
  const brand1 = await prisma.brand.create({
    data: { name: 'Optik Seis', createdById: adminUser.id, isActive: true },
  });
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'PT Lensa Jaya',
      phone: '081234567890',
      address: 'Jl. Industri No. 1, Jakarta',
      createdById: adminUser.id,
    },
  });
  const variantColor = await prisma.variant.create({
    data: { name: 'Warna', createdById: adminUser.id, isActive: true },
  });

  // DISCOUNTS ...
  console.log('Seeding discounts...');
  const discountLebaran = await prisma.discount.create({
    data: {
      name: 'Diskon Lebaran 15%',
      type: 'PERCENTAGE',
      value: 15,
      createdById: adminUser.id,
      isActive: true,
    },
  });

  // PRODUCTS ...
  console.log('Seeding a VARIABLE product...');
  const variableProduct = await prisma.product.create({
    data: {
      name: 'Kacamata Frame Kotak Tipe A',
      type: ProductType.VARIABLE,
      description: 'Frame kotak klasik yang cocok untuk segala wajah.',
      sku: 'KMT-A-BASE',
      price: 450000,
      categoryId: category1.id,
      brandId: brand1.id,
      createdById: adminUser.id,
      discounts: { connect: [{ id: discountLebaran.id }] },
      productVariants: {
        create: [
          {
            value: 'Hitam',
            sku: 'KMT-A-HTM',
            variantId: variantColor.id,
            price: 430000,
            createdById: adminUser.id,
            stock: { create: { quantity: 0 } },
          },
          {
            value: 'Coklat',
            sku: 'KMT-A-CKL',
            variantId: variantColor.id,
            price: 420000,
            createdById: adminUser.id,
            stock: { create: { quantity: 0 } },
          },
        ],
      },
    },
    include: { productVariants: true },
  });

  console.log('Seeding a SIMPLE product...');
  const simpleProduct = await prisma.product.create({
    data: {
      name: 'Cairan Pembersih Lensa Pro',
      type: ProductType.SIMPLE,
      description: 'Cairan pembersih anti-kabut untuk semua jenis lensa.',
      sku: 'CPL-PRO-100ML',
      price: 75000,
      categoryId: categoryAksesoris.id,
      brandId: brand1.id,
      createdById: adminUser.id,
      stock: { create: { quantity: 0 } },
    },
  });

  // ======================================================
  // BAGIAN YANG DIPERBAIKI
  // ======================================================

  console.log('Simulating a purchase to add initial stock...');
  const purchasePriceVar = 50000;
  const purchaseQuantityVar = 20;
  const purchasePriceSimple = 40000;
  const purchaseQuantitySimple = 50;

  const newPurchase = await prisma.purchase.create({
    data: {
      invoiceNumber: `INV-${Date.now()}`,
      supplierId: supplier1.id,
      createdById: staffUser.id,
      totalAmount:
        purchasePriceVar * purchaseQuantityVar +
        purchasePriceSimple * purchaseQuantitySimple,
      items: {
        create: [
          {
            // Pembelian untuk produk dengan varian
            productVariantId: variableProduct.productVariants[0].id, // Beli varian 'Hitam'
            quantity: purchaseQuantityVar,
            price: purchasePriceVar,
            subtotal: purchasePriceVar * purchaseQuantityVar,
          },
          {
            // FIX: Tambahkan pembelian untuk produk simple
            productId: simpleProduct.id,
            quantity: purchaseQuantitySimple,
            price: purchasePriceSimple,
            subtotal: purchasePriceSimple * purchaseQuantitySimple,
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log('Updating stock levels and creating history...');

  // FIX: Loop yang bisa menangani produk simple dan varian
  for (const item of newPurchase.items) {
    let updatedStock;

    // Cek apakah item ini untuk varian atau produk simple
    if (item.productVariantId) {
      updatedStock = await prisma.stock.update({
        where: { productVariantId: item.productVariantId },
        data: { quantity: { increment: item.quantity } },
      });
    } else if (item.productId) {
      updatedStock = await prisma.stock.update({
        where: { productId: item.productId },
        data: { quantity: { increment: item.quantity } },
      });
    }

    // Buat histori hanya jika stok berhasil diupdate
    if (updatedStock) {
      await prisma.stockHistory.create({
        data: {
          stockId: updatedStock.id,
          change: item.quantity,
          newQuantity: updatedStock.quantity,
          type: StockHistoryType.PURCHASE,
          notes: `Dari pembelian ${newPurchase.invoiceNumber}`,
        },
      });
    }
  }

  console.log('Stock levels and history have been updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding finished.');
  });
