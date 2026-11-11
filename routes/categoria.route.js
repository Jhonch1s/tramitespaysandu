import { Router } from 'express';
import {
  listar,
  obtenerPorSlug,
  crear,
  actualizar,
  eliminar
} from '../controllers/categoria.controller.js';
import authenticate from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// Rutas públicas para ciudadanos
router.get('/', listar);
router.get('/:slug', obtenerPorSlug);

// Rutas protegidas para administración
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), crear);
router.put('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), actualizar);
router.delete('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), eliminar);

export default router;
