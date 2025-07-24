import { jwtAuth } from '@/middlewares/auth.middleware';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.route';
import brandRoutes from './brand.routes';
import discountRoutes from './discount.routes';
import variantRoutes from './variant.route';
import stockRoutes from './stock.routes';
import supplierRoutes from './supplier.route';
import purchaseRoutes from './purchase.route';
import dashboardRoutes from './dashboard.route';
import geminiRoutes from './gemini.routes';
import { Router } from 'express';

const router = Router();

// Guest routes
router.use('/auth', authRoutes);

// with JWT middleware
router.use((req, res, next) => {
  jwtAuth(req, res, next);
});

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/discounts', discountRoutes);
router.use('/variants', variantRoutes);
router.use('/stocks', stockRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use(geminiRoutes);

export default router;
