# ☕ Zucafé — Un sabor para no olvidar

Aplicación web full stack del emprendimiento de café colombiano **Zucafé**: landing, catálogo, formulario de pedido, panel de administración con login y chatbot de atención.

🌐 **Página publicada:** `https://TU-USUARIO.github.io/zucafe-fullstack/` ← *(escribe aquí tu enlace real)*

> Esta página de GitHub muestra el **código** del proyecto. La página web de verdad vive en el enlace de arriba (GitHub Pages).

## Cómo cumple el proyecto final

| Requisito | Dónde está |
|---|---|
| 01 Landing / inicio | `frontend/src/components/Hero.jsx`, `Origen.jsx`, `Navbar.jsx` |
| 02 Catálogo | `Catalogo.jsx` (productos desde MongoDB) |
| 03 Contacto real | `FormularioPedido.jsx` → `POST /api/pedidos` → MongoDB |
| 04 Panel admin | `PanelAdmin.jsx` (login, pedidos, agregar/editar/eliminar productos) |
| 05 IA aplicada | `ChatbotIA.jsx` + `backend/routes/chat.js` (chatbot de atención) |
| 06 Publicación | Frontend en GitHub Pages · Backend en Render · Datos en MongoDB Atlas |
| Responsive | `frontend/src/index.css` (menú hamburguesa y rejillas adaptables) |
| Animaciones | CSS (`@keyframes` en `index.css`) |
| Git + 15 commits | Historial de commits de este repositorio |

## Tecnologías

HTML · CSS · JavaScript · React (JSX) · Node.js · Express · MongoDB (Mongoose) · JWT

## Estructura

```
zucafe-fullstack/
├── backend/                 Servidor Node.js + Express + MongoDB
│   ├── index.js             Arranca el servidor y conecta con MongoDB
│   ├── negocio.js           Datos del negocio que usa el chatbot (horario, WhatsApp...)
│   ├── models/              Producto.js y Pedido.js (esquemas de MongoDB)
│   ├── routes/              auth.js, productos.js, pedidos.js, chat.js
│   └── middleware/          verificarAdmin.js (protege el panel)
├── frontend/                React + Vite
│   └── src/
│       ├── App.jsx          Junta todas las secciones
│       ├── config.js        WhatsApp, dirección del backend y catálogo de respaldo
│       ├── index.css        Colores, tipografías y diseño
│       └── components/      Navbar, Hero, Origen, Catalogo, FormularioPedido, ChatbotIA, PanelAdmin
└── .github/workflows/       Publicación automática en GitHub Pages
```

## Cómo correrlo

Mira **[PASOS.md](PASOS.md)**: está explicado paso a paso (MongoDB, GitHub, publicación).
