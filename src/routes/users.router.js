import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/', catchAsync(usersController.getAllUsers));

router.get('/:uid', catchAsync(usersController.getUser));
router.put('/:uid', catchAsync(usersController.updateUser));
router.delete('/:uid', catchAsync(usersController.deleteUser));


export default router;