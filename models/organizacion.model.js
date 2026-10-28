import mongoose from 'mongoose';

const sedeSchema = new mongoose.Schema({
  nombreSede: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  mapsUrl: { type: String, required: true, trim: true },
  horario: { type: String, trim: true },
  telefono: { type: String, trim: true }
}, { _id: true });

const organizacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, unique: true },
  siglas: { type: String, trim: true },
  sitioWeb: { type: String, trim: true },
  descripcion: { type: String, trim: true },
  logo: { type: String, trim: true },
  contacto: {
    telefono: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    horarioGeneral: { type: String, trim: true }
  },
  sedes: [sedeSchema],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export const Organizacion = mongoose.model('Organizacion', organizacionSchema);
