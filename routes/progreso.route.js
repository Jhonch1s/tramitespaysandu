import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  getProgresoPorTramite,
  toggleRequisito,
  getAllProgreso
} from '../controllers/progreso.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllProgreso);
router.get('/:tramiteSlug', getProgresoPorTramite);
router.post('/:tramiteSlug/toggle', toggleRequisito);

export default router;
