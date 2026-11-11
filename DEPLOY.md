# Despliegue de Trámites Paysandú

## Frontend (Cloudflare Pages)

- Repositorio: `fronttramitespaysandu`.
- Comando de compilación: `npm run build`.
- Carpeta de salida: `dist`.
- Variable de compilación: `VITE_API_URL=https://DOMINIO-DE-LA-API/api/`.
- Configurar el dominio del frontend en Cloudflare Pages. `public/_redirects` permite abrir rutas como `/asistente` directamente.

## Backend (servidor propio)

- Repositorio: `tramitespaysandu`; instalar dependencias con `npm ci` y ejecutar `npm start` con un administrador de servicios adecuado al sistema operativo.
- Configurar `NODE_ENV=production`, `PORT`, `MONGO_URI`, `JWT_SECRET` (aleatorio, al menos 32 caracteres), `JWT_EXPIRES_IN` y `FRONTEND_ORIGIN` (origen HTTPS exacto del frontend, sin barra final). Guardar los secretos solamente en el servidor, fuera del repositorio.
- Publicar la API mediante HTTPS hacia el puerto local configurado y probar `/api/health`. La base debe estar conectada para recibir respuestas en producción.
- No ejecutar el seed de prueba en producción: borra datos y crea cuentas con contraseñas públicas. Preparar la carga de datos y el administrador de producción por separado.

## Verificación

Comprobar la carga de la página y de una URL interna directamente, CORS entre frontend y backend, registro e inicio de sesión, acceso de ciudadano denegado a edición, disponibilidad y persistencia de los datos, y restauración tras reiniciar el servidor.
