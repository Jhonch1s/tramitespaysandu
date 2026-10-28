import { Tramite } from '../models/tramite.model.js';
import { Categoria } from '../models/categoria.model.js';
import { Organizacion } from '../models/organizacion.model.js';

export function generarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[^a-z0-9]+/g, '-')                      // Reemplazar caracteres no alfanuméricos por guiones
    .replace(/(^-|-$)+/g, '');                        // Quitar guiones al principio y final
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
  const filtro = { activo: true };

  // Filtrar por categoría (acepta ObjectId o slug)
  if (categoria) {
    if (categoria.match(/^[0-9a-fA-F]{24}$/)) {
      filtro.categoria = categoria;
    } else {
      const catDoc = await Categoria.findOne({ slug: categoria.toLowerCase() });
      if (catDoc) {
        filtro.categoria = catDoc._id;
      }
    }
  }

  // Filtrar por organismo (acepta ObjectId o siglas/nombre)
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
      if (orgDoc) {
        filtro.organismo = orgDoc._id;
      }
    }
  }

  if (modalidad) {
    filtro.modalidad = modalidad;
  }

  if (costoTipo) {
    filtro['costo.tipo'] = costoTipo;
  }

  if (destacado !== undefined) {
    filtro.destacado = destacado === 'true' || destacado === true;
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const take = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const [total, items] = await Promise.all([
    Tramite.countDocuments(filtro),
    Tramite.find(filtro)
      .select('titulo slug descripcion organismo categoria modalidad costo tiempoEstimado dirigidoA destacado')
      .populate('organismo', 'nombre siglas logo sedes')
      .populate('categoria', 'nombre slug icono color')
      .sort({ destacado: -1, titulo: 1 })
      .skip(skip)
      .limit(take)
  ]);

  return {
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / take),
    items
  };
}

export async function buscarTramites(termino, { limit = 20 } = {}) {
  if (!termino || typeof termino !== 'string' || !termino.trim()) {
    return [];
  }

  const query = termino.trim();
  const take = Math.min(50, Math.max(1, parseInt(limit, 10)));

  try {
    // 1. Intentar búsqueda rápida con índice de texto
    let resultados = await Tramite.find(
      {
        activo: true,
        $text: { $search: query }
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .select('titulo slug descripcion organismo categoria modalidad costo tiempoEstimado destacado')
      .populate('organismo', 'nombre siglas logo')
      .populate('categoria', 'nombre slug icono color')
      .limit(take);

    // 2. Si la búsqueda de texto no arrojó resultados (ej. subcadenas o prefijos), fallback a Regex
    if (!resultados || resultados.length === 0) {
      const regex = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      resultados = await Tramite.find({
        activo: true,
        $or: [
          { titulo: regex },
          { palabrasClave: regex },
          { descripcion: regex }
        ]
      })
        .select('titulo slug descripcion organismo categoria modalidad costo tiempoEstimado destacado')
        .populate('organismo', 'nombre siglas logo')
        .populate('categoria', 'nombre slug icono color')
        .limit(take);
    }

    return resultados;
  } catch (error) {
    // En caso de cualquier error con el índice de texto, usar fallback por regex seguro
    const regex = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
    return Tramite.find({
      activo: true,
      $or: [
        { titulo: regex },
        { palabrasClave: regex },
        { descripcion: regex }
      ]
    })
      .select('titulo slug descripcion organismo categoria modalidad costo tiempoEstimado destacado')
      .populate('organismo', 'nombre siglas logo')
      .populate('categoria', 'nombre slug icono color')
      .limit(take);
  }
}

export async function obtenerDestacados(limit = 6) {
  return Tramite.find({ activo: true, destacado: true })
    .select('titulo slug descripcion organismo categoria modalidad costo tiempoEstimado')
    .populate('organismo', 'nombre siglas logo')
    .populate('categoria', 'nombre slug icono color')
    .sort({ titulo: 1 })
    .limit(limit);
}

export async function obtenerTramitePorSlug(slug) {
  return Tramite.findOne({ slug: slug.toLowerCase(), activo: true })
    .populate('organismo')
    .populate('categoria');
}

export async function crearTramite(data) {
  if (!data.slug && data.titulo) {
    data.slug = generarSlug(data.titulo);
  }

  // Si ya existe ese slug, añadir sufijo numérico
  let slugExistente = await Tramite.findOne({ slug: data.slug });
  if (slugExistente) {
    data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
  }

  return Tramite.create(data);
}

export async function actualizarTramite(id, data) {
  return Tramite.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('organismo')
    .populate('categoria');
}

export async function eliminarTramite(id) {
  return Tramite.findByIdAndUpdate(id, { activo: false }, { new: true });
}
