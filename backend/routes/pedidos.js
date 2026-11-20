// Pedidos: cualquiera puede ENVIAR uno (POST); solo el admin puede verlos y borrarlos
const express = require('express');
const Pedido = require('../models/Pedido');
const verificarAdmin = require('../middleware/verificarAdmin');
const router = express.Router();

// ENVIAR pedido (público): lo que llega del formulario de la página
router.post('/', async (req, res) => {
  const { nombre, whatsapp, producto, presentacion, cantidad, lugarEntrega } = req.body;
  const telefono = String(whatsapp || '').replace(/\D/g, ''); // deja solo los números
  const cant = Number.parseInt(cantidad, 10);

  if (!String(nombre || '').trim()) return res.status(400).json({ error: 'Escribe tu nombre' });
  if (telefono.length < 7) return res.status(400).json({ error: 'Escribe un número de WhatsApp válido' });
  if (!producto) return res.status(400).json({ error: 'Elige un producto' });
  if (!presentacion) return res.status(400).json({ error: 'Elige la presentación' });
  if (!(cant >= 1 && cant <= 100)) return res.status(400).json({ error: 'La cantidad debe estar entre 1 y 100' });

  try {
    const pedido = await Pedido.create({
      nombre: String(nombre).trim(),
      whatsapp: telefono,
      producto,
      presentacion,
      cantidad: cant,
      lugarEntrega: String(lugarEntrega || '').trim(),
    });
    res.status(201).json({ ok: true, id: pedido._id });
  } catch (e) {
    console.error(e.message);
    const datosMalos = e.name === 'ValidationError';
    res.status(datosMalos ? 400 : 500).json({
      error: datosMalos ? 'Revisa los datos del formulario' : 'No pudimos guardar tu pedido. Intenta de nuevo.',
    });
  }
});

// VER pedidos (admin): los más nuevos primero
router.get('/', verificarAdmin, async (req, res) => {
  try {
    res.json(await Pedido.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron leer los pedidos' });
  }
});

// ELIMINAR pedido (admin)
router.delete('/:id', verificarAdmin, async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'No se pudo eliminar el pedido' });
  }
});

module.exports = router;
