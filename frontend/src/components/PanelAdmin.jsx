import { useState, useEffect } from 'react';
import { api } from '../api';
import { pesos, soloNumeros } from '../utils';

const CLAVE_TOKEN = 'zucafe_token';

/* ---------- 1. LOGIN ---------- */
function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setCargando(true);
    setError('');
    try {
      const datos = await api('/api/auth/login', { method: 'POST', body: { usuario, clave } });
      onEntrar(datos.token);
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  }

  return (
    <div className="admin__login">
      <h2 className="seccion__titulo">Panel de Zucafé</h2>
      <p className="seccion__intro">Zona privada para gestionar pedidos y catálogo.</p>
      <form className="formulario formulario--claro" onSubmit={enviar}>
        <label>
          Usuario
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="alerta">{error}</p>}
        <button className="btn btn--primario btn--bloque" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

/* ---------- 2. LISTA DE PEDIDOS ---------- */
function ListaPedidos({ token, onSalir }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargar() {
    try {
      setPedidos(await api('/api/pedidos', { token }));
      setError('');
    } catch (e) {
      if (e.status === 401) onSalir(); // sesión vencida
      else setError(e.message);
    }
    setCargando(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este pedido?')) return;
    try {
      await api('/api/pedidos/' + id, { method: 'DELETE', token });
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  if (cargando) return <p className="estado">Cargando pedidos…</p>;

  return (
    <div>
      <div className="admin__barra">
        <h3>Pedidos y mensajes ({pedidos.length})</h3>
        <button className="btn btn--borde btn--chico" onClick={cargar}>
          ↻ Actualizar
        </button>
      </div>
      {error && <p className="alerta">{error}</p>}
      {pedidos.length === 0 && <p className="estado">Aún no hay pedidos. ¡Pronto llegarán! ☕</p>}

      <div className="admin__lista">
        {pedidos.map((p) => (
          <article key={p._id} className="tarjeta">
            <div className="tarjeta__cabecera">
              <strong>{p.nombre}</strong>
              <span className="tarjeta__fecha">{new Date(p.createdAt).toLocaleString('es-CO')}</span>
            </div>
            <p>
              <strong>{p.cantidad} ×</strong> {p.producto} · {p.presentacion}
            </p>
            <p>📍 {p.lugarEntrega || 'Entrega por coordinar'}</p>
            <p>
              💬{' '}
              <a href={'https://wa.me/' + soloNumeros(p.whatsapp)} target="_blank" rel="noreferrer">
                {p.whatsapp}
              </a>
            </p>
            <div className="tarjeta__acciones">
              <button className="btn btn--peligro btn--chico" onClick={() => eliminar(p._id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3. UN PRODUCTO EDITABLE ---------- */
function ProductoEditable({ producto, token, onListo, onError }) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [precioMedia, setPrecioMedia] = useState(producto.precioMedia);
  const [precioLibra, setPrecioLibra] = useState(producto.precioLibra);

  async function guardar() {
    try {
      await api('/api/productos/' + producto._id, {
        method: 'PUT',
        token,
        body: { nombre, descripcion, precioMedia, precioLibra },
      });
      onListo('Cambios guardados ✅');
    } catch (e) {
      onError(e);
    }
  }

  async function eliminar() {
    if (!window.confirm('¿Eliminar "' + producto.nombre + '" del catálogo?')) return;
    try {
      await api('/api/productos/' + producto._id, { method: 'DELETE', token });
      onListo('Producto eliminado');
    } catch (e) {
      onError(e);
    }
  }

  return (
    <article className="tarjeta">
      <label>
        Nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label>
        Descripción
        <textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </label>
      <div className="formulario__fila">
        <label>
          Precio 1/2 libra <small>({pesos(precioMedia || 0)})</small>
          <input type="number" min="0" step="500" value={precioMedia} onChange={(e) => setPrecioMedia(e.target.value)} />
        </label>
        <label>
          Precio 1 libra <small>({pesos(precioLibra || 0)})</small>
          <input type="number" min="0" step="500" value={precioLibra} onChange={(e) => setPrecioLibra(e.target.value)} />
        </label>
      </div>
      <div className="tarjeta__acciones">
        <button className="btn btn--primario btn--chico" onClick={guardar}>
          Guardar cambios
        </button>
        <button className="btn btn--peligro btn--chico" onClick={eliminar}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

/* ---------- 4. LISTA DE PRODUCTOS + AGREGAR ---------- */
function ListaProductos({ token, onSalir, onCambio }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nuevo, setNuevo] = useState({ nombre: '', categoria: 'tradicional', descripcion: '', precioMedia: '', precioLibra: '' });

  async function cargar() {
    try {
      setProductos(await api('/api/productos'));
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  function manejarError(e) {
    if (e.status === 401) onSalir();
    else setError(e.message);
  }

  function terminado(texto) {
    setError('');
    setMensaje(texto);
    cargar(); // recarga esta lista
    onCambio(); // y también el catálogo de la página
  }

  async function agregar(evento) {
    evento.preventDefault();
    try {
      await api('/api/productos', { method: 'POST', token, body: nuevo });
      setNuevo({ nombre: '', categoria: 'tradicional', descripcion: '', precioMedia: '', precioLibra: '' });
      terminado('Producto agregado ✅');
    } catch (e) {
      manejarError(e);
    }
  }

  function cambiar(campo, valor) {
    setNuevo({ ...nuevo, [campo]: valor });
  }

  if (cargando) return <p className="estado">Cargando catálogo…</p>;

  return (
    <div>
      <h3>Productos del catálogo ({productos.length})</h3>
      {error && <p className="alerta">{error}</p>}
      {mensaje && <p className="aviso">{mensaje}</p>}

      <div className="admin__lista">
        {productos.map((p) => (
          <ProductoEditable key={p._id} producto={p} token={token} onListo={terminado} onError={manejarError} />
        ))}
      </div>

      <h3>➕ Agregar producto</h3>
      <form className="formulario formulario--claro" onSubmit={agregar}>
        <label>
          Nombre
          <input value={nuevo.nombre} onChange={(e) => cambiar('nombre', e.target.value)} required maxLength={120} />
        </label>
        <label>
          Categoría
          <select value={nuevo.categoria} onChange={(e) => cambiar('categoria', e.target.value)}>
            <option value="tradicional">Tradicional</option>
            <option value="especialidad">Especialidad</option>
          </select>
        </label>
        <label>
          Descripción
          <textarea rows={3} value={nuevo.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} maxLength={1000} />
        </label>
        <div className="formulario__fila">
          <label>
            Precio 1/2 libra
            <input type="number" min="0" step="500" value={nuevo.precioMedia} onChange={(e) => cambiar('precioMedia', e.target.value)} required />
          </label>
          <label>
            Precio 1 libra
            <input type="number" min="0" step="500" value={nuevo.precioLibra} onChange={(e) => cambiar('precioLibra', e.target.value)} required />
          </label>
        </div>
        <button className="btn btn--primario btn--bloque">Agregar al catálogo</button>
      </form>
    </div>
  );
}

/* ---------- 5. EL PANEL COMPLETO ---------- */
export default function PanelAdmin({ onCambio }) {
  const [token, setToken] = useState(sessionStorage.getItem(CLAVE_TOKEN) || '');
  const [pestana, setPestana] = useState('pedidos');

  function entrar(nuevoToken) {
    sessionStorage.setItem(CLAVE_TOKEN, nuevoToken);
    setToken(nuevoToken);
  }

  function salir() {
    sessionStorage.removeItem(CLAVE_TOKEN);
    setToken('');
  }

  return (
    <section className="seccion admin">
      <div className="contenedor contenedor--medio">
        {!token ? (
          <Login onEntrar={entrar} />
        ) : (
          <>
            <div className="admin__encabezado">
              <h2 className="seccion__titulo">Panel de gestión</h2>
              <button className="btn btn--borde btn--chico" onClick={salir}>
                Cerrar sesión
              </button>
            </div>

            <div className="admin__pestanas">
              <button className={pestana === 'pedidos' ? 'activa' : ''} onClick={() => setPestana('pedidos')}>
                📋 Pedidos
              </button>
              <button className={pestana === 'productos' ? 'activa' : ''} onClick={() => setPestana('productos')}>
                ☕ Catálogo
              </button>
            </div>

            {pestana === 'pedidos' ? (
              <ListaPedidos token={token} onSalir={salir} />
            ) : (
              <ListaProductos token={token} onSalir={salir} onCambio={onCambio} />
            )}
          </>
        )}
      </div>
    </section>
  );
}
