import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import categoriaRoutes from './routes/categoria.route.js';
import organizacionRoutes from './routes/organizacion.route.js';
import tramiteRoutes from './routes/tramite.route.js';

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());

// Montaje de rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/organizaciones', organizacionRoutes);
app.use('/api/tramites', tramiteRoutes);

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
      auth: '/api/auth'
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
  console.error('[Error no controlado]:', err);
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
