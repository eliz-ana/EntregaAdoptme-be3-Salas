import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.post('/register', catchAsync(sessionsController.register));
router.post('/login', catchAsync(sessionsController.login));
router.get('/current', catchAsync(sessionsController.current));
router.get('/unprotectedLogin', catchAsync(sessionsController.unprotectedLogin));
router.get('/unprotectedCurrent', catchAsync(sessionsController.unprotectedCurrent));

export default router;