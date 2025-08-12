// src/helpers/prisma.helper.ts

import { PrismaClient } from '@prisma/client';

type PrismaModel = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$on'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$transaction'
  | '$use'
  | '$extends'
>;

export async function createQueryOptions(
  model: any, // Terima model Prisma (misal: db.product)
  queryParams: any, // Terima req.query
  defaultSortField: string = 'createdAt'
) {
  const {
    page = '1',
    limit = '10',
    orderBy = defaultSortField,
    orderDirection = 'desc',
    ...filters
  } = queryParams;

  // 1. Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  // 2. Sorting
  let prismaOrderBy: any = {};
  // Ensure orderBy is a string to prevent type confusion
  let safeOrderBy: string = typeof orderBy === 'string' ? orderBy : (
    Array.isArray(orderBy) && typeof orderBy[0] === 'string' ? orderBy[0] : defaultSortField
  );
  if (safeOrderBy.includes('.')) {
    // Jika key mengandung '.', buat objek nested
    // Contoh: 'product.name' akan menjadi { product: { name: 'asc' } }
    const [relation, field] = safeOrderBy.split('.');
    prismaOrderBy[relation] = { [field]: orderDirection };
  } else {
    // Logika lama untuk field biasa
    prismaOrderBy = { [safeOrderBy]: orderDirection };
  }

  // 3. Filtering
  const where: any = {};
  for (const key in filters) {
    const value = filters[key];

    if (key === 'categoryName') {
      where.category = {
        name: { contains: value, mode: 'insensitive' },
      };
    } else if (key === 'brandName') {
      where.brand = {
        name: { contains: value, mode: 'insensitive' },
      };
    } else if (key.endsWith('_gte')) {
      const field = key.replace('_gte', '');
      where[field] = { ...where[field], gte: new Date(value) };
    } else if (key.endsWith('_lte')) {
      const field = key.replace('_lte', '');
      where[field] = { ...where[field], lte: new Date(value) };
    } else if (key.endsWith('_contains')) {
      // -> FIX: Terjemahkan _contains ke sintaks Prisma yang benar
      const field = key.replace('_contains', '');
      where[field] = { contains: value, mode: 'insensitive' };
    } else {
      where[key] = value;
    }
  }

  // 4. Hitung total data untuk metadata pagination
  const total = await model.count({ where });
  const totalPages = Math.ceil(total / limitNum);

  // Gabungkan semua argumen untuk Prisma
  const prismaArgs = {
    where,
    orderBy: prismaOrderBy,
    skip,
    take,
  };

  // Metadata pagination untuk respons API
  const pagination = {
    total,
    totalPages,
    currentPage: pageNum,
    limit: limitNum,
  };

  return { prismaArgs, pagination };
}
