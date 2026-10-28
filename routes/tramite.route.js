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

const router = Router();

// rutas publicas ciudadanas
router.get('/', listar);
router.get('/buscar', buscar);
router.get('/destacados', destacados);
router.get('/:slug', obtenerPorSlug);

// eutas protegidas para administración (quiensabe)
router.post('/', authenticate, crear);
router.put('/:id', authenticate, actualizar);
router.delete('/:id', authenticate, eliminar);

export default router;
