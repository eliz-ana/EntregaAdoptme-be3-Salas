// src/middlewares/requestLogger.js
import morgan from 'morgan';
import logger from '../config/logger.js';

// enviamos las líneas de morgan al nivel "http" de winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

// saltear logs de request en tests (por si a futuro)
const skip = () => process.env.NODE_ENV === 'test';

// formato: MÉTODO URL STATUS - TIEMPO
export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);
