import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/', catchAsync(petsController.getAllPets));
router.post('/', catchAsync(petsController.createPet));
router.post('/withimage', uploader.single('image'), catchAsync(petsController.createPetWithImage));
router.put('/:pid', catchAsync(petsController.updatePet));
router.delete('/:pid', catchAsync(petsController.deletePet));

export default router;