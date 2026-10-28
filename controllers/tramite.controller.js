import * as tramiteService from '../services/tramite.service.js';

export async function listar(req, res) {
  try {
    const { categoria, organismo, modalidad, costoTipo, destacado, page, limit } = req.query;
    const resultado = await tramiteService.listarTramites({
      categoria,
      organismo,
      modalidad,
      costoTipo,
      destacado,
      page,
      limit
    });

    res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar trámites',
      error: error.message
    });
  }
}

export async function buscar(req, res) {
  try {
    const { q, limit } = req.query;
    if (!q || !q.trim()) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const resultados = await tramiteService.buscarTramites(q, { limit });
    res.json({
      success: true,
      count: resultados.length,
      data: resultados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda de trámites',
      error: error.message
    });
  }
}

export async function destacados(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const items = await tramiteService.obtenerDestacados(limit);
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener trámites destacados',
      error: error.message
    });
  }
}

export async function obtenerPorSlug(req, res) {
  try {
    const { slug } = req.params;
    const tramite = await tramiteService.obtenerTramitePorSlug(slug);

    if (!tramite) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún trámite con el identificador "${slug}"`
      });
    }

    res.json({
      success: true,
      data: tramite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el trámite',
      error: error.message
    });
  }
}

export async function crear(req, res) {
  try {
    const nuevo = await tramiteService.crearTramite(req.body);
    res.status(201).json({
      success: true,
      message: 'Trámite creado exitosamente',
      data: nuevo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar el trámite',
      error: error.message
    });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await tramiteService.actualizarTramite(id, req.body);
    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Trámite no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Trámite actualizado exitosamente',
      data: actualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el trámite',
      error: error.message
    });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await tramiteService.eliminarTramite(id);
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Trámite no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Trámite desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al desactivar el trámite',
      error: error.message
    });
  }
}
