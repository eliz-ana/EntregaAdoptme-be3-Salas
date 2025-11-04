import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

const species = ['dog', 'cat', 'hamster', 'parrot', 'turtle'];

export function makeMockPet() {
  return {
    _id: new mongoose.Types.ObjectId(),
    name: faker.person.firstName(),
    specie: faker.helpers.arrayElement(species),
    birthDate: faker.date.birthdate({ min: 1, max: 15, mode: 'age' }),
    adopted: false,
    owner: null,
    image: ''
  };
}

export function makeManyMockPets(count = 50) {
  return Array.from({ length: count }, () => makeMockPet());
}
