import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongoDB } from './database/connection.js';
import { Organizacion } from './models/organizacion.model.js';
import { Categoria } from './models/categoria.model.js';
import { Tramite } from './models/tramite.model.js';
import { User } from './models/user.model.js';
import { hashPassword } from './services/auth.service.js';

async function seedDatabase() {
  console.log('[Seed] Iniciando proceso de poblado de base de datos...');
  await connectMongoDB();

  console.log('[Seed] Limpiando colecciones anteriores...');
  await Promise.all([
    Tramite.deleteMany({}),
    Categoria.deleteMany({}),
    Organizacion.deleteMany({}),
    User.deleteMany({})
  ]);

  // 1. Crear Usuario Administrador
  console.log('[Seed] Creando usuario administrador inicial...');
  const hashedPassword = await hashPassword('AdminPaysandu2026!');
  await User.create({
    username: 'admin',
    email: 'admin@paysandu.gub.uy',
    password: hashedPassword,
    rol: 'ADMIN',
    activo: true
  });
  console.log('  -> Usuario creado: admin@paysandu.gub.uy / AdminPaysandu2026!');

  // 2. Crear Organizaciones
  console.log('[Seed] Creando organizaciones y sus sedes...');
  const orgIDP = await Organizacion.create({
    nombre: 'Intendencia Departamental de Paysandú',
    siglas: 'IDP',
    sitioWeb: 'https://www.paysandu.gub.uy',
    descripcion: 'Gobierno departamental responsable de la administración de servicios y obras en todo el departamento de Paysandú.',
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=120&q=80',
    contacto: {
      telefono: '4722 6220',
      email: 'contacto@paysandu.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 07:00 a 17:00'
    },
    sedes: [
      {
        nombreSede: 'Palacio Municipal (Sede Central)',
        direccion: '18 de Julio y Zorrilla de San Martín',
        mapsUrl: 'https://maps.google.com/?q=-32.3175,-58.0792',
        horario: '07:00 a 17:00',
        telefono: '4722 6220'
      },
      {
        nombreSede: 'Dirección de Tránsito y Transporte',
        direccion: 'Zorrilla de San Martín 1234',
        mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805',
        horario: '07:00 a 16:00',
        telefono: '4722 6220 int. 140'
      },
      {
        nombreSede: 'Municipio de Guichón',
        direccion: 'Av. Artigas s/n, Guichón',
        mapsUrl: 'https://maps.google.com/?q=-32.3533,-57.1994',
        horario: '08:00 a 14:00',
        telefono: '4725 2125'
      }
    ]
  });

  const orgDDS = await Organizacion.create({
    nombre: 'Dirección Departamental de Salud de Paysandú (MSP)',
    siglas: 'DDS',
    sitioWeb: 'https://www.gub.uy/ministerio-salud-publica',
    descripcion: 'Autoridad sanitaria departamental reguladora y prestadora de servicios de salud preventiva.',
    contacto: {
      telefono: '4722 2555',
      email: 'ddspaysandu@msp.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 08:00 a 14:00'
    },
    sedes: [
      {
        nombreSede: 'Sede Central DDS',
        direccion: 'Montecaseros 1020',
        mapsUrl: 'https://maps.google.com/?q=-32.3155,-58.0810',
        horario: '08:00 a 14:00',
        telefono: '4722 2555'
      }
    ]
  });

  const orgBPS = await Organizacion.create({
    nombre: 'Banco de Previsión Social (Sucursal Paysandú)',
    siglas: 'BPS',
    sitioWeb: 'https://www.bps.gub.uy',
    descripcion: 'Instituto estatal de previsión y seguridad social en el Uruguay.',
    contacto: {
      telefono: '1997',
      email: 'consultas@bps.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 09:15 a 16:00'
    },
    sedes: [
      {
        nombreSede: 'Sucursal Paysandú',
        direccion: '18 de Julio 1044',
        mapsUrl: 'https://maps.google.com/?q=-32.3168,-58.0775',
        horario: '09:15 a 16:00',
        telefono: '1997'
      }
    ]
  });

  console.log(`  -> ${await Organizacion.countDocuments()} organizaciones creadas.`);

  // 3. Crear Categorías
  console.log('[Seed] Creando categorías...');
  const catTransito = await Categoria.create({
    nombre: 'Tránsito y Transporte',
    slug: 'transito-y-transporte',
    descripcion: 'Licencias de conducir, empadronamientos, multas y ordenamiento vial.',
    icono: 'Car',
    color: '#0284c7',
    orden: 1
  });

  const catSalud = await Categoria.create({
    nombre: 'Salud e Higiene',
    slug: 'salud-e-higiene',
    descripcion: 'Carné de salud, controles bromatológicos, habilitaciones sanitarias y vacunas.',
    icono: 'HeartPulse',
    color: '#e11d48',
    orden: 2
  });

  const catTributos = await Categoria.create({
    nombre: 'Tributos y Finanzas',
    slug: 'tributos-y-finanzas',
    descripcion: 'Contribución inmobiliaria, patente de rodados, convenios de pago y exoneraciones.',
    icono: 'Receipt',
    color: '#16a34a',
    orden: 3
  });

  const catComercio = await Categoria.create({
    nombre: 'Comercio e Industria',
    slug: 'comercio-e-industria',
    descripcion: 'Habilitaciones comerciales, cartelería en vía pública y registro de emprendedores.',
    icono: 'Store',
    color: '#d97706',
    orden: 4
  });

  const catObras = await Categoria.create({
    nombre: 'Obras y Vivienda',
    slug: 'obras-y-vivienda',
    descripcion: 'Permisos de edificación, regularización de planos e inspección de construcciones.',
    icono: 'HardHat',
    color: '#7c3aed',
    orden: 5
  });

  console.log(`  -> ${await Categoria.countDocuments()} categorías creadas.`);

  // 4. Crear Trámites
  console.log('[Seed] Creando trámites...');
  await Tramite.create([
    {
      titulo: 'Renovación de Libreta de Conducir (Categoría A)',
      slug: 'renovacion-libreta-conducir-cat-a',
      descripcion: 'Trámite para renovar la licencia de conducir de automóviles particulares y utilitarios hasta 4.000 kg para conductores radicados en el departamento de Paysandú.',
      organismo: orgIDP._id,
      categoria: catTransito._id,
      activo: true,
      destacado: true,
      modalidad: 'Mixto',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 1.450',
        detalles: 'Abonable previamente en redes de cobranza (Abitab o RedPagos) con Cédula de Identidad.'
      },
      tiempoEstimado: 'En el momento tras superar el examen médico y fotografía',
      dirigidoA: 'Conductores cuya licencia esté vencida o dentro de los 30 días previos a su vencimiento.',
      urlAgenda: 'https://agenda.paysandu.gub.uy/transito',
      lugaresAtencion: [
        {
          nombreLugar: 'Dirección de Tránsito y Transporte',
          direccion: 'Zorrilla de San Martín 1234, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805',
          horario: 'Lunes a Viernes de 07:00 a 16:00'
        }
      ],
      requisitos: [
        { descripcion: 'Cédula de Identidad vigente y en buen estado.', esObligatorio: true, orden: 1 },
        { descripcion: 'Certificado de aptitud psicofísica expedido por institución médica autorizada por la IDP.', esObligatorio: true, orden: 2 },
        { descripcion: 'No poseer multas o sanciones de tránsito impagas en el Sistema Único de Cobro de Ingresos Vehiculares (SUCIVE).', esObligatorio: true, orden: 3 },
        { descripcion: 'Presentar la licencia de conducir anterior (o constancia de denuncia policial en caso de extravío o hurto).', esObligatorio: true, orden: 4 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Cédula de Identidad',
          descripcion: 'Documento original y una fotocopia simple legible.',
          formatoPermitido: 'Original y Fotocopia',
          esObligatorio: true
        },
        {
          nombreDocumento: 'Certificado Médico de Aptitud',
          descripcion: 'Constancia emitida por prestador de salud habilitado no mayor a 30 días de emitida.',
          formatoPermitido: 'Original sellado por médico actuante',
          esObligatorio: true
        },
        {
          nombreDocumento: 'Licencia anterior o Denuncia Policial',
          descripcion: 'El plástico a sustituir o fotocopia de denuncia de la seccional.',
          formatoPermitido: 'Original',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Chequeo Médico',
          descripcionPaso: 'Realizar el examen de aptitud psicofísica en una policlínica o institución médica habilitada de Paysandú.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Agendamiento y Pago',
          descripcionPaso: 'Reservar día y hora en la Agenda Web de la Intendencia y abonar el costo del trámite en Abitab o RedPagos.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Presentación en Dirección de Tránsito',
          descripcionPaso: 'Presentarse en la oficina 10 minutos antes del turno asignado para la toma de fotografía digital, firma y verificación de antecedentes.'
        },
        {
          numeroPaso: 4,
          tituloPaso: 'Retiro del Nuevo Documento',
          descripcionPaso: 'Se entrega el nuevo plástico de la licencia de conducir en el mismo acto.'
        }
      ],
      videos: [
        {
          titulo: 'Paso a paso para agendarte en la web de la Intendencia',
          urlVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      preguntasFrecuentes: [
        {
          pregunta: '¿Puedo renovar si tengo multas de tránsito pendientes?',
          respuesta: 'No. El sistema informático valida que no existan multas pendientes asociadas a tu cédula en el registro nacional antes de emitir la renovación.'
        },
        {
          pregunta: '¿Cuánto tiempo antes del vencimiento puedo hacer el trámite?',
          respuesta: 'Puedes iniciar la renovación hasta 30 días corridos antes de la fecha límite que figura en tu plástico.'
        }
      ],
      palabrasClave: ['libreta', 'conducir', 'licencia', 'auto', 'chofer', 'renovar', 'transito', 'categoria a']
    },
    {
      titulo: 'Solicitud de Primera Libreta de Conducir (Categoría A)',
      slug: 'primera-libreta-conducir-cat-a',
      descripcion: 'Procedimiento completo para aspirantes que deseen obtener por primera vez el permiso de conducir categoría A en Paysandú.',
      organismo: orgIDP._id,
      categoria: catTransito._id,
      activo: true,
      destacado: true,
      modalidad: 'Presencial',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 2.150',
        detalles: 'Incluye derecho a examen teórico y práctico.'
      },
      tiempoEstimado: '1 a 3 semanas (según coordinación de clases de academia y exámenes)',
      dirigidoA: 'Personas mayores de 18 años radicadas en el departamento de Paysandú.',
      urlAgenda: 'https://agenda.paysandu.gub.uy/transito',
      lugaresAtencion: [
        {
          nombreLugar: 'Dirección de Tránsito y Transporte',
          direccion: 'Zorrilla de San Martín 1234, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805',
          horario: 'Lunes a Viernes de 07:00 a 16:00'
        }
      ],
      requisitos: [
        { descripcion: 'Tener 18 años cumplidos al momento de rendir los exámenes.', esObligatorio: true, orden: 1 },
        { descripcion: 'Cédula de Identidad uruguaya vigente.', esObligatorio: true, orden: 2 },
        { descripcion: 'Constancia de domicilio en Paysandú (factura de OSE, UTE o certificado policial).', esObligatorio: true, orden: 3 },
        { descripcion: 'Certificado médico de aptitud psicofísica vigente.', esObligatorio: true, orden: 4 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Cédula de Identidad vigente',
          descripcion: 'Original y 2 fotocopias legibles.',
          formatoPermitido: 'Original y Fotocopia',
          esObligatorio: true
        },
        {
          nombreDocumento: 'Constancia de Domicilio',
          descripcion: 'Recibo reciente a nombre del interesado o certificado notarial/policial.',
          formatoPermitido: 'Original',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Inscripción y Apertura de Carpeta',
          descripcionPaso: 'Concurrir a la Dirección de Tránsito con la documentación requerida y abonar los derechos de examen.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Examen Teórico',
          descripcionPaso: 'Rendir la prueba teórica interactiva sobre normas nacionales de tránsito y señalización vial.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Examen Práctico de Conducción',
          descripcionPaso: 'Demostrar destreza de maniobra en pista cerrada y circulación guiada por inspectores de tránsito.'
        },
        {
          numeroPaso: 4,
          tituloPaso: 'Emisión de Libreta',
          descripcionPaso: 'Aprobados ambos exámenes, se toma la foto digital y se emite la licencia habilitante.'
        }
      ],
      palabrasClave: ['primera libreta', 'aprender a manejar', 'licencia nueva', 'examen teorico', 'examen practico', 'transito']
    },
    {
      titulo: 'Carné de Salud Laboral',
      slug: 'carne-de-salud-laboral',
      descripcion: 'Emisión del carné de aptitud física obligatorio para el desempeño de cualquier actividad laboral y profesional en el territorio nacional.',
      organismo: orgDDS._id,
      categoria: catSalud._id,
      activo: true,
      destacado: true,
      modalidad: 'Presencial',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 890',
        detalles: 'Se abona en caja de la institución. Estudiantes acreditados pueden solicitar tarifa bonificada.'
      },
      tiempoEstimado: '24 a 48 horas hábiles',
      dirigidoA: 'Trabajadores en relación de dependencia, independientes y estudiantes en pasantías formativas.',
      lugaresAtencion: [
        {
          nombreLugar: 'Dirección Departamental de Salud (MSP)',
          direccion: 'Montecaseros 1020, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3155,-58.0810',
          horario: 'Lunes a Viernes de 08:00 a 14:00'
        }
      ],
      requisitos: [
        { descripcion: 'Cédula de Identidad uruguaya vigente.', esObligatorio: true, orden: 1 },
        { descripcion: 'Ayuno de al menos 8 horas para extracción de muestra sanguínea y orina.', esObligatorio: true, orden: 2 },
        { descripcion: 'Certificado de Vacunación antitetánica vigente.', esObligatorio: true, orden: 3 },
        { descripcion: 'Papanicolaou al día (mujeres de 21 a 65 años) y Mamografía (mujeres de 50 a 69 años).', esObligatorio: false, orden: 4 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Cédula de Identidad',
          descripcion: 'Original en buen estado.',
          formatoPermitido: 'Original',
          esObligatorio: true
        },
        {
          nombreDocumento: 'Carné de Vacunas',
          descripcion: 'Comprobante emitido por vacunatorio acreditado.',
          formatoPermitido: 'Original',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Extracción y Toma de Muestras',
          descripcionPaso: 'Presentarse en ayunas a primera hora (08:00 a 09:30) en el laboratorio clínico.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Examen Clínico y Odontológico',
          descripcionPaso: 'Evaluación de agudeza visual, presión arterial, auscultación general e inspección dental.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Entrega del Carné',
          descripcionPaso: 'Retiro del carné plastificado con constancia de aptitud y vigencia otorgada.'
        }
      ],
      preguntasFrecuentes: [
        {
          pregunta: '¿Cuál es la vigencia habitual del carné de salud?',
          respuesta: 'La vigencia regular es de 2 años. Si los valores analíticos presentan anomalías menores, el médico puede extenderlo de forma provisoria por 6 o 12 meses.'
        }
      ],
      palabrasClave: ['carne de salud', 'salud', 'medico', 'laboral', 'trabajo', 'analisis', 'vacunas']
    },
    {
      titulo: 'Convenio de Pago de Contribución Inmobiliaria',
      slug: 'convenio-contribucion-inmobiliaria',
      descripcion: 'Acuerdo de facilidades de pago en cuotas para cancelar adeudos acumulados del tributo de Contribución Inmobiliaria urbana o rural.',
      organismo: orgIDP._id,
      categoria: catTributos._id,
      activo: true,
      destacado: false,
      modalidad: 'Mixto',
      costo: {
        tipo: 'Gratuito',
        monto: '$ 0',
        detalles: 'La gestión del convenio es gratuita. Se liquida la cuota inicial acordada.'
      },
      tiempoEstimado: 'Inmediato en ventanilla o 24 horas por vía digital',
      dirigidoA: 'Propietarios, promitentes compradores o apoderados de inmuebles en Paysandú.',
      urlTramiteOnline: 'https://servicios.paysandu.gub.uy/tributos/convenios',
      lugaresAtencion: [
        {
          nombreLugar: 'Palacio Municipal - Sección Recaudación',
          direccion: '18 de Julio y Zorrilla de San Martín, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3175,-58.0792',
          horario: 'Lunes a Viernes de 07:00 a 17:00'
        }
      ],
      requisitos: [
        { descripcion: 'Número de Padrón y Localidad Catastral del inmueble.', esObligatorio: true, orden: 1 },
        { descripcion: 'Cédula de Identidad del solicitante titular o poder notarial habilitante.', esObligatorio: true, orden: 2 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Documento de Identidad del Titular',
          descripcion: 'Cédula original o poder legalizado en caso de actuar por terceros.',
          formatoPermitido: 'Original o Copia Notarial',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Consulta de Estado de Cuenta',
          descripcionPaso: 'Obtener la liquidación actualizada de la deuda en la web o ventanilla de recaudación.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Plan de Financiación',
          descripcionPaso: 'Elegir la modalidad de pago (hasta 36 cuotas fijas o en Unidades Indexadas).'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Firma y Primera Cuota',
          descripcionPaso: 'Firmar el convenio y abonar la entrega inicial en redes de cobranza.'
        }
      ],
      palabrasClave: ['contribucion', 'inmobiliaria', 'impuesto', 'deuda', 'padron', 'convenio', 'cuotas', 'tributo']
    },
    {
      titulo: 'Habilitación Comercial de Locales',
      slug: 'habilitacion-comercial-locales',
      descripcion: 'Autorización municipal obligatoria para la apertura y funcionamiento de establecimientos comerciales, de servicios o industriales en el departamento.',
      organismo: orgIDP._id,
      categoria: catComercio._id,
      activo: true,
      destacado: false,
      modalidad: 'Presencial',
      costo: {
        tipo: 'Variable',
        monto: 'Calculado según metraje cuadrado y rubro',
        detalles: 'Se liquida conforme a la ordenanza tarifaria departamental vigente.'
      },
      tiempoEstimado: '15 a 30 días hábiles (incluye inspección técnica municipal)',
      dirigidoA: 'Emprendedores, comerciantes y empresas que proyecten abrir un local al público.',
      lugaresAtencion: [
        {
          nombreLugar: 'Dirección de Higiene y Bromatología',
          direccion: 'Palacio Municipal, 18 de Julio y Zorrilla',
          mapsUrl: 'https://maps.google.com/?q=-32.3175,-58.0792',
          horario: 'Lunes a Viernes de 07:00 a 15:00'
        }
      ],
      requisitos: [
        { descripcion: 'Constancia de inscripción vigente en DGI (RUT) y Banco de Previsión Social (BPS).', esObligatorio: true, orden: 1 },
        { descripcion: 'Certificación o inicio de trámite de habilitación ante la Dirección Nacional de Bomberos.', esObligatorio: true, orden: 2 },
        { descripcion: 'Croquis o plano de las instalaciones firmado por arquitecto o técnico habilitado.', esObligatorio: true, orden: 3 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Formulario de Solicitud de Habilitación Comercial',
          descripcion: 'Completado con datos del titular y actividad comercial a desarrollar.',
          formatoPermitido: 'Formulario oficial IDP',
          esObligatorio: true,
          urlPlantilla: 'https://servicios.paysandu.gub.uy/descargas/formulario-habilitacion-comercial.pdf'
        },
        {
          nombreDocumento: 'Constancia de RUT (DGI)',
          descripcion: 'Ficha registral activa.',
          formatoPermitido: 'Copia digital o impresa',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Ingreso del Expediente',
          descripcionPaso: 'Presentar la carpeta completa con formularios y planos en Mesa de Entrada del Palacio Municipal.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Inspección Ocular y Bromatológica',
          descripcionPaso: 'Inspectores municipales coordinan visita al local para constatar condiciones edilicias, sanitarias y de seguridad.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Aprobación y Certificado',
          descripcionPaso: 'Aprobada la inspección, se retira el certificado habilitante y la oblea identificatoria para exhibir en el local.'
        }
      ],
      palabrasClave: ['habilitacion', 'comercial', 'local', 'negocio', 'empresa', 'comercio', 'apertura', 'bomberos', 'bromatologia']
    }
  ]);

  console.log(`  -> ${await Tramite.countDocuments()} trámites creados.`);

  console.log('\n[Seed] Base de datos poblada exitosamente.');
  await mongoose.disconnect();
  console.log('[Seed] Conexión cerrada.');
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('[Seed] Error al poblar la base de datos:', error);
  process.exit(1);
});
