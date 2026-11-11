# Guía y Especificación del Seeder - Trámites Paysandú Joven

Este seeder agrega datos institucionales orientados al segmento joven (18 a 25 años). Conserva los registros existentes y no crea ni modifica usuarios. Ejecutá `node seed.js --dry-run` para simular la carga.

---

## 🚀 Ejecución del Seeder

Asegúrate de tener MongoDB iniciado en tu entorno local (o configurar la variable `MONGO_URI` en tu archivo `.env`).

```bash
# Desde la carpeta del backend (/d/Proyectos/tramitespaysandu)
npm run seed
# o directamente:
node seed.js
```

---

## 🏛️ Entidades Pobladas en MongoDB

### 1. Usuarios
El seed no crea ni modifica cuentas de usuario.

### 2. Organizaciones e Instituciones
1. **Intendencia Departamental de Paysandú (IDP)**
   - Sede Central: 18 de Julio y Zorrilla de San Martín
   - Dirección de Tránsito y Transporte: Zorrilla 1234
   - Espacio Paysandú Joven: Dr. Leandro Gómez 1032
2. **Dirección Nacional de Identificación Civil (DNIC)**
   - Oficina Paysandú: Montecaseros 1145 entre Sarandí y Florida
3. **Dirección Departamental de Salud de Paysandú (MSP)**
   - Sede Central / Policlínica Municipal: Montecaseros 1020
4. **Banco de Previsión Social (BPS)**
   - Sucursal Paysandú: 18 de Julio 1044
5. **Fondo de Solidaridad / Bienestar Estudiantil**
   - CENUR Litoral Norte Sede Paysandú (UDELAR): Florida 1065
6. **Instituto Nacional de la Juventud (INJU - MIDES)**
   - Centro Territorial: Leandro Gómez y Montevideo

### 3. Categorías
- **Vida ciudadana** (`slug: vida-ciudadana`) - Color `#0D47A1`
- **Salud** (`slug: salud`) - Color `#00897B`
- **Trabajo** (`slug: trabajo`) - Color `#D97706`
- **Educación y Becas** (`slug: educacion-y-becas`) - Color `#2563EB`
- **Tránsito y Transporte** (`slug: transito-y-transporte`) - Color `#0284c7`

### 4. Trámites Juveniles Incluidos
1. **Cédula de Identidad (Primera vez y Renovación)** (`slug: cedula-de-identidad`)
   - Modalidad: Mixto
   - Costo: $ 450 común / $ 900 urgente
   - Agenda Web: `https://dnic.minterior.gub.uy/agenda`
2. **Carné de Salud Laboral y Estudiantil** (`slug: carne-de-salud`)
   - Modalidad: Presencial (Policlínica Municipal / DDS)
   - Costo: $ 450 (Bonificado o gratuito con constancia de estudio)
   - Agenda Web: `https://agenda.paysandu.gub.uy/salud`
3. **Inscripción Laboral y Alta en BPS (Primer Trabajo)** (`slug: inscripcion-laboral-bps`)
   - Modalidad: En Línea
   - Costo: Gratuito
   - Tramitación online: `https://servicios.bps.gub.uy`
4. **Beca Estudiantil Terciaria (Fondo de Solidaridad)** (`slug: beca-estudiantil-terciaria`)
   - Modalidad: En Línea
   - Costo: Gratuito
   - Cobertura: UDELAR (CENUR Paysandú), UTEC y UTU
5. **Boleto Estudiantil Gratuito / Abono Joven Paysandú** (`slug: boleto-estudiantil`)
   - Modalidad: Presencial (Dirección de Tránsito IDP)
   - Costo: Gratuito (Hasta 50 pasajes mensuales)
6. **Tarjeta Joven Paysandú (Beneficios y Descuentos INJU)** (`slug: tarjeta-joven-paysandu`)
   - Modalidad: En Línea (App Tarjeta Joven)
   - Costo: Gratuito
7. **Solicitud de Primera Libreta de Conducir (Categoría A)** (`slug: primera-libreta-conducir-cat-a`)
   - Modalidad: Presencial
   - Costo: $ 2.150
8. **Renovación de Libreta de Conducir (Categoría A)** (`slug: renovacion-libreta-conducir-cat-a`)
   - Modalidad: Mixto
   - Costo: $ 1.450
