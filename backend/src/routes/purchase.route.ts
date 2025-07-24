import { Router } from 'express';
import PurchaseController from '@/controllers/purchase.controller';
import { checkRole } from '@/middlewares/auth.middleware';

const router = Router();

// Peran yang diizinkan untuk mengelola pembelian
const allowedRoles = ['ADMIN', 'STAFF_GUDANG'];

router.post('/', checkRole(allowedRoles), PurchaseController.create);
router.get('/', checkRole(allowedRoles), PurchaseController.getAll);
router.get('/:id', checkRole(allowedRoles), PurchaseController.getById);
router.patch('/:id', checkRole(allowedRoles), PurchaseController.update);

export default router;
