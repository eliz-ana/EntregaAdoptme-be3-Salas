// src/server.js
import app from './app.js';
import { connectDB } from './config/dbConfig.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDB(env.MONGO_URI);
  const server = app.listen(env.PORT, () => {
    console.log(`[server] listening on ${env.PORT}`);
  });

  // apagado “limpio”
  const shutdown = () => {
    console.log('[server] shutting down...');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return server;
}

// Arranca siempre, salvo en tests automatizados
if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch(err => {
    console.error('[server] fatal error:', err);
    process.exit(1);
  });
}


export default bootstrap;
