import { Tramite } from '../models/tramite.model.js';
import { Categoria } from '../models/categoria.model.js';
import { Organizacion } from '../models/organizacion.model.js';
import { getIsDatabaseConnected } from '../database/connection.js';
import { getFallbackTramites } from './fallbackData.js';

export function generarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function listarTramites({
  categoria,
  organismo,
  modalidad,
  costoTipo,
  destacado,
  page = 1,
  limit = 20
} = {}) {
  if (!getIsDatabaseConnected()) {
    let items = getFallbackTramites();
    if (categoria) {
      items = items.filter(t => t.categoria?.slug === categoria.toLowerCase() || t.categoria?.nombre?.toLowerCase() === categoria.toLowerCase());
    }
    if (modalidad) {
      items = items.filter(t => t.modalidad === modalidad);
    }
    if (costoTipo) {
      items = items.filter(t => t.costo?.tipo === costoTipo);
    }
    if (destacado !== undefined) {
      const isDest = destacado === 'true' || destacado === true;
      if (isDest) items = items.filter(t => t.destacado);
    }
    const p = Math.max(1, parseInt(page, 10));
    const lim = Math.max(1, parseInt(limit, 10));
    const start = (p - 1) * lim;
    return {
      total: items.length,
      page: p,
      totalPages: Math.ceil(items.length / lim) || 1,
      items: items.slice(start, start + lim)
    };
  }

  const filtro = { activo: true };

  if (categoria) {
    if (categoria.match(/^[0-9a-fA-F]{24}$/)) {
      filtro.categoria = categoria;
    } else {
      const catDoc = await Categoria.findOne({ slug: categoria.toLowerCase() });
      if (catDoc) filtro.categoria = catDoc._id;
    }
  }

  if (organismo) {
    if (organismo.match(/^[0-9a-fA-F]{24}$/)) {
      filtro.organismo = organismo;
    } else {
      const orgDoc = await Organizacion.findOne({
        $or: [
          { siglas: new RegExp(`^${organismo}$`, 'i') },
          { nombre: new RegExp(organismo, 'i') }
        ]
      });
      if (orgDoc) filtro.organismo = orgDoc._id;
    }
  }

  if (modalidad) filtro.modalidad = modalidad;
  if (costoTipo) filtro['costo.tipo'] = costoTipo;
  if (destacado !== undefined) {
    filtro.destacado = destacado === 'true' || destacado === true;
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const take = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const [total, items] = await Promise.all([
    Tramite.countDocuments(filtro),
    Tramite.find(filtro)
      .populate('organismo', 'nombre siglas logo sedes contacto')
      .populate('categoria', 'nombre slug icono color')
      .sort({ destacado: -1, titulo: 1 })
      .skip(skip)
      .limit(take)
  ]);

  return {
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / take) || 1,
    items
  };
}

export async function buscarTramites(termino, { limit = 20 } = {}) {
  if (!termino || typeof termino !== 'string' || !termino.trim()) {
    return [];
  }

  const query = termino.trim().toLowerCase();
  const take = Math.min(50, Math.max(1, parseInt(limit, 10)));

  if (!getIsDatabaseConnected()) {
    return getFallbackTramites()
      .filter(t => 
        t.titulo.toLowerCase().includes(query) ||
        t.descripcion.toLowerCase().includes(query) ||
        t.palabrasClave?.some(k => k.toLowerCase().includes(query))
      )
      .slice(0, take);
  }

  try {
    let resultados = await Tramite.find(
      {
        activo: true,
        $text: { $search: query }
      },
      { score: { $meta: 'textScore' } }
    )
      .populate('organismo', 'nombre siglas logo sedes contacto')
      .populate('categoria', 'nombre slug icono color')
      .sort({ score: { $meta: 'textScore' } })
      .limit(take);

    if (resultados.length === 0) {
      const regex = new RegExp(query, 'i');
      resultados = await Tramite.find({
        activo: true,
        $or: [
          { titulo: regex },
          { descripcion: regex },
          { palabrasClave: regex }
        ]
      })
        .populate('organismo', 'nombre siglas logo sedes contacto')
        .populate('categoria', 'nombre slug icono color')
        .limit(take);
    }

    return resultados;
  } catch {
    return getFallbackTramites().filter(t => t.titulo.toLowerCase().includes(query)).slice(0, take);
  }
}

export async function obtenerDestacados(limit = 6) {
  const take = Math.min(20, Math.max(1, parseInt(limit, 10)));

  if (!getIsDatabaseConnected()) {
    return getFallbackTramites().filter(t => t.destacado).slice(0, take);
  }

  return Tramite.find({ activo: true, destacado: true })
    .populate('organismo', 'nombre siglas logo sedes contacto')
    .populate('categoria', 'nombre slug icono color')
    .sort({ updatedAt: -1 })
    .limit(take);
}

export async function obtenerTramitePorSlug(slug) {
  if (!slug) return null;

  if (!getIsDatabaseConnected()) {
    const found = getFallbackTramites().find(t => t.slug === slug.toLowerCase());
    return found || null;
  }

  return Tramite.findOne({ slug: slug.toLowerCase(), activo: true })
    .populate('organismo')
    .populate('categoria');
}

export async function crearTramite(data) {
  if (!data.slug && data.titulo) {
    data.slug = generarSlug(data.titulo);
  }
  return Tramite.create(data);
}

export async function actualizarTramite(id, data) {
  if (data.titulo && !data.slug) {
    data.slug = generarSlug(data.titulo);
  }
  return Tramite.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function eliminarTramite(id) {
  return Tramite.findByIdAndUpdate(id, { activo: false }, { new: true });
}
