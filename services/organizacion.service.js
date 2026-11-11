import { Organizacion } from '../models/organizacion.model.js';
import { getIsDatabaseConnected } from '../database/connection.js';
import { getFallbackOrganizaciones } from './fallbackData.js';

export async function listarOrganizaciones(soloActivas = true) {
  if (!getIsDatabaseConnected()) {
    const list = getFallbackOrganizaciones();
    return soloActivas ? list : list;
  }
  const filtro = soloActivas ? { activo: true } : {};
  return Organizacion.find(filtro).sort({ nombre: 1 });
}

export async function obtenerOrganizacionPorId(id) {
  if (!getIsDatabaseConnected()) {
    const list = getFallbackOrganizaciones();
    return list.find(o => o._id === id || o.siglas?.toLowerCase() === id.toLowerCase()) || null;
  }
  return Organizacion.findById(id);
}

export async function crearOrganizacion(data) {
  return Organizacion.create(data);
}

export async function actualizarOrganizacion(id, data) {
  return Organizacion.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function eliminarOrganizacion(id) {
  return Organizacion.findByIdAndUpdate(id, { activo: false }, { new: true });
}
