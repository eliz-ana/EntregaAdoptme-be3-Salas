import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { err } from '../utils/httpError.js';

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) throw err.badRequest('Incomplete values');
  const exists = await usersService.getUserByEmail(email);
  if (exists) throw err.conflict('User already exists');

  const hashedPassword = await createHash(password);
  const user = { first_name, last_name, email, password: hashedPassword };
  const result = await usersService.create(user);
  res.status(201).json({ status: "success", payload: result._id });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw err.badRequest('Incomplete values');

  const user = await usersService.getUserByEmail(email);
  if (!user) throw err.notFound("User doesn't exist");

  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword) throw err.badRequest('Incorrect password');

  const userDto = UserDTO.getUserTokenFrom(user);
  const token = jwt.sign(userDto, process.env.JWT_SECRET || 'tokenSecretJWT', { expiresIn: "1h" });
  res.cookie('coderCookie', token, { maxAge: 3600000 }).json({ status: "success", message: "Logged in" });
};

const current = async (req, res) => {
  const cookie = req.cookies['coderCookie'];
  if (!cookie) throw err.unauthorized('No cookie found');
  const user = jwt.verify(cookie, process.env.JWT_SECRET || 'tokenSecretJWT');
  res.json({ status: "success", payload: user });
};

// Unprotected (similar, but uses full user in token)
const unprotectedLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw err.badRequest('Incomplete values');

  const user = await usersService.getUserByEmail(email);
  if (!user) throw err.notFound("User doesn't exist");

  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword) throw err.badRequest('Incorrect password');

  const token = jwt.sign(user, process.env.JWT_SECRET || 'tokenSecretJWT', { expiresIn: "1h" });
  res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).json({ status: "success", message: "Unprotected Logged in" });
};

const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies['unprotectedCookie'];
  if (!cookie) throw err.unauthorized('No cookie found');
  const user = jwt.verify(cookie, process.env.JWT_SECRET || 'tokenSecretJWT');
  res.json({ status: "success", payload: user });
};

export default {
  register,
  login,
  current,
  unprotectedLogin,
  unprotectedCurrent
};
