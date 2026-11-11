import { Router } from 'express';
import {
  listar,
  buscar,
  destacados,
  obtenerPorSlug,
  crear,
  actualizar,
  eliminar
} from '../controllers/tramite.controller.js';
import authenticate from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorize.js';

const router = Router();

// rutas publicas ciudadanas
router.get('/', listar);
router.get('/buscar', buscar);
router.get('/destacados', destacados);
router.get('/:slug', obtenerPorSlug);

// rutas protegidas exclusivas para administración
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), crear);
router.put('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), actualizar);
router.delete('/:id', authenticate, requireRole('ADMIN', 'EDITOR'), eliminar);

export default router;
