# Trámites Paysandú — Backend API REST

API REST para el portal ciudadano de trámites de Paysandú, construida con **Node.js (ES Modules)**, **Express 5**, **MongoDB (Mongoose ODM)** y **JWT**.

---

## 🚀 Arquitectura y Tecnologías

- **Entorno de ejecución**: Node.js >= 18 (`"type": "module"`)
- **Framework Web**: Express 5
- **Base de Datos**: MongoDB con Mongoose 9
- **Seguridad y Criptografía**: `node:crypto` (`scrypt`) para contraseñas + `jsonwebtoken` para tokens Bearer
- **CORS y Configuración**: `cors`, `dotenv`

### Estructura del Proyecto
```text
TramitesPaysandu/
├── controllers/          # Controladores HTTP (req, res)
│   ├── auth.controller.js
│   ├── categoria.controller.js
│   ├── organizacion.controller.js
│   └── tramite.controller.js
├── database/             # Conexión a MongoDB
│   └── connection.js
├── middleware/           # Middlewares de seguridad
│   └── authenticate.js
├── models/               # Modelos Mongoose (subdocumentos embebidos e índices de texto)
│   ├── categoria.model.js
│   ├── organizacion.model.js
│   ├── tramite.model.js
│   └── user.model.js
├── routes/               # Enrutadores Express montados en /api
│   ├── auth.route.js
│   ├── categoria.route.js
│   ├── organizacion.route.js
│   └── tramite.route.js
├── services/             # Lógica de negocio y consultas de datos
│   ├── auth.service.js
│   ├── categoria.service.js
│   ├── organizacion.service.js
│   └── tramite.service.js
├── .env.example          # Plantilla de variables de entorno
├── app.js                # Instancia y middlewares de Express
├── seed.js               # Script para poblar la base con datos reales de Paysandú
└── server.js             # Punto de entrada HTTP
```

---

## 🛠️ Instalación y Uso

### 1. Variables de Entorno
Copia o ajusta el archivo `.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tramites_paysandu
JWT_SECRET=tu_clave_secreta_jwt_tramites_paysandu_2026
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:5173
```

### 2. Poblar la Base de Datos (Seed)
Asegúrate de tener MongoDB corriendo (localmente o en MongoDB Atlas) y ejecuta:
```bash
npm run seed
```
Este script crea:
- Un usuario administrador (`admin@paysandu.gub.uy` / `AdminPaysandu2026!`).
- Las instituciones: Intendencia Departamental de Paysandú (IDP), BPS y Dirección Departamental de Salud (DDS) con sus sedes y links a Google Maps.
- Las categorías temáticas (Tránsito, Salud, Tributos, Comercio, Obras).
- Fichas completas de trámites con requisitos, documentos, pasos y preguntas frecuentes.

### 3. Iniciar el Servidor
```bash
npm run dev
# o para producción:
npm start
```

---

## 📡 Endpoints de la API

### Públicos (Para Ciudadanos y Frontend)

#### Diagnóstico
- `GET /api/health`: Estado de salud de la API.
- `GET /`: Directorio de endpoints disponibles.

#### Categorías
- `GET /api/categorias`: Listado ordenado de categorías activas con total de trámites asociados.
- `GET /api/categorias/:slug`: Detalle de una categoría por su slug (ej: `transito-y-transporte`).

#### Organizaciones
- `GET /api/organizaciones`: Lista de organismos con sedes y enlaces a Google Maps.
- `GET /api/organizaciones/:id`: Detalle de un organismo por ID.

#### Trámites
- `GET /api/tramites`: Listado paginado y filtrable (`?categoria=...&organismo=...&modalidad=...&costoTipo=...&page=1&limit=20`).
- `GET /api/tramites/destacados`: Lista de trámites más consultados para la portada.
- `GET /api/tramites/buscar?q=licencia`: Búsqueda de texto completo y difusa sobre título, descripción y palabras clave.
- `GET /api/tramites/:slug`: Ficha exhaustiva del trámite (requisitos, documentos, pasos, mapas, preguntas frecuentes).

---

### Protegidos (Para Panel de Administración - Requieren `Bearer <token>`)

#### Autenticación
- `POST /api/auth/login`: Iniciar sesión (`{ email, password }`).
- `POST /api/auth/registro`: Registrar nuevo usuario administrador.
- `GET /api/auth/perfil`: Datos del usuario autenticado actual.

#### Gestión de Contenido
- `POST /api/tramites`: Crear nuevo trámite.
- `PUT /api/tramites/:id`: Modificar trámite existente.
- `DELETE /api/tramites/:id`: Desactivación lógica de trámite.
- `POST /api/categorias`, `PUT /api/categorias/:id`, `DELETE /api/categorias/:id`
- `POST /api/organizaciones`, `PUT /api/organizaciones/:id`, `DELETE /api/organizaciones/:id`
