import { Organizacion } from '../models/organizacion.model.js';

export async function listarOrganizaciones(soloActivas = true) {
  const filtro = soloActivas ? { activo: true } : {};
  return Organizacion.find(filtro).sort({ nombre: 1 });
}

export async function obtenerOrganizacionPorId(id) {
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
