import { Router } from 'express';
import { checkRole } from '@/middlewares/auth.middleware';
import discountController from '@/controllers/discount.controller';

const router = Router();

// Hanya ADMIN yang bisa memodifikasi
router.post('/', checkRole(['ADMIN']), discountController.create);
router.patch('/:id', checkRole(['ADMIN']), discountController.update);
router.delete('/:id', checkRole(['ADMIN']), discountController.delete);

// Rute publik untuk melihat data
router.get('/', discountController.getAll);
router.get('/:id', discountController.getById);

export default router;
