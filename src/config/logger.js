import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize,json,errors } = format;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// carpeta de logs
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '../../logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

// niveles personalizados (incluye http)
const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'grey',
});


const isProd = process.env.NODE_ENV === 'production';
const level = process.env.LOG_LEVEL || (isProd ? 'info' : 'debug');


const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}: ${stack || message}${rest}`;
});


const logger = createLogger({
  levels,
  level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // captura stack si le pasás un Error
    isProd ? json() : combine(colorize(), devFormat)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(LOG_DIR, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(LOG_DIR, 'app.log') }),
  ],
});

export default logger;