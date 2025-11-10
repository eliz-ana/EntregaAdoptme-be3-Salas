import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { err } from '../utils/httpError.js';
import logger from "../config/logger.js";


const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  logger.info('users:register requested', { requestId: req.id, email });

  if (!first_name || !last_name || !email || !password) {

    logger.warn('users:register bad request', { requestId: req.id, email });
    throw err.badRequest('Incomplete values');
  }
  const exists = await usersService.getUserByEmail(email);
  if (exists) {
    logger.warn('users:register conflict (email already exists)', { requestId: req.id, email });
    throw err.conflict('User already exists');
  }

  const hashedPassword = await createHash(password);
  const user = { first_name, last_name, email, password: hashedPassword };
  const result = await usersService.create(user);

  logger.info('users:register ok', { requestId: req.id, email });
  res.status(201).json({ status: "success", payload: result._id });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  logger.info('users:login requested', { requestId: req.id, email });

  if (!email || !password) {
    logger.warn('users:login bad request', { requestId: req.id, email });
    throw err.badRequest('Incomplete values');
  }

  const user = await usersService.getUserByEmail(email);
  if (!user) {
    logger.warn('users:login not found', { requestId: req.id, email });
    throw err.notFound("User doesn't exist");
  }

  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword) {
    logger.warn('users:login incorrect password', { requestId: req.id, email });
    throw err.badRequest('Incorrect password');
  }

  const userDto = UserDTO.getUserTokenFrom(user);
  const token = jwt.sign(userDto, process.env.JWT_SECRET || 'tokenSecretJWT', { expiresIn: "1h" });

  logger.info('users:login ok', { requestId: req.id, email });
  res.cookie('coderCookie', token, { maxAge: 3600000 }).json({ status: "success", message: "Logged in" });
};

const current = async (req, res) => {
  logger.info('users:current requested', { requestId: req.id });

  const cookie = req.cookies['coderCookie'];
  if (!cookie) {
    logger.warn('users:current unauthorized (no cookie)', { requestId: req.id });
    throw err.unauthorized('No cookie found');
  }
  const user = jwt.verify(cookie, process.env.JWT_SECRET || 'tokenSecretJWT');

  logger.info('users:current ok', { requestId: req.id, email: user.email });
  res.json({ status: "success", payload: user });
};

// Unprotected (similar, but uses full user in token)
const unprotectedLogin = async (req, res) => {
  const { email, password } = req.body;

  logger.info('users:unprotectedLogin requested', { requestId: req.id, email });
  if (!email || !password) {

    logger.warn('users:unprotectedLogin bad request', { requestId: req.id, email });
    throw err.badRequest('Incomplete values');
  }

  const user = await usersService.getUserByEmail(email);
  if (!user) {
    logger.warn('users:unprotectedLogin not found', { requestId: req.id, email });
    throw err.notFound("User doesn't exist");
  }

  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword) {
    logger.warn('users:unprotectedLogin incorrect password', { requestId: req.id, email });
    throw err.badRequest('Incorrect password');
  }

  const token = jwt.sign(user, process.env.JWT_SECRET || 'tokenSecretJWT', { expiresIn: "1h" });

  logger.info('users:unprotectedLogin ok', { requestId: req.id, email });
  res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).json({ status: "success", message: "Unprotected Logged in" });
};

const unprotectedCurrent = async (req, res) => {
  logger.info('users:unprotectedCurrent requested', { requestId: req.id });
  const cookie = req.cookies['unprotectedCookie'];
  if (!cookie) {
    
    logger.warn('users:unprotectedCurrent unauthorized (no cookie)', { requestId: req.id });
    throw err.unauthorized('No cookie found');
  }
  const user = jwt.verify(cookie, process.env.JWT_SECRET || 'tokenSecretJWT');

  logger.info('users:unprotectedCurrent ok', { requestId: req.id, email: user.email });
  res.json({ status: "success", payload: user });
};

export default {
  register,
  login,
  current,
  unprotectedLogin,
  unprotectedCurrent
};
