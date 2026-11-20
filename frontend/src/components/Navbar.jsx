import { useState } from 'react';
import logo from '../assets/logo.png';
import { NEGOCIO } from '../config';

// Los enlaces del menú: "id" es el id de la sección a la que lleva
const ENLACES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'origen', texto: 'Origen' },
  { id: 'catalogo', texto: 'Catálogo' },
  { id: 'pedido', texto: 'Pedido' },
];

export default function Navbar({ vista, onIr }) {
  const [abierto, setAbierto] = useState(false); // menú del celular

  function clic(id) {
    setAbierto(false);
    onIr(id);
  }

  return (
    <header className="navbar">
      <div className="navbar__interno">
        <button className="navbar__logo" onClick={() => clic('inicio')}>
          <img src={logo} alt="Logo de Zucafé" />
          <span>{NEGOCIO.nombre}</span>
        </button>

        <button className="navbar__menu-btn" onClick={() => setAbierto(!abierto)} aria-label="Abrir menú">
          {abierto ? '✕' : '☰'}
        </button>

        <nav className={abierto ? 'navbar__enlaces navbar__enlaces--abierto' : 'navbar__enlaces'}>
          {ENLACES.map((e) => (
            <button key={e.id} className="navbar__enlace" onClick={() => clic(e.id)}>
              {e.texto}
            </button>
          ))}
          <button
            className={vista === 'admin' ? 'navbar__enlace navbar__enlace--admin activo' : 'navbar__enlace navbar__enlace--admin'}
            onClick={() => clic('admin')}
          >
            🔒 Admin
          </button>
        </nav>
      </div>
    </header>
  );
}
