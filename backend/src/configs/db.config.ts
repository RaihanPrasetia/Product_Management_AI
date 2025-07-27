// src/configs/db.config.ts

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

db.$use(async (params, next) => {
  // Cek apakah model punya field 'deletedAt'
  if (params.model && 'deletedAt' in (db as any)[params.model].fields) {
    if (
      ['findUnique', 'findFirst', 'findMany', 'count'].includes(params.action)
    ) {
      if (params.action === 'findUnique') {
        params.action = 'findFirst';
      }
    }
    if (params.action === 'delete') {
      const isPermanent = params.args.where?.permanent;
      if (isPermanent) {
        // Hapus flag agar Prisma tidak error
        delete params.args.where.permanent;
      }
    }

    if (params.action === 'deleteMany') {
      const isPermanent = params.args.where?.permanent;
      if (isPermanent) {
        delete params.args.where.permanent;
      } else {
        params.action = 'updateMany';
        params.args.data = { deletedAt: new Date() };
      }
    }
  }
  return next(params);
});

export default db;
