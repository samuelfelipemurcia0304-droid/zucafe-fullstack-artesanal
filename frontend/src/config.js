// ✏️ AQUÍ EDITAS LOS DATOS PRINCIPALES DE LA PÁGINA

export const NEGOCIO = {
  nombre: 'Zucafé',
  lema: 'Un sabor para no olvidar',
  // WhatsApp: con 57 al inicio, sin "+" ni espacios
  whatsapp: '573102118326',
  whatsappBonito: '310 211 8326',
};

// 🌐 Dirección del servidor (backend)
//  - Mientras programas en tu computador usa el servidor local.
//  - Cuando publiques el backend en Render, pega aquí su dirección (sin "/" al final).
export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://zucafe-api.onrender.com';

// 🛟 Catálogo de respaldo: se muestra si el servidor está dormido o apagado.
// (Los precios reales los editas en el panel admin; estos solo son el plan B.)
export const PRODUCTOS_RESPALDO = [
  {
    _id: 'respaldo-1',
    nombre: 'Café Tradicional Zucafé',
    categoria: 'tradicional',
    descripcion: 'El café de todos los días: tostado y molido, para tu tinto o tu filtrado de la mañana.',
    detalles: [],
    precioMedia: 19000,
    precioLibra: 34000,
  },
  {
    _id: 'respaldo-2',
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
