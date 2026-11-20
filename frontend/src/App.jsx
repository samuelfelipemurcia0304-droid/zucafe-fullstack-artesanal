import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Origen from './components/Origen.jsx';
import Catalogo from './components/Catalogo.jsx';
import FormularioPedido from './components/FormularioPedido.jsx';
import ChatbotIA from './components/ChatbotIA.jsx';
import PanelAdmin from './components/PanelAdmin.jsx';
import { api } from './api';
import { NEGOCIO, PRODUCTOS_RESPALDO } from './config';
import logo from './assets/logo.png';

export default function App() {
  const [vista, setVista] = useState('tienda'); // 'tienda' o 'admin'
  const [productos, setProductos] = useState(PRODUCTOS_RESPALDO);
  const [productoElegido, setProductoElegido] = useState(null);

  // Pide el catálogo al backend. Si falla, se queda el catálogo de respaldo.
  async function cargarProductos() {
    try {
      setProductos(await api('/api/productos'));
    } catch {
      // servidor dormido o apagado: seguimos con el respaldo
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  // Lleva al usuario a una sección (o al panel admin)
  function irA(id) {
    if (id === 'admin') {
      setVista('admin');
      window.scrollTo(0, 0);
      return;
    }
    setVista('tienda');
    setTimeout(() => {
      const seccion = document.getElementById(id);
      if (seccion) seccion.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo(0, 0);
    }, 50);
  }

  // Botón "Pedir este café": elige el producto y baja al formulario
  function pedirProducto(producto) {
    setProductoElegido(producto);
    irA('pedido');
  }

  return (
    <>
      <Navbar vista={vista} onIr={irA} />

      <main>
        {vista === 'admin' ? (
          <PanelAdmin onCambio={cargarProductos} />
        ) : (
          <>
            <Hero onIr={irA} />
            <Origen />
            <Catalogo productos={productos} onPedir={pedirProducto} />
            <FormularioPedido productos={productos} productoElegido={productoElegido} />
          </>
        )}
      </main>

      <footer className="footer">
        <img className="footer__logo" src={logo} alt="Logo de Zucafé" />
        <p className="footer__lema">{NEGOCIO.lema}</p>
        <p>
          WhatsApp:{' '}
          <a href={`https://wa.me/${NEGOCIO.whatsapp}`} target="_blank" rel="noreferrer">
            {NEGOCIO.whatsappBonito}
          </a>
        </p>
        <p className="footer__nota">© {new Date().getFullYear()} Zucafé · Café colombiano de altura</p>
      </footer>

      {vista === 'tienda' && <ChatbotIA />}
    </>
  );
}
