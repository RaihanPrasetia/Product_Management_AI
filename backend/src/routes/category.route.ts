import { Router } from 'express';
import { checkRole } from '@/middlewares/auth.middleware';
import categoryController from '@/controllers/category.controller';

const router = Router();

// Hanya ADMIN yang bisa memodifikasi
router.post('/', checkRole(['ADMIN']), categoryController.create);
router.patch('/:id', checkRole(['ADMIN']), categoryController.update);
router.delete('/:id', checkRole(['ADMIN']), categoryController.delete);

// Rute publik untuk melihat data
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

export default router;
