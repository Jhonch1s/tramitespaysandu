import express from 'express';
import cors from 'cors';
import { getIsDatabaseConnected } from './database/connection.js';

import authRoutes from './routes/auth.route.js';
import categoriaRoutes from './routes/categoria.route.js';
import organizacionRoutes from './routes/organizacion.route.js';
import tramiteRoutes from './routes/tramite.route.js';
import progresoRoutes from './routes/progreso.route.js';

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Cabeceras de seguridad HTTP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors({
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));

// En producción nunca responder con datos de demostración si falla MongoDB.
app.use('/api', (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !getIsDatabaseConnected()) {
    return res.status(503).json({ success: false, message: 'Base de datos temporalmente no disponible' });
  }
  next();
});
// Montaje de rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/organizaciones', organizacionRoutes);
app.use('/api/tramites', tramiteRoutes);
app.use('/api/progreso', progresoRoutes);

// Endpoint de diagnóstico
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de Trámites Paysandú en funcionamiento',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Trámites Paysandú API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tramites: '/api/tramites',
      buscarTramites: '/api/tramites/buscar?q={termino}',
      destacados: '/api/tramites/destacados',
      categorias: '/api/categorias',
      organizaciones: '/api/organizaciones',
      auth: '/api/auth',
      progreso: '/api/progreso'
    }
  });
});

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejo global de errores (500)
app.use((err, req, res, next) => {
  console.error('[Error interno]:', err?.message || err);
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno en el servidor'
  });
});

export default app;
