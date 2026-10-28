import { Router } from 'express';
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
} from '../controllers/organizacion.controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// rutas públicas
router.get('/', listar);
router.get('/:id', obtenerPorId);

// rutas protegidas para administración
router.post('/', authenticate, crear);
router.put('/:id', authenticate, actualizar);
router.delete('/:id', authenticate, eliminar);

export default router;
