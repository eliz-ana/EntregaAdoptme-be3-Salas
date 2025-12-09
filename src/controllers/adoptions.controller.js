import mongoose from "mongoose";
import { adoptionsService, petsService, usersService } from "../services/index.js";
import { err } from "../utils/httpError.js";
import logger from "../config/logger.js";

import { tr } from "@faker-js/faker";

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
  const { pid } = req.params;       
  const tokenUser = req.user;      

  logger.info('adoptions:create requested', {
    requestId: req.id,
    pid,
    userFromToken: tokenUser,
  });

  // 1) Tiene que estar logueado
  if (!tokenUser) {
    logger.warn('adoptions:create not authenticated', { requestId: req.id });
    throw err.unauthorized('Login required');
  }

  // 2) No puede ser admin
  if (tokenUser.role === 'admin') {
    logger.warn('adoptions:create forbidden role', {
      requestId: req.id,
      userId: tokenUser.userId,
      role: tokenUser.role,
    });
    throw err.forbidden('Admins cannot adopt pets');
  }

  // 3) Validar formato de pid
  if (!mongoose.isValidObjectId(pid)) {
    logger.warn('adoptions:create invalid pet id', { requestId: req.id, pid });
    throw err.badRequest('Invalid pet id');
  }

  // 4) Buscar usuario real en DB
  const userId = tokenUser.userId;
  const user = await usersService.getUserByIdRaw(userId);
  if (!user) {
    logger.warn('adoptions:create user not found', { requestId: req.id, userId });
    throw err.notFound('User not found');
  }

  // 5) Buscar mascota
  const pet = await petsService.getBy({ _id: pid });
  if (!pet) {
    logger.warn('adoptions:create pet not found', { requestId: req.id, pid });
    throw err.notFound('Pet not found');
  }

  if (pet.adopted) {
    logger.warn('adoptions:create pet already adopted', { requestId: req.id, pid });
    throw err.badRequest('Pet is already adopted');
  }

  // 6) Actualizar user + pet + crear adopción
  user.pets.push(pet._id);
  await usersService.update(user._id, { pets: user.pets });
  await petsService.update(pet._id, { adopted: true, owner: user._id });

  const adoption = await adoptionsService.create({
    owner: user._id,
    pet: pet._id,
  });

  logger.info('adoptions:create ok', {          
    requestId: req.id,
    userId: user._id,
    petId: pet._id,
  });

  res.status(201).json({ status: "success", payload: adoption });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption
};
