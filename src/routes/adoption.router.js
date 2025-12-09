import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import authToken from '../middlewares/authToken.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/', catchAsync(adoptionsController.getAllAdoptions));
router.get('/:aid', catchAsync(adoptionsController.getAdoption));
router.post('/:pid', authToken, catchAsync(adoptionsController.createAdoption));

export default router;