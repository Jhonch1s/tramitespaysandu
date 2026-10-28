import mongoose from 'mongoose';
import dns from 'node:dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('No se pudieron configurar los servidores DNS');
}

export async function connectMongoDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tramites_paysandu';

  try {
    await mongoose.connect(uri);
    console.log(`[Database] Conectado exitosamente a MongoDB: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('[Database] Error al conectar a MongoDB:', error.message);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Desconectado de MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] Error en la conexión de MongoDB:', err);
});
