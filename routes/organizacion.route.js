import { Router } from 'express';
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
} from '../controllers/organizacion.controller.js';
import authenticate from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// rutas públicas
router.get('/', listar);
router.get('/:id', obtenerPorId);

// rutas protegidas para administración
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), crear);
router.put('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), actualizar);
router.delete('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), eliminar);

export default router;
