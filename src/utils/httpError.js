export class HTTPError extends Error {
    constructor(status=500, message='Unexpected Error') {
        super(message);
        this.status = status;
        this.name = 'HTTPError';
    }
}

export const err={
    badRequest: (msg='Bad Request') => new HTTPError(400, msg),
    unauthorized: (msg='Unauthorized') => new HTTPError(401, msg),
    forbidden: (msg='Forbidden') => new HTTPError(403, msg),
    notFound: (msg='Not Found') => new HTTPError(404, msg),
    conflict: (msg='Conflict') => new HTTPError(409, msg),
    server: (msg='Server error') => new HTTPError(500, msg),
}