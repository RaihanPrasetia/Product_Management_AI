import { Router } from 'express';
import SupplierController from '@/controllers/supplier.controller';
import { checkRole } from '@/middlewares/auth.middleware';

const router = Router();

const allowedRoles = ['ADMIN', 'STAFF_GUDANG'];

router.post('/', checkRole(allowedRoles), SupplierController.create);
router.patch('/:id', checkRole(allowedRoles), SupplierController.update);
router.delete('/:id', checkRole(allowedRoles), SupplierController.delete);

// Semua pengguna yang login bisa melihat data supplier
router.get('/', SupplierController.getAll);
router.get('/:id', SupplierController.getById);

export default router;
