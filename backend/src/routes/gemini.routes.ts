import { Router } from 'express';
import geminiController from '@/controllers/gemini.controller';

const router = Router();

router.post('/chat', geminiController.chat);

export default router;
