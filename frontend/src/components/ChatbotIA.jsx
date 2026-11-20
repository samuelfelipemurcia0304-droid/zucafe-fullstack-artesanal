import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

const SUGERENCIAS = ['¿Qué precios tienen?', '¿Cuál es el horario?', '¿Dónde están ubicados?', '¿Cuál café me recomiendas?'];

const BIENVENIDA = {
  rol: 'bot',
  texto: '¡Hola! Soy el asistente de Zucafé ☕ Te ayudo con precios, horarios, ubicación, pedidos y a escoger tu café. ¿Qué quieres saber?',
};

// Convierte los enlaces (https://...) del texto en enlaces en los que se puede hacer clic
function Texto({ texto }) {
  return texto.split(/(https?:\/\/\S+)/g).map((parte, i) =>
    parte.startsWith('http') ? (
      <a key={i} href={parte} target="_blank" rel="noreferrer">
        {parte}
      </a>
    ) : (
      parte
    )
  );
}

// Chat flotante: el mensaje viaja al backend (/api/chat) y vuelve la respuesta
export default function ChatbotIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([BIENVENIDA]);
  const [escrito, setEscrito] = useState('');
  const [esperando, setEsperando] = useState(false);
  const final = useRef(null);

  // Cada vez que llega un mensaje, baja hasta el último
  useEffect(() => {
    if (final.current) final.current.scrollIntoView({ block: 'end' });
  }, [mensajes, abierto, esperando]);

  async function enviar(texto) {
    const mensaje = texto.trim();
    if (!mensaje || esperando) return;

    const conPregunta = [...mensajes, { rol: 'user', texto: mensaje }];
    setMensajes(conPregunta);
    setEscrito('');
    setEsperando(true);

    try {
      const datos = await api('/api/chat', {
        method: 'POST',
        body: { mensaje, historial: conPregunta.slice(-7, -1) },
      });
      setMensajes([...conPregunta, { rol: 'bot', texto: datos.respuesta }]);
    } catch {
      setMensajes([
        ...conPregunta,
        { rol: 'bot', texto: 'Ups, no pude conectarme en este momento ☕ Intenta de nuevo en unos segundos o escríbenos por WhatsApp.' },
      ]);
    }
    setEsperando(false);
  }

  return (
    <div className="chat">
      {abierto && (
        <div className="chat__panel">
          <div className="chat__cabecera">
            <span>☕ Asistente Zucafé</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar chat">
              ✕
            </button>
          </div>

          <div className="chat__mensajes">
            {mensajes.map((m, i) => (
              <p key={i} className={'chat__burbuja chat__burbuja--' + m.rol}>
                <Texto texto={m.texto} />
              </p>
            ))}
            {esperando && <p className="chat__burbuja chat__burbuja--bot">Escribiendo…</p>}
            <div ref={final} />
          </div>

          {mensajes.length === 1 && (
            <div className="chat__sugerencias">
              {SUGERENCIAS.map((s) => (
                <button key={s} onClick={() => enviar(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              enviar(escrito);
            }}
          >
            <input value={escrito} onChange={(e) => setEscrito(e.target.value)} placeholder="Escribe tu pregunta…" maxLength={500} />
            <button type="submit" disabled={esperando || !escrito.trim()}>
              Enviar
            </button>
          </form>
        </div>
      )}

      <button className="chat__boton" onClick={() => setAbierto(!abierto)} aria-label="Abrir o cerrar el asistente">
        {abierto ? '✕' : '💬'}
      </button>
    </div>
  );
}
