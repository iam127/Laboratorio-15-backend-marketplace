const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, message: 'Categorías obtenidas correctamente', data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener categorías', data: null });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido', data: null });
    const category = await Category.create({ nombre, descripcion });
    res.status(201).json({ success: true, message: 'Categoría creada correctamente', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear categoría', data: null });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada', data: null });
    await category.destroy();
    res.json({ success: true, message: 'Categoría eliminada correctamente', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar categoría', data: null });
  }
};