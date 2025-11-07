import logger from '../config/logger.js';



export function notFound(req,res,next){
    res.status(404).json({error: "notFound",path:req.originalUrl,message:"Endpoint not found"});
}

export function errorHandler(err, req, res, next) {
  // mapeo opcional de CastError -> 400
  if (err.name === 'CastError') {
    logger.warn('CastError on request', { url: req.originalUrl, params: req.params });
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid identifier format' });
  }

  const status = err.status || 500;
  const body = {
    error: err.name || 'Error',
    message: err.message || 'Unexpected error',
  };

  // logueo
  if (status >= 500) logger.error(err); else logger.warn(err.message);

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
  }
  res.status(status).json(body);
}