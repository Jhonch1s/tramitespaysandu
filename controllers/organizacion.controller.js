import * as orgService from '../services/organizacion.service.js';

export async function listar(req, res) {
  try {
    const soloActivas = req.query.todas !== 'true';
    const organizaciones = await orgService.listarOrganizaciones(soloActivas);
    res.json({
      success: true,
      count: organizaciones.length,
      data: organizaciones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener organizaciones',
      error: error.message
    });
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;
    const org = await orgService.obtenerOrganizacionPorId(id);
    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }
    res.json({
      success: true,
      data: org
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar la organización',
      error: error.message
    });
  }
}

export async function crear(req, res) {
  try {
    const nueva = await orgService.crearOrganizacion(req.body);
    res.status(201).json({
      success: true,
      message: 'Organización creada exitosamente',
      data: nueva
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la organización',
      error: error.message
    });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const actualizada = await orgService.actualizarOrganizacion(id, req.body);
    if (!actualizada) {
      return res.status(404).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Organización actualizada exitosamente',
      data: actualizada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la organización',
      error: error.message
    });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const eliminada = await orgService.eliminarOrganizacion(id);
    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Organización desactivada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al desactivar la organización',
      error: error.message
    });
  }
}
