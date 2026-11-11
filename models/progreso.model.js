import mongoose from 'mongoose';

const requisitoCheckSchema = new mongoose.Schema({
  requisitoId: { type: String, required: true },
  descripcion: { type: String, default: '' },
  completado: { type: Boolean, default: true },
  fechaMarcado: { type: Date, default: Date.now }
}, { _id: false });

const tramiteProgresoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tramiteSlug: { type: String, required: true, index: true },
  tramiteTitulo: { type: String, default: '' },
  requisitos: [requisitoCheckSchema],
  actualizadoEn: { type: Date, default: Date.now }
}, { timestamps: true });

tramiteProgresoSchema.index({ usuario: 1, tramiteSlug: 1 }, { unique: true });

export const TramiteProgreso = mongoose.model('TramiteProgreso', tramiteProgresoSchema);
