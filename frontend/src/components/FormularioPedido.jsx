import { useState, useEffect } from 'react';
import { api } from '../api';
import { NEGOCIO } from '../config';
import { soloNumeros } from '../utils';

const PRESENTACIONES = ['1/2 libra', '1 libra', '1 kilo'];

// Formulario de pedido: lo que escribe el cliente se guarda en MongoDB
export default function FormularioPedido({ productos, productoElegido }) {
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [producto, setProducto] = useState(productos[0] ? productos[0].nombre : '');
  const [presentacion, setPresentacion] = useState('1 libra');
  const [cantidad, setCantidad] = useState(1);
  const [lugarEntrega, setLugarEntrega] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(null); // guarda lo enviado para mostrar el "gracias"

  // Si el cliente tocó "Pedir este café", se elige ese producto
  useEffect(() => {
    if (productoElegido) setProducto(productoElegido.nombre);
  }, [productoElegido]);

  // Si todavía no hay producto elegido, usa el primero de la lista
  useEffect(() => {
    if (!producto && productos[0]) setProducto(productos[0].nombre);
  }, [productos]);

  async function enviar(evento) {
    evento.preventDefault(); // evita que la página se recargue
    setEnviando(true);
    setError('');
    try {
      const datos = { nombre, whatsapp, producto, presentacion, cantidad: Number(cantidad), lugarEntrega };
      await api('/api/pedidos', { method: 'POST', body: datos });
      setEnviado(datos);
      setNombre('');
      setWhatsapp('');
      setCantidad(1);
      setLugarEntrega('');
    } catch (e) {
      setError(e.message);
    }
    setEnviando(false);
  }

  // Mensaje listo para mandarnos por WhatsApp
  function enlaceWhatsApp(d) {
    const texto = `Hola Zucafé ☕, soy ${d.nombre}. Quiero ${d.cantidad} x ${d.producto} (${d.presentacion}).${
      d.lugarEntrega ? ' Entrega en: ' + d.lugarEntrega + '.' : ''
    }`;
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  return (
    <section id="pedido" className="seccion seccion--oscura">
      <div className="contenedor contenedor--angosto">
        <p className="seccion__script seccion__script--claro">escríbenos y te lo llevamos</p>
        <h2 className="seccion__titulo">Haz tu pedido</h2>

        {enviado ? (
          <div className="exito">
            <p className="exito__icono">🎉</p>
            <h3>¡Pedido recibido, {enviado.nombre}!</h3>
            <p>Te escribiremos por WhatsApp para confirmar tu café y la entrega.</p>
            <a className="btn btn--primario" href={enlaceWhatsApp(enviado)} target="_blank" rel="noreferrer">
              Escribir ya por WhatsApp
            </a>
            <button className="btn btn--claro" onClick={() => setEnviado(null)}>
              Hacer otro pedido
            </button>
          </div>
        ) : (
          <form className="formulario" onSubmit={enviar}>
            <label>
              Nombre
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required maxLength={80} />
            </label>

            <label>
              WhatsApp
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: 310 211 8326"
                inputMode="tel"
                required
                maxLength={20}
              />
            </label>

            <label>
              Producto
              <select value={producto} onChange={(e) => setProducto(e.target.value)} required>
                {productos.map((p) => (
                  <option key={p._id} value={p.nombre}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>

            <div className="formulario__fila">
              <label>
                Presentación
                <select value={presentacion} onChange={(e) => setPresentacion(e.target.value)}>
                  {PRESENTACIONES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                Cantidad
                <input type="number" min="1" max="100" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
              </label>
            </div>

            <label>
              Lugar de entrega <span className="opcional">(opcional)</span>
              <input
                value={lugarEntrega}
                onChange={(e) => setLugarEntrega(e.target.value)}
                placeholder="Barrio, ciudad… o lo coordinamos por WhatsApp"
                maxLength={200}
              />
            </label>

            {error && <p className="alerta">{error}</p>}

            <button className="btn btn--primario btn--bloque" type="submit" disabled={enviando || soloNumeros(whatsapp).length < 7}>
              {enviando ? 'Enviando…' : 'Enviar pedido'}
            </button>
            <p className="formulario__nota">
              ¿Prefieres hablar directo?{' '}
              <a href={`https://wa.me/${NEGOCIO.whatsapp}`} target="_blank" rel="noreferrer">
                Escríbenos por WhatsApp
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
