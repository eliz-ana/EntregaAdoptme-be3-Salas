// src/config/env.js
import 'dotenv/config.js';

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    console.warn(`[env] Missing ${name}. Define it in .env or set a fallback.`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 8080),
  MONGO_URI: required('MONGO_URI', 'mongodb://localhost:27017/adoptme'),
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me',
};
