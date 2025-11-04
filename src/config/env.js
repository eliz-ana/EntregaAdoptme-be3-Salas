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
  PORT: Number(required('PORT', 8080)),
  MONGO_URI: required('MONGO_URI', 'mongodb://localhost:27017/adoptme'),
};
