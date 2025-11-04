export function notFound(req,res,next){
    res.status(404).json({error: "notFound",path:req.originalUrl,message:"Endpoint not found"});
}

export function errorHandler(err,req,res,next){

    const status= err.status || 500;
    const body = {
        error: err.name || 'Error',
        message: err.message || 'Unexpected error',
    }
    if (process.env.NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
    }
    res.status(status).json(body);
}