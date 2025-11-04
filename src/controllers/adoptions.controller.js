import { adoptionsService, petsService, usersService } from "../services/index.js";
import { err } from "../utils/httpError.js";

const getAllAdoptions = async (req, res) => {
  const result = await adoptionsService.getAll();
  res.json({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;
  const adoption = await adoptionsService.getBy({ _id: adoptionId });
  if (!adoption) throw err.notFound('Adoption not found');
  res.json({ status: "success", payload: adoption });
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;
  const user = await usersService.getUserById(uid);
  if (!user) throw err.notFound('User not found');

  const pet = await petsService.getBy({ _id: pid });
  if (!pet) throw err.notFound('Pet not found');
  if (pet.adopted) throw err.badRequest('Pet is already adopted');

  user.pets.push(pet._id);
  await usersService.update(user._id, { pets: user.pets });
  await petsService.update(pet._id, { adopted: true, owner: user._id });
  await adoptionsService.create({ owner: user._id, pet: pet._id });

  res.json({ status: "success", message: "Pet adopted" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption
};
