import { Router } from 'express';
import { checkRole } from '@/middlewares/auth.middleware';
import brandController from '@/controllers/brand.controller';

const router = Router();

// Hanya ADMIN yang bisa memodifikasi
router.post('/', checkRole(['ADMIN']), brandController.create);
router.patch('/:id', checkRole(['ADMIN']), brandController.update);
router.delete('/:id', checkRole(['ADMIN']), brandController.delete);

// Rute publik untuk melihat data
router.get('/', brandController.getAll);
router.get('/:id', brandController.getById);

export default router;
