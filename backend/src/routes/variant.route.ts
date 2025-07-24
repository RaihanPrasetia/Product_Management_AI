import { Router } from 'express';
import { checkRole } from '@/middlewares/auth.middleware';
import variantController from '@/controllers/variant.controller';

const router = Router();

// Hanya ADMIN yang bisa memodifikasi
router.post('/', checkRole(['ADMIN']), variantController.create);
router.patch('/:id', checkRole(['ADMIN']), variantController.update);
router.delete('/:id', checkRole(['ADMIN']), variantController.delete);

// Rute publik untuk melihat data
router.get('/', variantController.getAll);
router.get('/:id', variantController.getById);

export default router;
