// Cómo se guarda un pedido / mensaje de contacto en MongoDB
const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 80 },
    whatsapp: { type: String, required: true, trim: true, maxlength: 20 },
    producto: { type: String, required: true, trim: true, maxlength: 120 },
    presentacion: { type: String, required: true, trim: true, maxlength: 40 }, // 1/2 libra, 1 libra, 1 kilo
    cantidad: { type: Number, required: true, min: 1, max: 100 },
    lugarEntrega: { type: String, trim: true, maxlength: 200, default: '' }, // opcional
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pedido', pedidoSchema);
