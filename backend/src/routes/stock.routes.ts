import { Router } from 'express';
import StockController from '@/controllers/stock.controller';
import { jwtAuth, checkRole } from '@/middlewares/auth.middleware';

const router = Router();

// Peran yang diizinkan untuk mengelola stok
const allowedRoles = ['ADMIN', 'STAFF_GUDANG'];

// Endpoint untuk melihat semua stok
router.get('/', checkRole(allowedRoles), StockController.getAll);

// Endpoint untuk melakukan penyesuaian stok
router.patch('/adjust', checkRole(allowedRoles), StockController.adjust);

router.get(
  '/:stockId/history',
  checkRole(allowedRoles),
  StockController.getHistory
);

export default router;
