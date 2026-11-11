import { Categoria } from '../models/categoria.model.js';
import { Tramite } from '../models/tramite.model.js';
import { getIsDatabaseConnected } from '../database/connection.js';
import { getFallbackCategorias } from './fallbackData.js';

export async function listarCategorias(conConteo = true) {
  if (!getIsDatabaseConnected()) {
    return getFallbackCategorias();
  }

  const categorias = await Categoria.find({ activo: true }).sort({ orden: 1, nombre: 1 }).lean();

  if (!conConteo) {
    return categorias;
  }

  const conteos = await Tramite.aggregate([
    { $match: { activo: true } },
    { $group: { _id: '$categoria', total: { $sum: 1 } } }
  ]);

  const conteoMap = new Map();
  conteos.forEach(item => {
    conteoMap.set(String(item._id), item.total);
  });

  return categorias.map(cat => ({
    ...cat,
    totalTramites: conteoMap.get(String(cat._id)) || 0
  }));
}

export async function obtenerCategoriaPorSlug(slug) {
  if (!getIsDatabaseConnected()) {
    return getFallbackCategorias().find(c => c.slug === slug.toLowerCase()) || null;
  }
  return Categoria.findOne({ slug: slug.toLowerCase(), activo: true });
}

export async function crearCategoria(data) {
  if (!data.slug && data.nombre) {
    data.slug = data.nombre
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  return Categoria.create(data);
}

export async function actualizarCategoria(id, data) {
  return Categoria.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function eliminarCategoria(id) {
  return Categoria.findByIdAndUpdate(id, { activo: false }, { new: true });
}
