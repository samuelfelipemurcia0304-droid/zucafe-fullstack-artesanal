import { pesos } from '../utils';
import fotoKraft from '../assets/cafe-kraft.jpg';
import fotoNegra from '../assets/cafe-negra.jpg';
import fotoRoja from '../assets/cafe-roja.jpg';

// 📷 Qué foto sale en cada tipo de café. Para cambiarla, cambia la foto de arriba por otra.
const FOTO_POR_CATEGORIA = {
  tradicional: fotoKraft,
  especialidad: fotoNegra,
};

// Galería "Nuestras presentaciones": agrega o quita fotos de esta lista
const PRESENTACIONES = [
  { foto: fotoKraft, texto: 'Bolsa kraft con ventana: ves el grano antes de moler' },
  { foto: fotoNegra, texto: 'Bolsa negra de 500 g · Tostión media · Molido medio' },
  { foto: fotoRoja, texto: 'Bolsa roja de 500 g · Elige tu tostión y tu molido' },
];

// Catálogo: una tarjeta por cada producto que llega de la base de datos
export default function Catalogo({ productos, onPedir }) {
  return (
    <section id="catalogo" className="seccion">
      <div className="contenedor">
        <p className="seccion__script">escoge tu favorito</p>
        <h2 className="seccion__titulo">Nuestro catálogo</h2>
        <p className="seccion__intro">Café tostado y molido, en la presentación que prefieras.</p>

        <div className="catalogo__rejilla">
          {productos.map((p) => (
            <article key={p._id} className={'producto producto--' + p.categoria}>
              {FOTO_POR_CATEGORIA[p.categoria] && (
                <img className="producto__foto" src={FOTO_POR_CATEGORIA[p.categoria]} alt={'Bolsa de ' + p.nombre} loading="lazy" />
              )}
              <span className="producto__insignia">{p.categoria === 'especialidad' ? '✨ Especialidad' : '☕ Tradicional'}</span>
              <h3 className="producto__nombre">{p.nombre}</h3>
              <p className="producto__descripcion">{p.descripcion}</p>

              {p.detalles && p.detalles.length > 0 && (
                <ul className="producto__detalles">
                  {p.detalles.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}

              <ul className="producto__precios">
                <li>
                  <span>1/2 libra</span>
                  <strong>{pesos(p.precioMedia)}</strong>
                </li>
                <li>
                  <span>1 libra</span>
                  <strong>{pesos(p.precioLibra)}</strong>
                </li>
              </ul>

              <button className="btn btn--primario btn--bloque" onClick={() => onPedir(p)}>
                Pedir este café
              </button>
            </article>
          ))}
        </div>

        <h3 className="galeria__titulo">Nuestras presentaciones</h3>
        <div className="galeria">
          {PRESENTACIONES.map((f) => (
            <figure key={f.texto} className="galeria__item">
              <img src={f.foto} alt={f.texto} loading="lazy" />
              <figcaption>{f.texto}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
