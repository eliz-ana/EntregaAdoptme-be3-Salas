
import { randomUUID } from 'crypto';



// Middleware to assign a unique request ID to each incoming request
export function requestId(req, res, next) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
}
