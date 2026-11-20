// Cómo se guarda un café en MongoDB
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 120 },
    categoria: { type: String, enum: ['tradicional', 'especialidad'], default: 'tradicional' },
    descripcion: { type: String, trim: true, maxlength: 1000, default: '' },
    detalles: { type: [String], default: [] }, // lista: origen, variedad, perfil...
    precioMedia: { type: Number, required: true, min: 0 }, // precio de 1/2 libra
    precioLibra: { type: Number, required: true, min: 0 }, // precio de 1 libra
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);
