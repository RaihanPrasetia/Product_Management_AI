import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Ini adalah praktik standar untuk login (menggunakan body JSON).
router.post('/login', authController.login.bind(authController));

export default router;
