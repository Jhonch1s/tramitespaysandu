import { Router } from 'express';
import {
  listar,
  obtenerPorSlug,
  crear,
  actualizar,
  eliminar
} from '../controllers/categoria.controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// Rutas públicas para ciudadanos
router.get('/', listar);
router.get('/:slug', obtenerPorSlug);

// Rutas protegidas para administración
router.post('/', authenticate, crear);
router.put('/:id', authenticate, actualizar);
router.delete('/:id', authenticate, eliminar);

export default router;
