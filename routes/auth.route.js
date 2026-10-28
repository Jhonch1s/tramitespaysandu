import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/registro', register);
router.post('/login', login);
router.get('/perfil', authenticate, profile);

export default router;
