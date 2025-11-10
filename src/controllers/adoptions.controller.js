import { adoptionsService, petsService, usersService } from "../services/index.js";
import { err } from "../utils/httpError.js";
import logger from "../config/logger.js";

const getAllAdoptions = async (req, res) => {
  logger.info('adoptions:list', { requestId: req.id });
  const result = await adoptionsService.getAll();
  res.json({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;
  logger.info('adoptions:get', { requestId: req.id, adoptionId });
  const adoption = await adoptionsService.getBy({ _id: adoptionId });
  if (!adoption){
    logger.warn('adoptions:get not found', { requestId: req.id, adoptionId });
    throw err.notFound('Adoption not found');
  }
  res.json({ status: "success", payload: adoption });
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;
  logger.info('adoptions:create requested', { requestId: req.id, uid, pid });
  const user = await usersService.getUserById(uid);
  if (!user) {
    logger.warn('adoptions:create user not found', { requestId: req.id, uid });
    throw err.notFound('User not found');
  }

  const pet = await petsService.getBy({ _id: pid });
  if (!pet) {
    logger.warn('adoptions:create pet not found', { requestId: req.id, pid });
    throw err.notFound('Pet not found');
  }
  if (pet.adopted) {
    logger.warn('adoptions:create pet already adopted', { requestId: req.id, pid });
    throw err.badRequest('Pet is already adopted');
  }

  user.pets.push(pet._id);
  await usersService.update(user._id, { pets: user.pets });
  await petsService.update(pet._id, { adopted: true, owner: user._id });
  await adoptionsService.create({ owner: user._id, pet: pet._id });
  logger.info('adoptions:create ok', { requestId: req.id, uid, pid });
  res.json({ status: "success", message: "Pet adopted" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption
};
