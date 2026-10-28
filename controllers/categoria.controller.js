import * as catService from '../services/categoria.service.js';

export async function listar(req, res) {
  try {
    const conConteo = req.query.conConteo !== 'false';
    const categorias = await catService.listarCategorias(conConteo);
    res.json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
}

export async function obtenerPorSlug(req, res) {
  try {
    const { slug } = req.params;
    const cat = await catService.obtenerCategoriaPorSlug(slug);
    if (!cat) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      data: cat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar la categoría',
      error: error.message
    });
  }
}

export async function crear(req, res) {
  try {
    const nueva = await catService.crearCategoria(req.body);
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nueva
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la categoría',
      error: error.message
    });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const actualizada = await catService.actualizarCategoria(id, req.body);
    if (!actualizada) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: actualizada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const eliminada = await catService.eliminarCategoria(id);
    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Categoría desactivada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al desactivar la categoría',
      error: error.message
    });
  }
}
