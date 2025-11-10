// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import { notFound,errorHandler } from './middlewares/errorHandler.js';
import { requestId } from './middlewares/requestId.js';  
import { httpLogger } from './middlewares/requestLogger.js';


import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();

app.use(express.json());
app.use(requestId);
app.use(httpLogger);
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.get('/health', (req, res) => res.json({ ok: true , message: 'Server is healthy' , timestamp: new Date().toISOString() }));

app.use(notFound);
app.use(errorHandler);

export default app;
