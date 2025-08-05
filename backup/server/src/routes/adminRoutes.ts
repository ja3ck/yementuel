import { Router } from 'express';
import { login, setDailyWord, getDailyWord } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Admin login
router.post('/login', login);

// Protected routes
router.use(authMiddleware);
router.get('/daily-word', getDailyWord);
router.put('/daily-word', setDailyWord);

export default router;