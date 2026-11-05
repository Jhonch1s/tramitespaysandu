import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectMongoDB } from './database/connection.js';
import { Organizacion } from './models/organizacion.model.js';
import { Categoria } from './models/categoria.model.js';
import { Tramite } from './models/tramite.model.js';
import { User } from './models/user.model.js';
import { hashPassword } from './services/auth.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedDatabase() {
  console.log('[Seed] Iniciando poblado de base de datos para Trámites Paysandú...');
  await connectMongoDB();

  console.log('[Seed] Limpiando colecciones anteriores...');
  await Promise.all([
    Tramite.deleteMany({}),
    Categoria.deleteMany({}),
    Organizacion.deleteMany({}),
    User.deleteMany({})
  ]);

  // 1. Crear Usuarios de prueba (Admin y Joven Ciudadano)
  console.log('[Seed] Creando usuarios de acceso...');
  const passAdmin = await hashPassword('AdminPaysandu2026!');
  const passJoven = await hashPassword('JovenPaysandu2026!');

  await User.create([
    {
      username: 'admin',
      email: 'admin@paysandu.gub.uy',
      password: passAdmin,
      rol: 'ADMIN',
      activo: true
    },
    {
      username: 'joven_sanducero',
      email: 'joven@paysandu.gub.uy',
      password: passJoven,
      rol: 'CIUDADANO',
      activo: true
    }
  ]);
  console.log('  -> Usuario Administrador: admin@paysandu.gub.uy / AdminPaysandu2026!');
  console.log('  -> Usuario Ciudadano:     joven@paysandu.gub.uy / JovenPaysandu2026!');

  // 2. Crear Organizaciones principales
  console.log('[Seed] Creando organizaciones e instituciones...');
  const orgIDP = await Organizacion.create({
    nombre: 'Intendencia Departamental de Paysandú',
    siglas: 'IDP',
    sitioWeb: 'https://www.paysandu.gub.uy',
    descripcion: 'Gobierno departamental responsable de la administración de servicios públicos, tránsito, cultura y juventud en Paysandú.',
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=120&q=80',
    contacto: {
      telefono: '4722 6220',
      email: 'contacto@paysandu.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 07:00 a 17:00'
    },
    sedes: [
      {
        nombreSede: 'Palacio Municipal (Sede Central)',
        direccion: '18 de Julio y Zorrilla de San Martín, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3175,-58.0792',
        horario: '07:00 a 17:00',
        telefono: '4722 6220'
      },
      {
        nombreSede: 'Dirección de Tránsito y Transporte',
        direccion: 'Zorrilla de San Martín 1234, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805',
        horario: '07:00 a 16:00',
        telefono: '4722 6220 int. 140'
      },
      {
        nombreSede: 'Espacio Paysandú Joven (Dirección de Juventud)',
        direccion: 'Dr. Leandro Gómez 1032, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3160,-58.0780',
        horario: '08:00 a 18:00',
        telefono: '4722 6220 int. 185'
      }
    ]
  });

  const orgDNIC = await Organizacion.create({
    nombre: 'Dirección Nacional de Identificación Civil (DNIC)',
    siglas: 'DNIC',
    sitioWeb: 'https://dnic.minterior.gub.uy',
    descripcion: 'Organismo del Ministerio del Interior responsable de la expedición y control de la Cédula de Identidad y Pasaportes.',
    contacto: {
      telefono: '2030 3740',
      email: 'consultas@dnic.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 08:00 a 15:00'
    },
    sedes: [
      {
        nombreSede: 'Oficina DNIC Paysandú',
        direccion: 'Montecaseros 1145 entre Sarandí y Florida, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3162,-58.0818',
        horario: '08:00 a 15:00',
        telefono: '2030 3740'
      }
    ]
  });

  const orgDDS = await Organizacion.create({
    nombre: 'Dirección Departamental de Salud de Paysandú (MSP)',
    siglas: 'DDS',
    sitioWeb: 'https://www.gub.uy/ministerio-salud-publica',
    descripcion: 'Autoridad sanitaria departamental reguladora y prestadora de servicios de salud preventiva y carné de salud.',
    contacto: {
      telefono: '4722 2555',
      email: 'ddspaysandu@msp.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 07:30 a 14:00'
    },
    sedes: [
      {
        nombreSede: 'Sede Central DDS / Policlínica Municipal',
        direccion: 'Montecaseros 1020, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3155,-58.0810',
        horario: '07:30 a 14:00',
        telefono: '4722 2555'
      }
    ]
  });

  const orgBPS = await Organizacion.create({
    nombre: 'Banco de Previsión Social (Sucursal Paysandú)',
    siglas: 'BPS',
    sitioWeb: 'https://www.bps.gub.uy',
    descripcion: 'Instituto estatal de seguridad social en el Uruguay encargado del registro laboral, Fonasa y asignaciones familiares.',
    contacto: {
      telefono: '1997',
      email: 'consultas@bps.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 09:15 a 16:00'
    },
    sedes: [
      {
        nombreSede: 'Sucursal Paysandú BPS',
        direccion: '18 de Julio 1044, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3168,-58.0775',
        horario: '09:15 a 16:00',
        telefono: '1997'
      }
    ]
  });

  const orgFondo = await Organizacion.create({
    nombre: 'Fondo de Solidaridad / Bienestar Estudiantil',
    siglas: 'Fondo Solidaridad',
    sitioWeb: 'https://becas.fondodesolidaridad.edu.uy',
    descripcion: 'Institución orientada a promover la equidad y permanencia de jóvenes terciarios y universitarios de todo el país.',
    contacto: {
      telefono: '2900 4030',
      email: 'becas@fondodesolidaridad.edu.uy',
      horarioGeneral: 'Lunes a Viernes de 09:00 a 17:00'
    },
    sedes: [
      {
        nombreSede: 'CENUR Litoral Norte - Sede Paysandú (UDELAR)',
        direccion: 'Florida 1065, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3150,-58.0825',
        horario: '08:00 a 20:00',
        telefono: '4722 0221'
      }
    ]
  });

  const orgINJU = await Organizacion.create({
    nombre: 'Instituto Nacional de la Juventud (INJU - MIDES Paysandú)',
    siglas: 'INJU',
    sitioWeb: 'https://www.gub.uy/inju',
    descripcion: 'Promotor de políticas públicas, tarjeta joven, voluntariado y oportunidades formativas para jóvenes.',
    contacto: {
      telefono: '0800 4658',
      email: 'paysandu@inju.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 09:00 a 16:00'
    },
    sedes: [
      {
        nombreSede: 'Oficina Territorial MIDES / INJU Paysandú',
        direccion: 'Leandro Gómez y Montevideo, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3164,-58.0790',
        horario: '09:00 a 15:30',
        telefono: '4722 4110'
      }
    ]
  });

  const orgDGI = await Organizacion.create({
    nombre: 'Dirección General Impositiva (DGI Paysandú)',
    siglas: 'DGI',
    sitioWeb: 'https://www.dgi.gub.uy',
    descripcion: 'Administración tributaria del Estado para inscripción de RUT, unipersonales y certificados.',
    contacto: {
      telefono: '1344',
      email: 'consultas@dgi.gub.uy',
      horarioGeneral: 'Lunes a Viernes de 09:30 a 16:00'
    },
    sedes: [
      {
        nombreSede: 'Oficina DGI Paysandú',
        direccion: '18 de Julio 1120, Paysandú',
        mapsUrl: 'https://maps.google.com/?q=-32.3170,-58.0785',
        horario: '09:30 a 16:00',
        telefono: '4722 4000'
      }
    ]
  });

  // 3. Crear Categorías
  console.log('[Seed] Creando categorías ciudadanas...');
  const catVidaCiudadana = await Categoria.create({
    nombre: 'Vida ciudadana',
    slug: 'vida-ciudadana',
    descripcion: 'Cédula de identidad, boleto estudiantil, credencial cívica y trámites de identidad.',
    icono: 'ShieldCheck',
    color: '#0D47A1',
    orden: 1
  });

  const catSalud = await Categoria.create({
    nombre: 'Salud',
    slug: 'salud',
    descripcion: 'Carné de salud básico y laboral, policlínicas barriales, vacunatorios y chequeos.',
    icono: 'HeartPulse',
    color: '#00897B',
    orden: 2
  });

  const catTrabajo = await Categoria.create({
    nombre: 'Trabajo',
    slug: 'trabajo',
    descripcion: 'Inscripción en BPS, primer empleo, registro de emprendedores jóvenes y orientación laboral.',
    icono: 'Briefcase',
    color: '#D97706',
    orden: 3
  });

  const catEducacion = await Categoria.create({
    nombre: 'Educación y Becas',
    slug: 'educacion-y-becas',
    descripcion: 'Becas económicas del Fondo de Solidaridad, pasantías, becas Butiá y apoyos de estudio.',
    icono: 'GraduationCap',
    color: '#2563EB',
    orden: 4
  });

  const catTransito = await Categoria.create({
    nombre: 'Tránsito y Transporte',
    slug: 'transito-y-transporte',
    descripcion: 'Primera libreta de conducir para jóvenes, motos, automóviles y seguridad vial.',
    icono: 'Car',
    color: '#0284c7',
    orden: 5
  });

  const catTributos = await Categoria.create({
    nombre: 'Tributos y Finanzas',
    slug: 'tributos-y-finanzas',
    descripcion: 'Contribución inmobiliaria, patente de rodados y convenios de pago.',
    icono: 'Receipt',
    color: '#16a34a',
    orden: 6
  });

  // 4. Trámites Juveniles Destacados de Paysandú
  console.log('[Seed] Creando trámites prioritarios para jóvenes...');
  const tramitesBase = [
    {
      titulo: 'Cédula de Identidad (Primera vez y Renovación)',
      slug: 'cedula-de-identidad',
      descripcion: 'Obtención y renovación obligatoria del documento de identidad uruguayo en la oficina departamental de Identificación Civil de Paysandú.',
      organismo: orgDNIC._id,
      categoria: catVidaCiudadana._id,
      activo: true,
      destacado: true,
      modalidad: 'Mixto',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 450 (Común) / $ 900 (Urgente)',
        detalles: 'La primera cédula para menores de edad es gratuita. Las renovaciones se abonan en Abitab, RedPagos o web oficial.'
      },
      tiempoEstimado: '15 minutos de atención presencial',
      dirigidoA: 'Ciudadanos uruguayos y residentes legales a partir de los 18 años.',
      urlAgenda: 'https://dnic.minterior.gub.uy/agenda',
      urlTramiteOnline: 'https://www.gub.uy/tramites/cedula-identidad',
      lugaresAtencion: [
        {
          nombreLugar: 'Oficina DNIC Paysandú',
          direccion: 'Montecaseros 1145 entre Sarandí y Florida, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3162,-58.0818',
          horario: 'Lunes a Viernes de 08:00 a 15:00'
        }
      ],
      requisitos: [
        { descripcion: 'Haber reservado cita previa en la Agenda Web oficial o en red de cobranza.', esObligatorio: true, orden: 1 },
        { descripcion: 'Cédula de Identidad anterior (en caso de renovación).', esObligatorio: true, orden: 2 },
        { descripcion: 'En caso de primera vez: Partida de Nacimiento expedida por Registro Civil.', esObligatorio: false, orden: 3 },
        { descripcion: 'En caso de hurto o extravío: constancia de denuncia policial.', esObligatorio: false, orden: 4 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Cédula vencida o deteriorada',
          descripcion: 'Documento físico original a renovar.',
          formatoPermitido: 'Original',
          esObligatorio: true
        },
        {
          nombreDocumento: 'Comprobante de turno y pago',
          descripcion: 'Ticket de Abitab/RedPagos o confirmación digital.',
          formatoPermitido: 'Digital o Impreso',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Agendate en línea',
          descripcionPaso: 'Ingresá al portal oficial de la DNIC o acércate a cualquier red de cobranza para reservar turno.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Aboná el arancel correspondiente',
          descripcionPaso: 'Aboná en Abitab o RedPagos antes de la fecha elegida.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Presentate en la oficina de Montecaseros',
          descripcionPaso: 'Llegá 10 minutos antes a la sede DNIC Paysandú para la captura de huellas, firma y fotografía.'
        },
        {
          numeroPaso: 4,
          tituloPaso: 'Entrega del documento',
          descripcionPaso: 'En la modalidad común te llevás el nuevo documento con chip en el mismo momento.'
        }
      ],
      videos: [
        {
          titulo: 'Guía paso a paso: Cómo sacar tu turno para la Cédula',
          urlVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      preguntasFrecuentes: [
        {
          pregunta: '¿Puedo renovar si se me venció hace meses o años?',
          respuesta: 'Sí, podés renovarla sin penalización alguna. Solo debés concurrir con el documento vencido y turno agendado.'
        },
        {
          pregunta: '¿Cuánto dura la cédula para mayores de 18 años?',
          respuesta: 'Para personas de 18 años en adelante tiene una vigencia legal de 10 años continuos.'
        }
      ],
      palabrasClave: ['cedula', 'identidad', 'dnic', 'renovacion', 'primera vez', 'documento', 'chip', '18 anos']
    },
    {
      titulo: 'Carné de Salud Laboral y Estudiantil',
      slug: 'carne-de-salud',
      descripcion: 'Chequeo médico preventivo obligatorio en Paysandú para ingresar a trabajar, realizar pasantías formativas o iniciar carreras universitarias.',
      organismo: orgDDS._id,
      categoria: catSalud._id,
      activo: true,
      destacado: true,
      modalidad: 'Presencial',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 450 en Policlínica Municipal',
        detalles: 'Estudiantes de UTU, UTEC o Liceo pueden acceder a tarifa bonificada o gratuita presentando constancia de estudio activa.'
      },
      tiempoEstimado: 'Atención matinal, entrega en 24 a 48 hs',
      dirigidoA: 'Jóvenes de 18 a 25 años que ingresan a un empleo formal o cursan estudios superiores.',
      urlAgenda: 'https://agenda.paysandu.gub.uy/salud',
      urlTramiteOnline: 'https://www.gub.uy/tramites/carne-salud',
      lugaresAtencion: [
        {
          nombreLugar: 'Dirección Departamental de Salud (MSP) / Policlínica',
          direccion: 'Montecaseros 1020, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3155,-58.0810',
          horario: 'Lunes a Viernes de 07:30 a 13:00'
        }
      ],
      requisitos: [
        { descripcion: 'Cédula de Identidad uruguaya vigente y en buen estado.', esObligatorio: true, orden: 1 },
        { descripcion: 'Ayuno mínimo de 8 horas para extracción de sangre y muestra de orina.', esObligatorio: true, orden: 2 },
        { descripcion: 'Certificado de Vacuna Antitetánica vigente.', esObligatorio: true, orden: 3 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Cédula de Identidad',
          descripcion: 'Documento original.',
          formatoPermitido: 'Original',
          esObligatorio: true
        },
        {
          nombreDocumento: 'Carné de Vacunas',
          descripcion: 'Comprobante sellado que acredite antitetánica al día.',
          formatoPermitido: 'Original',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Ayuno y extracción',
          descripcionPaso: 'Concurrir entre 07:30 y 09:00 en ayunas para la toma de muestras de sangre y orina.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Examen clínico, visual y odontológico',
          descripcionPaso: 'Control de agudeza visual, presión arterial, peso, talla y salud bucal.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Retiro del Carné',
          descripcionPaso: 'Retiro del carné plastificado con certificación de aptitud y vigencia.'
        }
      ],
      videos: [
        {
          titulo: '¿Cómo prepararte para el Carné de Salud?',
          urlVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ],
      preguntasFrecuentes: [
        {
          pregunta: '¿Qué vigencia tiene el carné?',
          respuesta: 'Generalmente se expide por 2 años. Si algún parámetro requiere control posterior, el médico tratante puede otorgarlo por 6 meses provisorios.'
        }
      ],
      palabrasClave: ['carne de salud', 'salud', 'medico', 'estudiante', 'trabajo', 'analisis', 'vacunas']
    },
    {
      titulo: 'Inscripción Laboral y Alta en BPS (Primer Trabajo)',
      slug: 'inscripcion-laboral-bps',
      descripcion: 'Guía oficial para jóvenes que inician su actividad laboral formal: verificación de aportes jubilatorios, cobertura médica Fonasa y asignaciones familiares.',
      organismo: orgBPS._id,
      categoria: catTrabajo._id,
      activo: true,
      destacado: true,
      modalidad: 'En Línea',
      costo: {
        tipo: 'Gratuito',
        monto: '$ 0',
        detalles: 'El trámite de registro, creación de usuario y consulta de historia laboral es completamente gratuito.'
      },
      tiempoEstimado: '10 minutos en línea',
      dirigidoA: 'Jóvenes que ingresan a su primer empleo dependiente, becarios o contratados en Paysandú.',
      urlAgenda: 'https://www.bps.gub.uy/agendas',
      urlTramiteOnline: 'https://servicios.bps.gub.uy',
      lugaresAtencion: [
        {
          nombreLugar: 'Sucursal Paysandú BPS',
          direccion: '18 de Julio 1044, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3168,-58.0775',
          horario: 'Lunes a Viernes de 09:15 a 16:00'
        }
      ],
      requisitos: [
        { descripcion: 'Cédula de Identidad uruguaya vigente.', esObligatorio: true, orden: 1 },
        { descripcion: 'Usuario personal de BPS o Identidad Digital Gub.uy activa.', esObligatorio: true, orden: 2 },
        { descripcion: 'Haber sido dado de alta por la empresa o contratante en el sistema GAFI de BPS.', esObligatorio: true, orden: 3 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Documento de Identidad',
          descripcion: 'Cédula para verificar identidad presencial si requerís crear usuario gub.uy.',
          formatoPermitido: 'Original',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Activá tu Usuario Gub.uy / BPS',
          descripcionPaso: 'Crea tu cuenta digital en gub.uy con tu cédula o en cualquier local de Abitab/RedPagos/BPS en minutos.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Verificá tu alta en Servicios en Línea',
          descripcionPaso: 'Ingresá al portal "Mi BPS" y corroborá que tu empleador haya registrado tu ingreso.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Elegí tu prestador de salud (FONASA)',
          descripcionPaso: 'Tras el alta tenés derecho a mutualista privada o ASSE con cobertura integral a tu cargo.'
        }
      ],
      preguntasFrecuentes: [
        {
          pregunta: '¿Tengo que hacer algún trámite si mi empleador ya me dio de alta?',
          respuesta: 'El empleador hace el alta, pero vos debés ingresar a BPS para elegir tu prestador médico (Fonasa) y corroborar tu historia laboral.'
        }
      ],
      palabrasClave: ['bps', 'trabajo', 'alta laboral', 'primer empleo', 'fonasa', 'seguridad social', 'historia laboral']
    },
    {
      titulo: 'Beca Estudiantil Terciaria (Fondo de Solidaridad)',
      slug: 'beca-estudiantil-terciaria',
      descripcion: 'Apoyo económico mensual de 2 BPC para jóvenes de Paysandú que cursan carreras en UDELAR (CENUR Litoral Norte), UTEC o DGETP-UTU.',
      organismo: orgFondo._id,
      categoria: catEducacion._id,
      activo: true,
      destacado: true,
      modalidad: 'En Línea',
      costo: {
        tipo: 'Gratuito',
        monto: '$ 0',
        detalles: 'La postulación y acompañamiento del Fondo de Solidaridad no tiene costo alguno.'
      },
      tiempoEstimado: 'Postulación anual (Noviembre a Febrero)',
      dirigidoA: 'Estudiantes terciarios con situación socioeconómica vulnerable.',
      urlTramiteOnline: 'https://becas.fondodesolidaridad.edu.uy',
      lugaresAtencion: [
        {
          nombreLugar: 'CENUR Litoral Norte - Sede Paysandú (UDELAR)',
          direccion: 'Florida 1065, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3150,-58.0825',
          horario: 'Lunes a Viernes de 08:00 a 20:00'
        }
      ],
      requisitos: [
        { descripcion: 'Estar inscripto en una carrera técnica, de grado o terciaria en UDELAR, UTEC o UTU.', esObligatorio: true, orden: 1 },
        { descripcion: 'Pertenecer a un hogar con ingresos per cápita acordes al baremo de vulnerabilidad.', esObligatorio: true, orden: 2 },
        { descripcion: 'Completar el formulario de declaración jurada socioeconómica en línea.', esObligatorio: true, orden: 3 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Comprobantes de ingresos del núcleo familiar',
          descripcion: 'Recibos de sueldo, pasividades o declaración jurada de ingresos informales.',
          formatoPermitido: 'PDF o JPG legible',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Creá tu usuario en el Portal del Fondo',
          descripcionPaso: 'Ingresá a la plataforma con tu cédula y correo electrónico personal.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Completá la solicitud socioeconómica',
          descripcionPaso: 'Carga los datos familiares, vivienda e ingresos adjuntando la documentación digital.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Evaluación y cobro mensual',
          descripcionPaso: 'Una vez asignada, la beca se deposita mensualmente en una cuenta bancaria a tu nombre.'
        }
      ],
      palabrasClave: ['beca', 'fondo de solidaridad', 'estudiantil', 'universidad', 'utec', 'udelar', 'cenur', 'apoyo economico']
    },
    {
      titulo: 'Boleto Estudiantil Gratuito / Abono Joven Paysandú',
      slug: 'boleto-estudiantil',
      descripcion: 'Pase libre y abono subsidiado de transporte urbano para estudiantes de educación media, UTU, UTEC y UDELAR residentes en Paysandú.',
      organismo: orgIDP._id,
      categoria: catVidaCiudadana._id,
      activo: true,
      destacado: true,
      modalidad: 'Presencial',
      costo: {
        tipo: 'Gratuito',
        monto: '$ 0',
        detalles: 'El beneficio del boleto gratuito está financiado al 100% por la Intendencia y subsidio nacional.'
      },
      tiempoEstimado: '15 minutos (retiro en el acto)',
      dirigidoA: 'Estudiantes de hasta 25 años matriculados en centros de estudio formales de Paysandú.',
      lugaresAtencion: [
        {
          nombreLugar: 'Dirección de Tránsito y Transporte',
          direccion: 'Zorrilla de San Martín 1234, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805',
          horario: 'Lunes a Viernes de 07:00 a 16:00'
        }
      ],
      requisitos: [
        { descripcion: 'Cédula de Identidad original y vigente.', esObligatorio: true, orden: 1 },
        { descripcion: 'Constancia oficial de estudiante emitida por el liceo, escuela técnica, UTEC o UDELAR.', esObligatorio: true, orden: 2 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Constancia de Estudios de Bedelía',
          descripcion: 'Certificado firmado y sellado o con código QR de verificación.',
          formatoPermitido: 'Original',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Solicitá tu constancia en el centro educativo',
          descripcionPaso: 'Pide en bedelía la constancia oficial para boleto estudiantil.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Presentate en Dirección de Tránsito',
          descripcionPaso: 'Llevá tu constancia y cédula a Zorrilla de San Martín 1234.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Entrega de tu tarjeta magnética',
          descripcionPaso: 'Se te carga el paquete de hasta 50 boletos mensuales para los colectivos locales.'
        }
      ],
      palabrasClave: ['boleto', 'transporte', 'estudiante', 'omnibus', 'abono', 'colectivo', 'idp', 'pase libre']
    },
    {
      titulo: 'Solicitud de Primera Libreta de Conducir (Categoría A)',
      slug: 'primera-libreta-conducir-cat-a',
      descripcion: 'Procedimiento para jóvenes que deseen obtener por primera vez la licencia de conducir automóviles particulares y utilitarios en Paysandú.',
      organismo: orgIDP._id,
      categoria: catTransito._id,
      activo: true,
      destacado: true,
      modalidad: 'Presencial',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 2.150',
        detalles: 'Incluye derecho a examen teórico y práctico en la pista de tránsito.'
      },
      tiempoEstimado: '1 a 3 semanas (según coordinación de clases de academia y exámenes)',
      dirigidoA: 'Personas a partir de 18 años cumplidos radicadas en Paysandú.',
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
        { descripcion: 'Cédula de Identidad uruguaya vigente y sin multas pendientes.', esObligatorio: true, orden: 2 },
        { descripcion: 'Constancia de domicilio en el departamento de Paysandú.', esObligatorio: true, orden: 3 },
        { descripcion: 'Certificado médico de aptitud psicofísica emitido por institución autorizada.', esObligatorio: true, orden: 4 }
      ],
      documentacion: [
        {
          nombreDocumento: 'Cédula de Identidad vigente',
          descripcion: 'Original y fotocopia legible.',
          formatoPermitido: 'Original y Fotocopia',
          esObligatorio: true
        }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Inscripción y Examen Médico',
          descripcionPaso: 'Realizar el chequeo de aptitud psicofísica y presentar la carpeta en la Dirección de Tránsito.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Examen Teórico',
          descripcionPaso: 'Rendir la prueba teórica interactiva sobre normas nacionales de tránsito y seguridad vial.'
        },
        {
          numeroPaso: 3,
          tituloPaso: 'Examen Práctico de Conducción',
          descripcionPaso: 'Demostrar destreza en pista cerrada y circulación guiada por inspectores de tránsito.'
        },
        {
          numeroPaso: 4,
          tituloPaso: 'Emisión y Entrega de Libreta',
          descripcionPaso: 'Superados los exámenes, se toma la foto digital y se entrega el carné de conductor.'
        }
      ],
      palabrasClave: ['primera libreta', 'aprender a manejar', 'licencia', 'auto', 'categoria a', 'examen teorico', 'transito']
    },
    {
      titulo: 'Renovación de Libreta de Conducir (Categoría A)',
      slug: 'renovacion-libreta-conducir-cat-a',
      descripcion: 'Trámite rápido para renovar la licencia de conducir vencida o próxima a vencer para conductores de Paysandú.',
      organismo: orgIDP._id,
      categoria: catTransito._id,
      activo: true,
      destacado: false,
      modalidad: 'Mixto',
      costo: {
        tipo: 'Con Costo',
        monto: '$ 1.450',
        detalles: 'Abonable previamente en redes de cobranza (Abitab o RedPagos).'
      },
      tiempoEstimado: 'En el momento tras chequeo médico y foto',
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
        { descripcion: 'Certificado de aptitud médica psicofísica.', esObligatorio: true, orden: 2 }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Chequeo Médico y Pago',
          descripcionPaso: 'Realizar el examen de salud y abonar el importe en Abitab/RedPagos.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Turno en Dirección de Tránsito',
          descripcionPaso: 'Presentarse con turno para verificar antecedentes, foto y firma.'
        }
      ],
      palabrasClave: ['renovar', 'libreta', 'conducir', 'auto', 'licencia', 'transito']
    },
    {
      titulo: 'Tarjeta Joven Paysandú (Beneficios y Descuentos INJU)',
      slug: 'tarjeta-joven-paysandu',
      descripcion: 'Acceso a la red de beneficios comerciales, culturales, deportivos y formativos para jóvenes de 14 a 29 años en Paysandú.',
      organismo: orgINJU._id,
      categoria: catVidaCiudadana._id,
      activo: true,
      destacado: false,
      modalidad: 'En Línea',
      costo: {
        tipo: 'Gratuito',
        monto: '$ 0',
        detalles: 'Programa 100% público y sin costo.'
      },
      tiempoEstimado: 'Inmediato desde la App',
      dirigidoA: 'Jóvenes de 14 a 29 años radicados en Paysandú.',
      urlTramiteOnline: 'https://www.gub.uy/inju/tarjeta-joven',
      requisitos: [
        { descripcion: 'Tener entre 14 y 29 años de edad inclusive.', esObligatorio: true, orden: 1 },
        { descripcion: 'Contar con Cédula de Identidad uruguaya vigente.', esObligatorio: true, orden: 2 }
      ],
      pasos: [
        {
          numeroPaso: 1,
          tituloPaso: 'Descargá la App Tarjeta Joven',
          descripcionPaso: 'Disponible en Google Play Store y App Store, o ingresá vía web.'
        },
        {
          numeroPaso: 2,
          tituloPaso: 'Registrate con tus datos básicos',
          descripcionPaso: 'Completá tu cédula y domicilio en Paysandú para validar tu perfil.'
        }
      ],
      palabrasClave: ['tarjeta joven', 'inju', 'beneficios', 'descuentos', 'joven', 'cultura']
    }
  ];

  await Tramite.create(tramitesBase);
  console.log(`  -> ${tramitesBase.length} trámites juveniles prioritarios creados.`);

  // 5. Ingesta de trámites oficiales desde "tramites_data_uy"
  const dataUyPath = path.join(__dirname, 'tramites_data_uy', 'tramites_data', 'tramites_completo.json');
  if (fs.existsSync(dataUyPath)) {
    console.log(`[Seed] Ingestando trámites oficiales desde ${dataUyPath}...`);
    try {
      const rawData = fs.readFileSync(dataUyPath, 'utf8');
      const allOfficial = JSON.parse(rawData);
      console.log(`  -> Archivo cargado: ${allOfficial.length} trámites disponibles en el catálogo oficial de Uruguay.`);

      // Filtrar los que mencionan Paysandú o son prioritarios de educación, trabajo, salud, identidad
      const paysanduFiltered = allOfficial.filter((t) => {
        const text = (t.titulo + ' ' + (t.descripcion || '') + ' ' + (t.organismo || '') + ' ' + (t.tags || []).join(' ')).toLowerCase();
        return (
          text.includes('paysand') ||
          text.includes('beca') ||
          text.includes('estudiant') ||
          text.includes('identidad') ||
          text.includes('pasaporte') ||
          text.includes('fonasa') ||
          text.includes('salud') ||
          text.includes('joven') ||
          text.includes('credencial') ||
          text.includes('conducir')
        );
      });

      console.log(`  -> Trámites seleccionados por relevancia: ${paysanduFiltered.length}`);

      const nuevosTramites = [];
      const slugsExistentes = new Set(tramitesBase.map((t) => t.slug));

      for (const item of paysanduFiltered) {
        if (!item.titulo) continue;
        let slug = slugify(item.titulo);
        if (slugsExistentes.has(slug)) {
          slug = `${slug}-${item.id}`;
        }
        slugsExistentes.add(slug);

        // Determinar organismo
        let organismoId = orgIDP._id;
        const orgName = (item.organismo || '').toLowerCase();
        if (orgName.includes('identificacion') || orgName.includes('dnic') || orgName.includes('interior')) {
          organismoId = orgDNIC._id;
        } else if (orgName.includes('salud') || orgName.includes('msp') || orgName.includes('sanitaria')) {
          organismoId = orgDDS._id;
        } else if (orgName.includes('prevision') || orgName.includes('bps')) {
          organismoId = orgBPS._id;
        } else if (orgName.includes('solidaridad') || orgName.includes('educacion') || orgName.includes('mec') || orgName.includes('universidad')) {
          organismoId = orgFondo._id;
        } else if (orgName.includes('juventud') || orgName.includes('mides') || orgName.includes('inju')) {
          organismoId = orgINJU._id;
        } else if (orgName.includes('impositiva') || orgName.includes('dgi')) {
          organismoId = orgDGI._id;
        }

        // Determinar categoría
        let categoriaId = catVidaCiudadana._id;
        const textCat = (item.titulo + ' ' + (item.tags || []).join(' ')).toLowerCase();
        if (textCat.includes('salud') || textCat.includes('medico') || textCat.includes('sanitar')) {
          categoriaId = catSalud._id;
        } else if (textCat.includes('trabaj') || textCat.includes('empleo') || textCat.includes('laboral') || textCat.includes('bps')) {
          categoriaId = catTrabajo._id;
        } else if (textCat.includes('beca') || textCat.includes('estudio') || textCat.includes('educaci') || textCat.includes('escuela')) {
          categoriaId = catEducacion._id;
        } else if (textCat.includes('transito') || textCat.includes('conducir') || textCat.includes('vehiculo') || textCat.includes('transporte')) {
          categoriaId = catTransito._id;
        } else if (textCat.includes('tribut') || textCat.includes('impuesto') || textCat.includes('patente') || textCat.includes('deuda')) {
          categoriaId = catTributos._id;
        }

        // Parsear requisitos
        const reqStr = item.requisitos_generales || item.presencial?.requisitos || item.en_linea?.requisitos || '';
        const reqs = reqStr
          ? reqStr.split(/\n+/).filter((r) => r.trim().length > 3).slice(0, 5).map((desc, idx) => ({
              descripcion: desc.trim(),
              esObligatorio: true,
              orden: idx + 1
            }))
          : [{ descripcion: 'Documento de Identidad vigente y en buen estado.', esObligatorio: true, orden: 1 }];

        // Parsear pasos
        const pasoStr = item.presencial?.como_se_hace || item.en_linea?.como_se_hace || '';
        const pasos = pasoStr
          ? pasoStr.split(/\n+/).filter((p) => p.trim().length > 5).slice(0, 4).map((pDesc, idx) => ({
              numeroPaso: idx + 1,
              tituloPaso: `Paso ${idx + 1}`,
              descripcionPaso: pDesc.trim()
            }))
          : [
              { numeroPaso: 1, tituloPaso: 'Revisión previa', descripcionPaso: 'Verificar contar con los requisitos solicitados.' },
              { numeroPaso: 2, tituloPaso: 'Inicio de trámite', descripcionPaso: item.en_linea?.disponible ? 'Ingresar al portal oficial del organismo.' : 'Concurrir a la oficina de atención ciudadana.' }
            ];

        // Costo
        const costoInfo = item.costo || {};
        const tieneCosto = costoInfo.tiene_costo;

        nuevosTramites.push({
          titulo: item.titulo,
          slug,
          descripcion: item.descripcion || 'Trámite oficial de la administración pública uruguaya.',
          organismo: organismoId,
          categoria: categoriaId,
          activo: true,
          destacado: false,
          modalidad: item.en_linea?.disponible && item.canales?.includes('persona') ? 'Mixto' : item.en_linea?.disponible ? 'En Línea' : 'Presencial',
          costo: {
            tipo: tieneCosto ? 'Con Costo' : 'Gratuito',
            monto: costoInfo.valor ? `${costoInfo.valor} ${costoInfo.unidad || ''}`.trim() : (tieneCosto ? 'Con costo oficial' : '$ 0'),
            detalles: costoInfo.otros_costos || ''
          },
          tiempoEstimado: 'Según coordinación con la dependencia',
          dirigidoA: 'Ciudadanos y residentes en el departamento de Paysandú.',
          urlTramiteOnline: item.en_linea?.url_inicio || item.url,
          urlAgenda: item.en_linea?.url_inicio || undefined,
          requisitos: reqs,
          pasos,
          palabrasClave: Array.isArray(item.tags) ? item.tags.slice(0, 8) : []
        });

        // Limitar a los 120 trámites más pertinentes para mantener la base ágil y rápida
        if (nuevosTramites.length >= 120) break;
      }

      await Tramite.create(nuevosTramites);
      console.log(`  -> ${nuevosTramites.length} trámites adicionales importados con éxito desde tramites_completo.json.`);
    } catch (err) {
      console.warn('[Seed] Error al leer archivo tramites_completo.json:', err.message);
    }
  }

  const totalTramites = await Tramite.countDocuments();
  console.log(`\n[Seed] Base de datos poblada exitosamente. Total de trámites activos: ${totalTramites}.`);
  await mongoose.disconnect();
  console.log('[Seed] Conexión cerrada.');
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('[Seed] Error al poblar la base de datos:', error);
  process.exit(1);
});
