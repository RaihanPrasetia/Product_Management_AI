import { Router } from 'express';
import DashboardController from '@/controllers/dashboard.controller';
import { checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const allowedRoles = ['ADMIN', 'STAFF_GUDANG'];

// Endpoint ini hanya boleh diakses oleh ADMIN
router.get('/summary', checkRole(allowedRoles), DashboardController.getSummary);

export default router;
