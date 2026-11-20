// Servidor principal de Zucafé: Node.js + Express + MongoDB
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

const app = express();
app.use(cors()); // deja que la página (GitHub Pages) hable con este servidor
app.use(express.json()); // permite leer los datos JSON que llegan

app.get('/', (req, res) => res.send('API de Zucafé funcionando ☕'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/chat', require('./routes/chat'));

// Catálogo que se crea solo la primera vez (después lo editas desde el panel admin)
const CATALOGO_INICIAL = [
  {
    nombre: 'Café Tradicional Zucafé',
    categoria: 'tradicional',
    descripcion: 'El café de todos los días: tostado y molido, para tu tinto o tu filtrado de la mañana.',
    detalles: [],
    precioMedia: 19000,
    precioLibra: 34000,
  },
  {
    nombre: 'Café de Especialidad Zucafé',
    categoria: 'especialidad',
    descripcion:
      'Café de altura cultivado bajo sombra que combina un aroma floral marcado con una taza brillante, dulce y de notas frutales cítricas, pensado para dejar una sensación fresca y memorable en cada sorbo.',
    detalles: [
      'Origen: Tena, Cundinamarca, Colombia (1.750 m.s.n.m.)',
      'Variedad: Caturra',
      'Cultivo: agroforestal bajo sombra',
      'Perfil: aroma floral intenso; sabor frutal cítrico, dulce y brillante',
      'Tostión: media / media alta',
      'Molido: fino / medio',
    ],
    precioMedia: 22000,
    precioLibra: 38000,
  },
];

async function cargarCatalogoInicial() {
  // Borra productos guardados con el formato de la versión anterior del proyecto
  await Producto.deleteMany({ precioLibra: { $exists: false } });
  const total = await Producto.countDocuments();
  if (total === 0) {
    await Producto.insertMany(CATALOGO_INICIAL);
    console.log('☕ Catálogo inicial creado');
  }
}

async function iniciar() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Falta MONGODB_URI. Crea el archivo backend/.env (mira .env.example)');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
    await cargarCatalogoInicial();
    const puerto = process.env.PORT || 3000;
    app.listen(puerto, () => console.log(`✅ Servidor listo en http://localhost:${puerto}`));
  } catch (error) {
    console.error('❌ No se pudo iniciar:', error.message);
    process.exit(1);
  }
}

iniciar();
