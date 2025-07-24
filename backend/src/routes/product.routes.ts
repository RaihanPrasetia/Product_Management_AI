// src/routes/product.route.ts
import { Router } from 'express';
import ProductController from '@/controllers/product.controller'; // Impor instance controller
import { checkRole } from '@/middlewares/auth.middleware';

const router = Router();

// Endpoint publik
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Endpoint yang memerlukan otorisasi ADMIN
router.post('/', checkRole(['ADMIN']), ProductController.create);
router.patch('/:id', checkRole(['ADMIN']), ProductController.update);
router.post('/:id/restore', checkRole(['ADMIN']), ProductController.restore);
router.delete('/:id', checkRole(['ADMIN']), ProductController.delete);

export default router;
