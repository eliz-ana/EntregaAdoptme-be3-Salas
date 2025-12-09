import jwt from 'jsonwebtoken';
import { err } from '../utils/httpError.js';
import logger from '../config/logger.js';


const authToken = (req, res, next) => {
  try {
    const token = req.cookies?.coderCookie; // nombre que usás en login

    if (!token) {
      logger.warn('authToken: no token found', { requestId: req.id });
      throw err.unauthorized('Login required');
    }

    const secret = process.env.JWT_SECRET || 'tokenSecretJWT';

    const userData = jwt.verify(token, secret);

    
    req.user = userData;

    logger.info('authToken: user authenticated', {
      requestId: req.id,
      userId: userData.userId,
      role: userData.role,
    });

    next();
  } catch (error) {
  
    next(
      error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'
        ? err.forbidden('Invalid or expired token')
        : error
    );
  }
};

export default authToken;
