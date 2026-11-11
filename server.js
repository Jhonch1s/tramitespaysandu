import 'dotenv/config';
import app from './app.js';
import { connectMongoDB } from './database/connection.js';

const PORT = process.env.PORT || 3000;

try {
  if (process.env.NODE_ENV === 'production' && (!process.env.MONGO_URI || !process.env.FRONTEND_ORIGIN || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    throw new Error('En producción se requieren MONGO_URI, FRONTEND_ORIGIN y JWT_SECRET de al menos 32 caracteres.');
  }
  if (!process.env.JWT_SECRET) {
    console.warn('[Advertencia] JWT_SECRET no está definido en .env, usando valor por defecto');
  }

  // Intentar conectar a MongoDB (Atlas o local)
  const connected = await connectMongoDB();
  if (!connected && process.env.NODE_ENV === 'production') throw new Error('MongoDB no está disponible.');

  const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0');
  app.listen(PORT, host, () => {
    console.log(`[Servidor] Escuchando en http://localhost:${PORT}`);
    console.log(`[Servidor] Modo: ${process.env.NODE_ENV || 'development'}`);
  });
} catch (error) {
  console.error('[Servidor] Error no recuperable al iniciar:', error.message);
  process.exit(1);
}
