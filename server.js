import 'dotenv/config';
import app from './app.js';
import { connectMongoDB } from './database/connection.js';

const PORT = process.env.PORT || 3000;

try {
  if (!process.env.JWT_SECRET) {
    console.warn('[Advertencia] JWT_SECRET no está definido en .env, usando valor por defecto para desarrollo');
  }

  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`[Servidor] Escuchando en http://localhost:${PORT}`);
    console.log(`[Servidor] Modo: ${process.env.NODE_ENV || 'development'}`);
  });
} catch (error) {
  console.error('[Servidor] Error crítico al iniciar:', error);
  process.exit(1);
}
