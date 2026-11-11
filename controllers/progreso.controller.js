import { TramiteProgreso } from '../models/progreso.model.js';
import { getIsDatabaseConnected } from '../database/connection.js';

const inMemoryProgreso = new Map();

export async function getProgresoPorTramite(req, res) {
  try {
    const userId = req.user?.id;
    const { tramiteSlug } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    if (getIsDatabaseConnected()) {
      const doc = await TramiteProgreso.findOne({ usuario: userId, tramiteSlug });
      return res.json({
        success: true,
        data: doc ? doc.requisitos : []
      });
    }

    const key = `${userId}:${tramiteSlug}`;
    const cached = inMemoryProgreso.get(key) || [];
    return res.json({ success: true, data: cached });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function toggleRequisito(req, res) {
  try {
    const userId = req.user?.id;
    const { tramiteSlug } = req.params;
    const { requisitoId, descripcion = '', completado = true, tramiteTitulo = '' } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }
    if (!requisitoId) {
      return res.status(400).json({ success: false, message: 'requisitoId es requerido' });
    }

    const now = new Date();

    if (getIsDatabaseConnected()) {
      let doc = await TramiteProgreso.findOne({ usuario: userId, tramiteSlug });
      if (!doc) {
        doc = new TramiteProgreso({
          usuario: userId,
          tramiteSlug,
          tramiteTitulo,
          requisitos: []
        });
      }

      const existingIndex = doc.requisitos.findIndex(r => r.requisitoId === String(requisitoId));
      if (existingIndex >= 0) {
        doc.requisitos[existingIndex].completado = completado;
        doc.requisitos[existingIndex].fechaMarcado = now;
        if (descripcion) doc.requisitos[existingIndex].descripcion = descripcion;
      } else {
        doc.requisitos.push({
          requisitoId: String(requisitoId),
          descripcion,
          completado,
          fechaMarcado: now
        });
      }

      doc.actualizadoEn = now;
      await doc.save();

      return res.json({
        success: true,
        message: 'Progreso guardado correctamente',
        data: doc.requisitos
      });
    }

    // In-memory fallback
    const key = `${userId}:${tramiteSlug}`;
    let list = inMemoryProgreso.get(key) || [];
    const idx = list.findIndex(r => r.requisitoId === String(requisitoId));
    if (idx >= 0) {
      list[idx] = { ...list[idx], completado, fechaMarcado: now };
    } else {
      list.push({ requisitoId: String(requisitoId), descripcion, completado, fechaMarcado: now });
    }
    inMemoryProgreso.set(key, list);

    return res.json({
      success: true,
      message: 'Progreso guardado en memoria',
      data: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAllProgreso(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    if (getIsDatabaseConnected()) {
      const records = await TramiteProgreso.find({ usuario: userId }).sort({ actualizadoEn: -1 });
      return res.json({ success: true, data: records });
    }

    const records = [];
    for (const [key, val] of inMemoryProgreso.entries()) {
      if (key.startsWith(`${userId}:`)) {
        const tramiteSlug = key.split(':')[1];
        records.push({ tramiteSlug, requisitos: val });
      }
    }
    return res.json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
