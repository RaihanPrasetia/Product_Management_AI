import { Router } from 'express';
import { checkRole } from '@/middlewares/auth.middleware';
import saleController from '@/controllers/sale.controller';

const router = Router();

// Peran yang diizinkan untuk mengelola pembelian
const allowedRoles = ['ADMIN', 'CASHIR'];

router.post('/', checkRole(allowedRoles), saleController.create);
router.get('/', checkRole(allowedRoles), saleController.getAll);
router.get('/:id', checkRole(allowedRoles), saleController.getById);
router.put('/:id', checkRole(['ADMIN']), saleController.update);
router.delete('/:id', checkRole(allowedRoles), saleController.delete);
router.post('/:id/restore', checkRole(allowedRoles), saleController.restore);

export default router;
