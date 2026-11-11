import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedTramites = null;
let cachedCategorias = null;
let cachedOrganizaciones = null;

export function getFallbackOrganizaciones() {
  if (cachedOrganizaciones) return cachedOrganizaciones;

  cachedOrganizaciones = [
    {
      _id: 'org-idp',
      nombre: 'Intendencia Departamental de Paysandú',
      siglas: 'IDP',
      sitioWeb: 'https://www.paysandu.gub.uy',
      descripcion: 'Gobierno departamental responsable de la administración de servicios públicos, tránsito, cultura y juventud en Paysandú.',
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
          nombreSede: 'Espacio Paysandú Joven (Dirección de Juventud)',
          direccion: 'Dr. Leandro Gómez 1032, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3160,-58.0780',
          horario: '08:00 a 18:00',
          telefono: '4722 6220 int. 185'
        }
      ]
    },
    {
      _id: 'org-dnic',
      nombre: 'Dirección Nacional de Identificación Civil (DNIC)',
      siglas: 'DNIC',
      sitioWeb: 'https://dnic.minterior.gub.uy',
      descripcion: 'Organismo oficial para expedición y renovación de cédulas de identidad.',
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
    },
    {
      _id: 'org-dds',
      nombre: 'Dirección Departamental de Salud (MSP) / Policlínica Municipal',
      siglas: 'DDS',
      sitioWeb: 'https://www.gub.uy/ministerio-salud-publica',
      descripcion: 'Atención preventiva, chequeos médicos y emisión del Carné de Salud en Paysandú.',
      contacto: {
        telefono: '4722 2555',
        email: 'ddspaysandu@msp.gub.uy',
        horarioGeneral: 'Lunes a Viernes de 07:30 a 14:00'
      },
      sedes: [
        {
          nombreSede: 'Policlínica Municipal Paysandú',
          direccion: 'Montecaseros 1020, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3155,-58.0810',
          horario: '07:30 a 14:00',
          telefono: '4722 2555'
        }
      ]
    },
    {
      _id: 'org-bps',
      nombre: 'Banco de Previsión Social (Sucursal Paysandú)',
      siglas: 'BPS',
      sitioWeb: 'https://www.bps.gub.uy',
      descripcion: 'Instituto estatal de seguridad social, Fonasa, asignaciones y registro de primer empleo.',
      contacto: {
        telefono: '1997',
        email: 'consultas@bps.gub.uy',
        horarioGeneral: 'Lunes a Viernes de 09:15 a 16:00'
      },
      sedes: [
        {
          nombreSede: 'Sucursal BPS Paysandú',
          direccion: 'Uruguay 1025, Paysandú',
          mapsUrl: 'https://maps.google.com/?q=-32.3170,-58.0810',
          horario: '09:15 a 16:00',
          telefono: '1997'
        }
      ]
    }
  ];

  return cachedOrganizaciones;
}

export function getFallbackCategorias() {
  if (cachedCategorias) return cachedCategorias;

  cachedCategorias = [
    {
      _id: 'cat-vida-ciudadana',
      nombre: 'Vida ciudadana',
      slug: 'vida-ciudadana',
      descripcion: 'Cédula de identidad, boleto estudiantil, credencial cívica y trámites de identidad.',
      icono: 'ShieldCheck',
      color: '#0D47A1',
      orden: 1,
      totalTramites: 8
    },
    {
      _id: 'cat-salud',
      nombre: 'Salud',
      slug: 'salud',
      descripcion: 'Carné de salud básico y laboral, policlínicas barriales, vacunatorios y chequeos.',
      icono: 'HeartPulse',
      color: '#00897B',
      orden: 2,
      totalTramites: 5
    },
    {
      _id: 'cat-trabajo',
      nombre: 'Trabajo',
      slug: 'trabajo',
      descripcion: 'Inscripción en BPS, primer empleo, registro de emprendedores jóvenes y orientación laboral.',
      icono: 'Briefcase',
      color: '#D97706',
      orden: 3,
      totalTramites: 6
    },
    {
      _id: 'cat-educacion',
      nombre: 'Educación y Becas',
      slug: 'educacion-y-becas',
      descripcion: 'Becas económicas del Fondo de Solidaridad, pasantías, becas Butiá y apoyos de estudio.',
      icono: 'GraduationCap',
      color: '#2563EB',
      orden: 4,
      totalTramites: 5
    },
    {
      _id: 'cat-transito',
      nombre: 'Tránsito y Transporte',
      slug: 'transito-y-transporte',
      descripcion: 'Primera libreta de conducir para jóvenes, motos, automóviles y seguridad vial.',
      icono: 'Car',
      color: '#0284c7',
      orden: 5,
      totalTramites: 4
    }
  ];

  return cachedCategorias;
}

export function getFallbackTramites() {
  if (cachedTramites) return cachedTramites;

  const jsonPath = path.join(__dirname, '..', 'tramites_data_uy', 'tramites_data', 'tramites_completo.json');
  const baseItems = [];

  // Trámites prioritarios para jóvenes en Paysandú
  baseItems.push(
    {
      _id: 't-cedula',
      titulo: 'Cédula de Identidad (Primera vez y Renovación)',
      slug: 'cedula-de-identidad',
      descripcion: 'Obtención y renovación obligatoria del documento de identidad uruguayo en la oficina departamental de Identificación Civil de Paysandú (Montecaseros 1145).',
      organismo: {
        nombre: 'Dirección Nacional de Identificación Civil (DNIC)',
        siglas: 'DNIC',
        sitioWeb: 'https://dnic.minterior.gub.uy',
        sedes: [{ nombreSede: 'Oficina DNIC Paysandú', direccion: 'Montecaseros 1145', mapsUrl: 'https://maps.google.com/?q=-32.3162,-58.0818', horario: 'Lunes a Viernes de 08:00 a 15:00' }]
      },
      categoria: { nombre: 'Vida ciudadana', slug: 'vida-ciudadana', color: '#0D47A1' },
      modalidad: 'Mixto',
      costo: { tipo: 'Con Costo', monto: '$ 450 (Común) / $ 900 (Urgente)', detalles: 'Abonable en redes de cobranza.' },
      tiempoEstimado: '15 minutos de atención presencial',
      dirigidoA: 'Ciudadanos uruguayos y residentes legales a partir de los 18 años.',
      urlAgenda: 'https://www.gub.uy/tramites/documento-nacional-identidad-renovacion-personas-ciudadanas-naturales-uruguayas',
      urlTramiteOnline: 'https://www.gub.uy/tramites/documento-nacional-identidad-renovacion-personas-ciudadanas-naturales-uruguayas',
      destacado: true,
      requisitos: [
        { descripcion: 'Haber reservado cita previa en la Agenda Web oficial o red de cobranza.', esObligatorio: true, orden: 1 },
        { descripcion: 'Cédula de Identidad anterior (en caso de renovación).', esObligatorio: true, orden: 2 },
        { descripcion: 'Partida de Nacimiento si es primera vez (menor a 30 días de vigencia).', esObligatorio: false, orden: 3 }
      ],
      pasos: [
        { numeroPaso: 1, tituloPaso: 'Agendate en línea', descripcionPaso: 'Ingresá al portal de la DNIC o red de cobranza para reservar turno.' },
        { numeroPaso: 2, tituloPaso: 'Aboná el arancel', descripcionPaso: 'Aboná el importe antes de la fecha elegida.' },
        { numeroPaso: 3, tituloPaso: 'Presentate en Montecaseros', descripcionPaso: 'Captura de huellas, firma y fotografía digital.' },
        { numeroPaso: 4, tituloPaso: 'Entrega del documento', descripcionPaso: 'Retiro del documento con chip en el acto.' }
      ],
      videos: [{ titulo: 'Cómo sacar turno para la Cédula', urlVideo: 'https://www.youtube.com/watch?v=NALqFcXNiz4' }],
      preguntasFrecuentes: [
        { pregunta: '¿Puedo renovar si se me venció hace meses?', respuesta: 'Sí, podés renovarla sin penalización alguna presentando el documento vencido.' },
        { pregunta: '¿Cuánto dura la cédula para mayores de 18 años?', respuesta: 'Tiene una vigencia legal de 10 años continuos.' }
      ],
      palabrasClave: ['cedula', 'identidad', 'dnic', 'renovacion', 'documento', '18 anos']
    },
    {
      _id: 't-salud',
      titulo: 'Carné de Salud Laboral y Estudiantil',
      slug: 'carne-de-salud',
      descripcion: 'Chequeo médico preventivo obligatorio en Paysandú para ingresar a trabajar, realizar pasantías formativas o iniciar carreras terciarias en la Policlínica Municipal.',
      organismo: {
        nombre: 'Dirección Departamental de Salud (MSP) / Policlínica Municipal',
        siglas: 'DDS',
        sitioWeb: 'https://www.gub.uy/ministerio-salud-publica',
        sedes: [{ nombreSede: 'Sede Central DDS / Policlínica', direccion: 'Montecaseros 1020, Paysandú', mapsUrl: 'https://maps.google.com/?q=-32.3155,-58.0810', horario: 'Lunes a Viernes de 07:30 a 13:00' }]
      },
      categoria: { nombre: 'Salud', slug: 'salud', color: '#00897B' },
      modalidad: 'Presencial',
      costo: { tipo: 'Con Costo', monto: '$ 450 en Policlínica Municipal', detalles: 'Bonificado o gratuito con constancia de estudio.' },
      tiempoEstimado: 'Atención en la mañana, entrega en 24 a 48 hs',
      dirigidoA: 'Jóvenes de 18 a 25 años que ingresan a un empleo formal o cursan estudios superiores.',
      urlAgenda: 'https://www.gub.uy/tramites/carne-salud',
      urlTramiteOnline: 'https://www.gub.uy/tramites/carne-salud',
      destacado: true,
      requisitos: [
        { descripcion: 'Cédula de Identidad uruguaya vigente y en buen estado.', esObligatorio: true, orden: 1 },
        { descripcion: 'Ayuno mínimo de 8 horas para extracción de sangre y orina.', esObligatorio: true, orden: 2 },
        { descripcion: 'Certificado de Vacuna Antitetánica vigente.', esObligatorio: true, orden: 3 }
      ],
      pasos: [
        { numeroPaso: 1, tituloPaso: 'Ayuno y extracción', descripcionPaso: 'Concurrir entre 07:30 y 09:00 en ayunas para la toma de muestras.' },
        { numeroPaso: 2, tituloPaso: 'Examen clínico y visual', descripcionPaso: 'Control de agudeza visual, presión arterial y peso.' },
        { numeroPaso: 3, tituloPaso: 'Retiro del carné', descripcionPaso: 'Retiro del carné plastificado con certificación.' }
      ],
      videos: [{ titulo: 'Preparación para el Carné de Salud', urlVideo: 'https://www.youtube.com/watch?v=j3EdiIcGTSE' }],
      preguntasFrecuentes: [
        { pregunta: '¿Qué vigencia tiene el carné?', respuesta: 'Generalmente se expide por 2 años, o 6 meses en casos provisorios.' }
      ],
      palabrasClave: ['carne de salud', 'salud', 'medico', 'estudiante', 'trabajo', 'vacunas']
    },
    {
      _id: 't-bps',
      titulo: 'Inscripción Laboral y Alta en BPS (Primer Trabajo)',
      slug: 'inscripcion-laboral-bps',
      descripcion: 'Guía oficial para jóvenes que inician su actividad laboral formal: verificación de aportes jubilatorios, cobertura médica Fonasa y asignaciones familiares.',
      organismo: {
        nombre: 'Banco de Previsión Social (Sucursal Paysandú)',
        siglas: 'BPS',
        sitioWeb: 'https://www.bps.gub.uy',
        sedes: [{ nombreSede: 'Sucursal Paysandú BPS', direccion: '18 de Julio 1044, Paysandú', mapsUrl: 'https://maps.google.com/?q=-32.3168,-58.0775', horario: 'Lunes a Viernes de 09:15 a 16:00' }]
      },
      categoria: { nombre: 'Trabajo', slug: 'trabajo', color: '#D97706' },
      modalidad: 'En Línea',
      costo: { tipo: 'Gratuito', monto: '$ 0', detalles: 'Trámite digital 100% sin costo.' },
      tiempoEstimado: '10 minutos en línea',
      dirigidoA: 'Jóvenes que ingresan a su primer empleo dependiente o becarios.',
      urlAgenda: 'https://www.bps.gub.uy',
      urlTramiteOnline: 'https://www.gub.uy/tramites/constancia-historia-laboral-nominada',
      destacado: true,
      requisitos: [
        { descripcion: 'Cédula de Identidad uruguaya vigente.', esObligatorio: true, orden: 1 },
        { descripcion: 'Usuario personal de BPS o Identidad Digital Gub.uy activa.', esObligatorio: true, orden: 2 }
      ],
      pasos: [
        { numeroPaso: 1, tituloPaso: 'Activá tu Usuario Gub.uy / BPS', descripcionPaso: 'Crea tu cuenta digital en gub.uy con tu cédula.' },
        { numeroPaso: 2, tituloPaso: 'Verificá tu alta en Mi BPS', descripcionPaso: 'Ingresá a Servicios en Línea para corroborar el alta.' },
        { numeroPaso: 3, tituloPaso: 'Elegí tu prestador FONASA', descripcionPaso: 'Seleccioná tu mutualista médica con cobertura total.' }
      ],
      videos: [{ titulo: 'Usuario Personal BPS', urlVideo: 'https://www.youtube.com/watch?v=4JLvFKEG3PY' }],
      palabrasClave: ['bps', 'trabajo', 'alta laboral', 'primer empleo', 'fonasa']
    },
    {
      _id: 't-beca',
      titulo: 'Beca Estudiantil Terciaria (Fondo de Solidaridad)',
      slug: 'beca-estudiantil-terciaria',
      descripcion: 'Apoyo económico mensual de 2 BPC para jóvenes de Paysandú que cursan carreras en UDELAR (CENUR Litoral Norte), UTEC o DGETP-UTU.',
      organismo: {
        nombre: 'Fondo de Solidaridad / Bienestar Estudiantil',
        siglas: 'Fondo Solidaridad',
        sitioWeb: 'https://becas.fondodesolidaridad.edu.uy',
        sedes: [{ nombreSede: 'CENUR Litoral Norte Sede Paysandú', direccion: 'Florida 1065, Paysandú', mapsUrl: 'https://maps.google.com/?q=-32.3150,-58.0825', horario: 'Lunes a Viernes de 08:00 a 20:00' }]
      },
      categoria: { nombre: 'Educación y Becas', slug: 'educacion-y-becas', color: '#2563EB' },
      modalidad: 'En Línea',
      costo: { tipo: 'Gratuito', monto: '$ 0', detalles: 'Postulación y acompañamiento sin costo.' },
      tiempoEstimado: 'Postulación anual (Noviembre a Febrero)',
      dirigidoA: 'Estudiantes terciarios con situación socioeconómica que requiera apoyo.',
      urlTramiteOnline: 'https://becas.fondodesolidaridad.edu.uy',
      destacado: true,
      requisitos: [
        { descripcion: 'Estar inscripto en UDELAR, UTEC o UTU.', esObligatorio: true, orden: 1 },
        { descripcion: 'Completar la declaración jurada socioeconómica en línea.', esObligatorio: true, orden: 2 }
      ],
      pasos: [
        { numeroPaso: 1, tituloPaso: 'Creá tu usuario', descripcionPaso: 'Ingresá al portal del Fondo con tu correo.' },
        { numeroPaso: 2, tituloPaso: 'Completá la solicitud', descripcionPaso: 'Carga los datos socioeconómicos y comprobantes.' }
      ],
      videos: [{ titulo: 'Tutorial Beca Terciaria', urlVideo: 'https://www.youtube.com/watch?v=8JmEjd3ouA0' }],
      palabrasClave: ['beca', 'fondo de solidaridad', 'estudiantil', 'utec', 'udelar', 'cenur']
    },
    {
      _id: 't-boleto',
      titulo: 'Boleto Estudiantil Gratuito / Abono Joven Paysandú',
      slug: 'boleto-estudiantil',
      descripcion: 'Pase libre y abono subsidiado de transporte urbano para estudiantes de educación media, UTU, UTEC y UDELAR residentes en Paysandú.',
      organismo: {
        nombre: 'Intendencia Departamental de Paysandú (Dirección de Tránsito)',
        siglas: 'IDP',
        sitioWeb: 'https://www.paysandu.gub.uy',
        sedes: [{ nombreSede: 'Dirección de Tránsito y Transporte', direccion: 'Zorrilla de San Martín 1234', mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805', horario: 'Lunes a Viernes de 07:00 a 16:00' }]
      },
      categoria: { nombre: 'Vida ciudadana', slug: 'vida-ciudadana', color: '#0D47A1' },
      modalidad: 'Presencial',
      costo: { tipo: 'Gratuito', monto: '$ 0', detalles: 'Financiado por la Intendencia de Paysandú.' },
      tiempoEstimado: '15 minutos (retiro en el acto)',
      dirigidoA: 'Estudiantes de hasta 25 años en Paysandú.',
      urlAgenda: 'https://www.paysandu.gub.uy',
      destacado: true,
      requisitos: [
        { descripcion: 'Cédula de Identidad original y vigente.', esObligatorio: true, orden: 1 },
        { descripcion: 'Constancia oficial de estudiante de bedelía.', esObligatorio: true, orden: 2 }
      ],
      pasos: [
        { numeroPaso: 1, tituloPaso: 'Solicitá tu constancia en bedelía', descripcionPaso: 'Pedí el certificado oficial para boleto estudiantil.' },
        { numeroPaso: 2, tituloPaso: 'Presentate en Zorrilla 1234', descripcionPaso: 'Entrega de tu tarjeta magnética con hasta 50 boletos mensuales.' }
      ],
      videos: [{ titulo: 'Trámites de Tránsito Paysandú', urlVideo: 'https://www.youtube.com/watch?v=lqMQwTwQEPk' }],
      palabrasClave: ['boleto', 'transporte', 'estudiante', 'omnibus', 'abono']
    },
    {
      _id: 't-libreta',
      titulo: 'Solicitud de Primera Libreta de Conducir (Categoría A)',
      slug: 'primera-libreta-conducir-cat-a',
      descripcion: 'Procedimiento para jóvenes que deseen obtener por primera vez la licencia de conducir automóviles particulares y utilitarios en Paysandú.',
      organismo: {
        nombre: 'Intendencia Departamental de Paysandú (Dirección de Tránsito)',
        siglas: 'IDP',
        sitioWeb: 'https://www.paysandu.gub.uy',
        sedes: [{ nombreSede: 'Dirección de Tránsito y Transporte', direccion: 'Zorrilla de San Martín 1234', mapsUrl: 'https://maps.google.com/?q=-32.3180,-58.0805', horario: 'Lunes a Viernes de 07:00 a 16:00' }]
      },
      categoria: { nombre: 'Tránsito y Transporte', slug: 'transito-y-transporte', color: '#0284c7' },
      modalidad: 'Presencial',
      costo: { tipo: 'Con Costo', monto: '$ 2.150', detalles: 'Incluye derecho a examen teórico y práctico.' },
      tiempoEstimado: '1 a 3 semanas',
      dirigidoA: 'Personas a partir de 18 años cumplidos en Paysandú.',
      urlAgenda: 'https://www.paysandu.gub.uy',
      destacado: true,
      requisitos: [
        { descripcion: 'Tener 18 años cumplidos.', esObligatorio: true, orden: 1 },
        { descripcion: 'Cédula de Identidad uruguaya vigente sin multas.', esObligatorio: true, orden: 2 },
        { descripcion: 'Certificado médico de aptitud psicofísica.', esObligatorio: true, orden: 3 }
      ],
      pasos: [
        { numeroPaso: 1, tituloPaso: 'Chequeo médico', descripcionPaso: 'Realizar examen de aptitud psicofísica.' },
        { numeroPaso: 2, tituloPaso: 'Examen Teórico', descripcionPaso: 'Rendir prueba de normas de tránsito.' },
        { numeroPaso: 3, tituloPaso: 'Examen Práctico', descripcionPaso: 'Demostrar destreza en pista y calle.' },
        { numeroPaso: 4, tituloPaso: 'Emisión de Libreta', descripcionPaso: 'Foto digital y entrega del carné de conductor.' }
      ],
      videos: [{ titulo: 'Licencias de Conducir Paysandú', urlVideo: 'https://www.youtube.com/watch?v=ddeCuibHqL4' }],
      palabrasClave: ['primera libreta', 'licencia', 'auto', 'categoria a', 'transito']
    }
  );

  // Ingestar además del dataset de AGESIC si existe
  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const allOfficial = JSON.parse(raw);
      const filtered = allOfficial
        .filter(t => {
          const s = (t.titulo + ' ' + (t.descripcion || '') + ' ' + (t.organismo || '')).toLowerCase();
          return s.includes('paysand') || s.includes('beca') || s.includes('salud') || s.includes('identidad') || s.includes('trabaj');
        })
        .slice(0, 40);

      filtered.forEach((item, idx) => {
        const slug = (item.titulo || '')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + `-${item.id || idx}`;

        baseItems.push({
          _id: `t-official-${item.id || idx}`,
          titulo: item.titulo,
          slug,
          descripcion: item.descripcion || 'Trámite oficial de la administración pública uruguaya.',
          organismo: {
            nombre: item.organismo || 'Administración Central',
            siglas: 'GUB.UY',
            sitioWeb: item.url || 'https://www.gub.uy'
          },
          categoria: { nombre: 'Vida ciudadana', slug: 'vida-ciudadana', color: '#0D47A1' },
          modalidad: item.en_linea?.disponible ? 'En Línea' : 'Presencial',
          costo: {
            tipo: item.costo?.tiene_costo ? 'Con Costo' : 'Gratuito',
            monto: item.costo?.valor || (item.costo?.tiene_costo ? 'Con arancel' : '$ 0')
          },
          tiempoEstimado: 'Según oficina',
          dirigidoA: 'Ciudadanos en Paysandú y todo el país.',
          urlTramiteOnline: item.en_linea?.url_inicio || item.url,
          destacado: false,
          requisitos: item.requisitos_generales ? [{ descripcion: item.requisitos_generales.slice(0, 140), esObligatorio: true, orden: 1 }] : [],
          pasos: item.en_linea?.como_se_hace ? [{ numeroPaso: 1, tituloPaso: 'Inicio', descripcionPaso: item.en_linea.como_se_hace.slice(0, 180) }] : [],
          palabrasClave: item.tags || []
        });
      });
    } catch {
      // Ignorar error al parsear fallback
    }
  }

  cachedTramites = baseItems;
  return cachedTramites;
}
