// Genera usuarios mockeados con las reglas del enunciado
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js'; // ya lo usás en sessions

export async function makeMockUser() {
  return {
    _id: new mongoose.Types.ObjectId(),               // simula _id de Mongo
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: await createHash('coder123'),           // "coder123" encriptada
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: []                                          // array vacío
  };
}

export async function makeManyMockUsers(count = 50) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(await makeMockUser());
  return out;
}
