import mongoose from 'mongoose';

const requisitoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true, trim: true },
  esObligatorio: { type: Boolean, default: true },
  orden: { type: Number, default: 0 }
}, { _id: true });

const documentacionSchema = new mongoose.Schema({
  nombreDocumento: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  formatoPermitido: { type: String, trim: true },
  esObligatorio: { type: Boolean, default: true },
  urlPlantilla: { type: String, trim: true }
}, { _id: true });

const pasoSchema = new mongoose.Schema({
  numeroPaso: { type: Number, required: true },
  tituloPaso: { type: String, required: true, trim: true },
  descripcionPaso: { type: String, required: true, trim: true }
}, { _id: true });

const videoSchema = new mongoose.Schema({
  titulo: { type: String, trim: true },
  urlVideo: { type: String, trim: true }
}, { _id: true });

const lugarAtencionSchema = new mongoose.Schema({
  nombreLugar: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  mapsUrl: { type: String, required: true, trim: true },
  horario: { type: String, trim: true }
}, { _id: true });

const preguntaFrecuenteSchema = new mongoose.Schema({
  pregunta: { type: String, required: true, trim: true },
  respuesta: { type: String, required: true, trim: true }
}, { _id: true });

const tramiteSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true, index: true },
  descripcion: { type: String, required: true, trim: true },
  organismo: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizacion', required: true, index: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true, index: true },
  activo: { type: Boolean, default: true, index: true },
  destacado: { type: Boolean, default: false, index: true },

  modalidad: {
    type: String,
    enum: ['Presencial', 'En Línea', 'Mixto'],
    default: 'Presencial',
    index: true
  },
  costo: {
    tipo: {
      type: String,
      enum: ['Gratuito', 'Con Costo', 'Variable'],
      default: 'Gratuito',
      index: true
    },
    monto: { type: String, trim: true },
    detalles: { type: String, trim: true }
  },
  tiempoEstimado: { type: String, trim: true },
  dirigidoA: { type: String, trim: true },
  urlAgenda: { type: String, trim: true },
  urlTramiteOnline: { type: String, trim: true },

  lugaresAtencion: [lugarAtencionSchema],
  requisitos: [requisitoSchema],
  documentacion: [documentacionSchema],
  pasos: [pasoSchema],
  videos: [videoSchema],
  preguntasFrecuentes: [preguntaFrecuenteSchema],

  palabrasClave: [{ type: String, lowercase: true, trim: true }]
}, { timestamps: true });

// Índice de texto pa busquedas agiles anashei
tramiteSchema.index({
  titulo: 'text',
  descripcion: 'text',
  palabrasClave: 'text'
}, {
  weights: {
    titulo: 10,
    palabrasClave: 5,
    descripcion: 2
  },
  default_language: 'spanish'
});

export const Tramite = mongoose.model('Tramite', tramiteSchema);
