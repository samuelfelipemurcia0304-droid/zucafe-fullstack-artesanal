import { API_URL } from './config';

// Función para hablar con el backend.
// Ejemplo: api('/api/productos')  o  api('/api/pedidos', { method: 'POST', body: {...} })
export async function api(ruta, { method = 'GET', body, token } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Intenta de nuevo en un momento.');
  }

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.error || 'Ocurrió un error. Intenta de nuevo.');
    error.status = respuesta.status;
    throw error;
  }
  return datos;
}
