import mongoose from 'mongoose';
import dns from 'node:dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignorar si el sistema no permite cambiar servidores DNS
}

let isConnected = false;

export function getIsDatabaseConnected() {
  return isConnected;
}

export async function connectMongoDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tramites_paysandu';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] Conectado exitosamente a MongoDB: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Advertencia al conectar con MongoDB: ${error.message}`);
    if (uri.includes('mongodb.net')) {
      console.warn('[Database] Tu cluster de MongoDB Atlas parece estar pausado por inactividad.');
      console.warn('[Database] Para reactivarlo, ingresá a https://cloud.mongodb.com y pulsá "Resume".');
    }
    console.log('[Database] El servidor continuará operando para responder consultas y mantener el servicio activo.');
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[Database] Desconectado de MongoDB');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('[Database] Error en la conexión de MongoDB:', err.message);
});
