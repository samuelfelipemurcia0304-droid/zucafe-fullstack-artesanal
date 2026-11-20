// Convierte 19000 en "$19.000"
export const pesos = (numero) => '$' + Number(numero).toLocaleString('es-CO');

// Deja solo los números de un texto: "310 211-8326" → "3102118326"
export const soloNumeros = (texto) => String(texto || '').replace(/\D/g, '');
