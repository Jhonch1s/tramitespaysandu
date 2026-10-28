import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true, index: true },
  descripcion: { type: String, trim: true },
  icono: { type: String, default: 'FileText', trim: true },
  color: { type: String, default: '#0284c7', trim: true },
  orden: { type: Number, default: 0 },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export const Categoria = mongoose.model('Categoria', categoriaSchema);
