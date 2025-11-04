import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/', catchAsync(adoptionsController.getAllAdoptions));
router.get('/:aid', catchAsync(adoptionsController.getAdoption));
router.post('/:uid/:pid', catchAsync(adoptionsController.createAdoption));

export default router;