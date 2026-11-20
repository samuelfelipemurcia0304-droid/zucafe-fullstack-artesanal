import logo from '../assets/logo.png';
import { NEGOCIO } from '../config';

// Portada: nombre, lema y el logo grande
export default function Hero({ onIr }) {
  return (
    <section id="inicio" className="hero">
      <div className="hero__interno">
        <div className="hero__texto">
          <p className="hero__etiqueta">Café colombiano de altura · Tena, Cundinamarca</p>
          <h1 className="hero__titulo">{NEGOCIO.nombre}</h1>
          <p className="hero__lema">{NEGOCIO.lema}</p>
          <p className="hero__desc">
            Café cultivado bajo sombra a 1.750 metros de altura. Aroma floral, taza brillante y notas frutales cítricas
            para que cada sorbo sea memorable.
          </p>
          <div className="hero__botones">
            <button className="btn btn--primario" onClick={() => onIr('catalogo')}>
              Ver el catálogo
            </button>
            <button className="btn btn--claro" onClick={() => onIr('pedido')}>
              Hacer mi pedido
            </button>
          </div>
        </div>

        <img className="hero__logo" src={logo} alt="Logo de Zucafé: taza de café con granos y hojas" />
      </div>
    </section>
  );
}
