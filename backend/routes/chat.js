// 🤖 Chatbot de atención de Zucafé
//
// Cómo funciona (es sencillo):
//   1. Limpia el mensaje (minúsculas, sin tildes ni signos).
//   2. Cada TEMA de la lista "temas" tiene palabras clave. Se cuentan cuántas aparecen.
//   3. Gana el tema con más coincidencias y se responde con su texto.
//   Un asterisco al final de la palabra (preci*) significa "cualquier palabra que empiece así":
//   preci* sirve para precio, precios, preciosa...
//
// Para enseñarle algo nuevo: agrega un tema a la lista con sus palabras y su respuesta.
// Los precios salen en vivo de MongoDB, y horario/ubicación salen de negocio.js.

const express = require('express');
const Producto = require('../models/Producto');
const negocio = require('../negocio');
const router = express.Router();

const pesos = (n) => '$' + Number(n).toLocaleString('es-CO');

// Deja el texto en minúsculas, sin tildes ni signos, con un espacio al inicio y al final
function normalizar(texto) {
  const limpio = String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return ' ' + limpio + ' ';
}

// ¿El texto contiene esta palabra? (con * al final: cualquier palabra que empiece así)
function contiene(texto, palabra) {
  if (palabra.endsWith('*')) return texto.includes(' ' + palabra.slice(0, -1));
  return texto.includes(' ' + palabra + ' ');
}

const hay = (texto, palabras) => palabras.some((p) => contiene(texto, p));
const lineaPrecio = (p) => `• ${p.nombre}\n   1/2 libra: ${pesos(p.precioMedia)}  ·  1 libra: ${pesos(p.precioLibra)}`;

// ---------- Respuestas que se reutilizan ----------
const respuestaEnvios = () =>
  `🚚 ${negocio.envios}\nEn el formulario de pedido puedes escribir tu lugar de entrega (es opcional) o lo coordinamos por WhatsApp.`;

const respuestaContacto = () => `💬 Escríbenos por WhatsApp al ${negocio.whatsappBonito}\nhttps://wa.me/${negocio.whatsapp}`;

const TEMAS_QUE_SE_PUEDEN_PREGUNTAR =
  'precios, horario, ubicación y entregas, cómo hacer tu pedido, el origen de nuestro café, cuál te recomiendo, cómo prepararlo y cómo guardarlo';

// ---------- Los temas (puedes agregar más) ----------
const temas = [
  {
    nombre: 'precios',
    palabras: ['preci*', 'cuest*', 'valor*', 'cuant*', 'costo*', 'vale', 'valen', 'pesos', 'plata', 'libra*', 'kilo*'],
    responder: (t, productos) => {
      // "¿cuánto cuesta el envío?" se parece a precios, pero es de envíos
      if (hay(t, ['envi*', 'domicilio*'])) return respuestaEnvios();
      if (!productos.length) return `Escríbenos por WhatsApp (${negocio.whatsappBonito}) y te confirmamos los precios.`;

      let lista = productos;
      if (hay(t, ['especialidad', 'especial'])) lista = productos.filter((p) => p.categoria === 'especialidad');
      else if (hay(t, ['tradicional'])) lista = productos.filter((p) => p.categoria === 'tradicional');
      if (!lista.length) lista = productos;

      let r = 'Estos son nuestros precios ☕\n' + lista.map(lineaPrecio).join('\n') + '\n\n(1 libra = 500 g)';
      if (hay(t, ['kilo*'])) r += '\nSi quieres 1 kilo, elígelo en el pedido y te confirmamos el valor por WhatsApp.';
      return r;
    },
  },
  {
    nombre: 'pedido',
    palabras: ['pedido*', 'pedir', 'comprar', 'compra', 'compro', 'ordenar', 'encargar', 'encargo', 'reservar', 'como hago', 'formulario'],
    responder: () =>
      'Hacer tu pedido es muy fácil 🙌\n' +
      '1. Ve a la sección "Haz tu pedido" de esta página.\n' +
      '2. Escribe tu nombre y tu WhatsApp.\n' +
      '3. Elige el café, la presentación (1/2 libra, 1 libra o 1 kilo) y la cantidad.\n' +
      '4. Si quieres, escribe tu lugar de entrega (es opcional).\n\n' +
      `Te escribimos por WhatsApp para confirmar. También puedes pedir directo al ${negocio.whatsappBonito}.`,
  },
  {
    nombre: 'envios',
    palabras: ['envi*', 'domicilio*', 'entreg*', 'llega*', 'despach*', 'mandan', 'mandar', 'mensajeria', 'flete*', 'demora*', 'tarda*'],
    responder: () => respuestaEnvios(),
  },
  {
    nombre: 'ubicacion',
    palabras: ['ubicacion', 'ubicad*', 'ubican', 'donde estan', 'donde se ubican', 'donde los encuentro', 'direccion', 'queda*', 'local', 'tienda', 'sede', 'visitar', 'recoger'],
    responder: () => `📍 ${negocio.ubicacion}\n\n${negocio.envios}`,
  },
  {
    nombre: 'horario',
    palabras: ['horari*', 'hora', 'horas', 'abren', 'abre', 'abierto', 'atienden', 'atencion', 'cierran', 'cierra', 'domingo*', 'sabado*', 'festivo*'],
    responder: () => `🕗 Nuestro horario de atención: ${negocio.horario}\nTambién puedes escribirnos por WhatsApp al ${negocio.whatsappBonito}.`,
  },
  {
    nombre: 'pagos',
    palabras: ['pago*', 'pagar', 'nequi', 'daviplata', 'transferencia*', 'efectivo', 'tarjeta*', 'bancolombia', 'contraentrega', 'medios de pago'],
    responder: () => `💳 ${negocio.pagos}`,
  },
  {
    nombre: 'catalogo',
    palabras: ['producto*', 'catalogo', 'tienen', 'venden', 'ofrecen', 'cafes', 'variedades', 'tipos', 'tradicional'],
    responder: (t, productos) => {
      if (!productos.length) return 'Tenemos café tradicional y café de especialidad. Mira la sección "Catálogo" de esta página ☕';
      const resumen = (p) => (p.descripcion.length > 90 ? p.descripcion.slice(0, 90) + '…' : p.descripcion);
      return (
        'Esto es lo que tenemos ☕\n\n' +
        productos.map((p) => `${lineaPrecio(p)}\n   ${resumen(p)}`).join('\n\n') +
        '\n\nPregúntame por el origen del café o cuál te conviene más.'
      );
    },
  },
  {
    nombre: 'origen',
    palabras: ['origen', 'de donde viene', 'de donde es', 'tena','cundinamarca', 'altura', 'altitud', 'msnm', 'caturra', 'sombra', 'agroforestal', 'finca', 'cultivo*', 'cosecha*', 'perfil', 'aroma', 'sabor', 'taza', 'especialidad', 'floral', 'citric*', 'frutal*', 'notas'],
    responder: (t, productos) => {
      const esp = productos.find((p) => p.categoria === 'especialidad');
      if (esp && esp.detalles && esp.detalles.length) {
        return `Así es nuestro café de especialidad 🌸🍊\n${esp.detalles.map((d) => '• ' + d).join('\n')}\n\n${esp.descripcion}`;
      }
      return 'Nuestro café de especialidad viene de Tena, Cundinamarca, cultivado bajo sombra a 1.750 m.s.n.m. Tiene aroma floral intenso y un sabor frutal cítrico, dulce y brillante 🌸🍊';
    },
  },
  {
    nombre: 'molido',
    palabras: ['molido', 'molida', 'moler', 'grano*', 'tostion', 'tostado', 'tostar', 'fino', 'oscuro'],
    responder: () =>
      'En nuestro café de especialidad puedes elegir ☕\n' +
      '• Tostión: media o media alta\n' +
      '• Molido: fino o medio (para colar o filtrar, el medio es ideal)\n\n' +
      'Si lo prefieres en grano para moler en casa, avísanos en tu pedido o por WhatsApp.',
  },
  {
    nombre: 'preparar',
    palabras: ['prepar*', 'colar', 'cola', 'filtr*', 'v60', 'chemex', 'prensa', 'francesa', 'moka', 'italiana', 'cafetera*', 'espresso', 'receta*', 'gramos', 'agua', 'temperatura', 'cuchara*', 'tinto'],
    responder: () =>
      'Para preparar un buen café ☕\n' +
      '• Proporción: unos 60 g de café por litro de agua (más o menos 2 cucharadas por taza).\n' +
      '• Agua caliente pero sin hervir a borbotones: espera unos 30 segundos después de que hierva (90–96 °C).\n' +
      '• Molido medio para colar o filtrar; molido fino para cafetera moka o espresso.\n' +
      '• Sirve recién hecho y disfruta el aroma.',
  },
  {
    nombre: 'conservar',
    palabras: ['guard*', 'conserv*', 'nevera', 'congelar', 'vence*', 'vencimiento', 'dura', 'duracion', 'fresco', 'abierto'],
    responder: () =>
      'Para conservar su aroma 🌿\n' +
      '• Guárdalo bien cerrado, en un lugar fresco y seco, lejos de la luz y el calor.\n' +
      '• Evita la nevera: la humedad le quita sabor.\n' +
      '• Para más aroma, muele solo lo que vayas a usar (por eso también lo tenemos en grano).',
  },
  {
    nombre: 'contacto',
    palabras: ['whatsapp', 'wasap', 'contacto', 'telefono', 'celular', 'numero', 'llamar', 'escribir', 'hablar', 'asesor*', 'persona', 'humano'],
    responder: () => respuestaContacto(),
  },
  {
    nombre: 'recomendar',
    palabras: ['recomien*', 'recomend*', 'sugier*', 'sugerenc*', 'cual', 'diferencia*', 'mejor', 'suave', 'fuerte', 'amargo', 'acido', 'dulce', 'regalo*', 'regalar', 'principiante', 'clasico', 'economico', 'barato', 'diario'],
    responder: (t, productos) => {
      const esp = productos.find((p) => p.categoria === 'especialidad');
      const trad = productos.find((p) => p.categoria === 'tradicional');
      const precio = (p) => (p ? ` (desde ${pesos(p.precioMedia)})` : '');

      if (hay(t, ['suave', 'aromatic*', 'dulce', 'acido', 'regalo*', 'regalar', 'especial'])) {
        return `Te recomiendo el Café de especialidad${precio(esp)} 🌸🍊\nTiene aroma floral intenso y una taza dulce y brillante con notas cítricas. Queda delicioso filtrado, y es un gran regalo.`;
      }
      if (hay(t, ['clasico', 'economico', 'barato', 'diario', 'tinto', 'fuerte', 'amargo'])) {
        return `Te recomiendo el Café tradicional${precio(trad)} ☕\nEs el café de todos los días, ideal para tu tinto de siempre y más económico.`;
      }
      return (
        'Te ayudo a escoger 😊\n\n' +
        `• Café de especialidad${precio(esp)}: aroma floral, taza dulce y notas cítricas. Ideal para filtrado y para regalar.\n` +
        `• Café tradicional${precio(trad)}: el café de todos los días, para tu tinto de siempre.\n\n` +
        'Cuéntame: ¿lo prefieres suave y aromático, o clásico y económico?'
      );
    },
  },
  {
    nombre: 'gracias',
    palabras: ['gracias', 'chao', 'adios', 'hasta luego', 'bye', 'perfecto', 'excelente', 'genial'],
    responder: () => '¡Con mucho gusto! ☕ Que disfrutes tu café. Si necesitas algo más, aquí estaré.',
  },
  {
    nombre: 'ayuda',
    palabras: ['ayuda', 'ayudame', 'quien eres', 'que eres', 'que haces', 'que puedes', 'menu', 'opciones', 'que sabes'],
    responder: () => `Soy el asistente de Zucafé ☕ Puedo ayudarte con: ${TEMAS_QUE_SE_PUEDEN_PREGUNTAR}.`,
  },
  {
    nombre: 'saludo',
    peso: 1, // vale menos: si dicen "hola, cuánto cuesta", gana "precios"
    palabras: ['hola', 'holi', 'buenas', 'buenos', 'hey', 'saludos', 'alo'],
    responder: () => `¡Hola! Bienvenido a Zucafé, "un sabor para no olvidar" ☕\nPuedo ayudarte con: ${TEMAS_QUE_SE_PUEDEN_PREGUNTAR}. ¿Qué quieres saber?`,
  },
];

// Elige el tema con más palabras clave encontradas
function responder(mensaje, productos) {
  const t = normalizar(mensaje);
  let mejor = null;
  let mejorPuntos = 0;

  for (const tema of temas) {
    const coincidencias = tema.palabras.filter((p) => contiene(t, p)).length;
    const puntos = coincidencias * (tema.peso || 2);
    if (puntos > mejorPuntos) {
      mejor = tema;
      mejorPuntos = puntos;
    }
  }

  if (mejor) return mejor.responder(t, productos);
  return `No estoy seguro de haberte entendido 🤔\nPuedes preguntarme por: ${TEMAS_QUE_SE_PUEDEN_PREGUNTAR}.\nO escríbenos por WhatsApp al ${negocio.whatsappBonito}.`;
}

// ---------- OPCIONAL: IA real con Claude ----------
// Solo se usa si pones ANTHROPIC_API_KEY en el .env. Si no, se usan las respuestas de arriba.
async function responderConIA(mensaje, historial, productos) {
  const catalogo = productos
    .map((p) => `- ${p.nombre}: 1/2 libra ${pesos(p.precioMedia)}, 1 libra ${pesos(p.precioLibra)}. ${(p.detalles || []).join('. ')}`)
    .join('\n');

  const system =
    'Eres el asistente virtual de Zucafé, una marca colombiana de café ("Un sabor para no olvidar"). ' +
    'Respondes en español, con tono cálido y breve (máximo 4 frases). Solo hablas de Zucafé: precios, productos, horario, ubicación, entregas y cómo pedir. ' +
    'Si no sabes algo, invita a escribir por WhatsApp. No inventes datos.\n\n' +
    `CATÁLOGO:\n${catalogo}\n\nHORARIO: ${negocio.horario}\nUBICACIÓN: ${negocio.ubicacion}\nENTREGAS: ${negocio.envios}\n` +
    `PAGOS: ${negocio.pagos}\nWHATSAPP: ${negocio.whatsappBonito}\n` +
    'CÓMO PEDIR: formulario "Haz tu pedido" (nombre, WhatsApp, producto, cantidad, presentación 1/2 libra, 1 libra o 1 kilo, lugar de entrega opcional).';

  // Mensajes alternados user/assistant, empezando por el usuario
  const mensajes = [];
  const agregar = (role, content) => {
    const ultimo = mensajes[mensajes.length - 1];
    if (ultimo && ultimo.role === role) ultimo.content += '\n' + content;
    else mensajes.push({ role, content });
  };
  for (const h of historial) {
    const role = h.rol === 'user' ? 'user' : 'assistant';
    if (mensajes.length === 0 && role === 'assistant') continue;
    agregar(role, String(h.texto || '').slice(0, 500));
  }
  agregar('user', mensaje);

  const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 400, system, messages: mensajes }),
  });
  if (!respuesta.ok) throw new Error('La IA respondió con error ' + respuesta.status);
  const data = await respuesta.json();
  const texto = data.content && data.content.find((b) => b.type === 'text');
  if (!texto) throw new Error('Respuesta vacía de la IA');
  return texto.text;
}

// POST /api/chat  →  { mensaje: "hola", historial: [...] }  →  { respuesta: "..." }
router.post('/', async (req, res) => {
  const mensaje = String(req.body.mensaje || '').trim().slice(0, 500);
  if (!mensaje) return res.status(400).json({ error: 'Escribe un mensaje' });
  const historial = Array.isArray(req.body.historial) ? req.body.historial.slice(-6) : [];

  let productos = [];
  try {
    productos = await Producto.find().sort({ createdAt: 1 }).lean();
  } catch (e) {
    console.error('Chat: no se pudo leer el catálogo', e.message);
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return res.json({ respuesta: await responderConIA(mensaje, historial, productos) });
    } catch (e) {
      console.error('Chat con IA falló, uso respuestas programadas:', e.message);
    }
  }
  res.json({ respuesta: responder(mensaje, productos) });
});

module.exports = router;
module.exports.responder = responder; // se exporta para poder probarlo
