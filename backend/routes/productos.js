// Catálogo: cualquiera puede VER (GET); solo el admin puede crear, editar y borrar
const express = require('express');
const Producto = require('../models/Producto');
const verificarAdmin = require('../middleware/verificarAdmin');
const router = express.Router();

// Toma del body solo los campos permitidos
function datosDelBody(body) {
  const datos = {};
  if (body.nombre !== undefined) datos.nombre = String(body.nombre).trim();
  if (body.categoria !== undefined) datos.categoria = body.categoria;
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion).trim();
  if (body.precioMedia !== undefined) datos.precioMedia = Number(body.precioMedia);
  if (body.precioLibra !== undefined) datos.precioLibra = Number(body.precioLibra);
  return datos;
}

const errorDatos = (res) => res.status(400).json({ error: 'Revisa los datos del producto (nombre y precios)' });

// VER catálogo (público)
router.get('/', async (req, res) => {
  try {
    res.json(await Producto.find().sort({ createdAt: 1 }));
  } catch (e) {
    res.status(500).json({ error: 'No se pudo leer el catálogo' });
  }
});

// CREAR producto (admin)
router.post('/', verificarAdmin, async (req, res) => {
  try {
    res.status(201).json(await Producto.create(datosDelBody(req.body)));
  } catch (e) {
    errorDatos(res);
  }
});

// EDITAR producto: nombre, descripción o precios (admin)
router.put('/:id', verificarAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, datosDelBody(req.body), {
      new: true,
      runValidators: true,
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (e) {
    errorDatos(res);
  }
});

// ELIMINAR producto (admin)
router.delete('/:id', verificarAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'No se pudo eliminar el producto' });
  }
});

module.exports = router;
