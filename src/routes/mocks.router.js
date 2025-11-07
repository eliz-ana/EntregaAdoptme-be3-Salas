import { Router } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { makeManyMockUsers } from '../mocks/users.mock.js';
import { makeManyMockPets } from '../mocks/pets.mock.js';
import { usersService, petsService } from '../services/index.js';
import { err } from '../utils/httpError.js';

const router = Router();

/**
 * GET /api/mocks/mockingpets
 * (migrado aquí) -> devuelve pets mockeados (no inserta en DB)
 * ?count=numero  (default 50)
 */
router.get('/mockingpets', (req, res) => {
  const count = Number(req.query.count ?? 50);
  const pets = makeManyMockPets(Number.isFinite(count) && count > 0 ? count : 50);
  res.json({ status: 'success', payload: pets });
});

/**
 * GET /api/mocks/mockingusers
 * Genera 50 usuarios (o ?count=) con formato tipo Mongo (incluye _id)
 * NO inserta en DB, solo devuelve.
 */
router.get('/mockingusers', catchAsync(async (req, res) => {
  const count = Number(req.query.count ?? 50);
  const users = await makeManyMockUsers(Number.isFinite(count) && count > 0 ? count : 50);
  res.json({ status: 'success', payload: users });
}));

/**
 * POST /api/mocks/generateData
 * Body JSON: { "users": <n>, "pets": <m> }
 * Genera e INSERTA en la base de datos la cantidad indicada.
 */
router.post('/generateData', catchAsync(async (req, res) => {
  const usersQty = Number(req.body?.users ?? 0);
  const petsQty  = Number(req.body?.pets ?? 0);

  if (!Number.isFinite(usersQty) || usersQty < 0 || !Number.isFinite(petsQty) || petsQty < 0) {
    throw err.badRequest('users and pets must be non-negative numbers');
  }

  // generar data
  const usersData = await makeManyMockUsers(usersQty);
  const petsData  = makeManyMockPets(petsQty);

  // insertar

  const userPromises = usersData.map(u => usersService.create({
    first_name: u.first_name,
    last_name:  u.last_name,
    email:      u.email,
    password:   u.password,
    role:       u.role,
    pets:       []
  }));

  const petPromises = petsData.map(p => petsService.create({
    name:      p.name,
    specie:    p.specie,
    birthDate: p.birthDate,
    adopted:   false,
    owner:     undefined,
    image:     ''
  }));

  await Promise.all([...userPromises, ...petPromises]);

  res.status(201).json({
    status: 'success',
    message: 'Data generated and inserted',
    inserted: { users: usersQty, pets: petsQty }
  });
}));

export default router;
