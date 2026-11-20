# 📋 PASOS: todo lo que te toca hacer

Hazlos **en orden**. No pases al siguiente hasta que el anterior funcione.

Resumen del camino:

1. Correr el proyecto en tu computador
2. Crear la base de datos en internet (MongoDB Atlas)
3. Subir el código a GitHub (con 15+ commits)
4. Publicar el backend (Render)
5. Publicar la página (GitHub Pages)
6. Revisar que todo funcione

---

## 1. Correr el proyecto en tu computador

> Necesitas Node.js y MongoDB (Compass encendido) o la cadena de Atlas del paso 2.

**1.1** Descomprime el zip en una carpeta nueva. Abre esa carpeta con VS Code (**File → Open Folder**). Debes ver las carpetas `backend`, `frontend` y `.github` (si ves otra carpeta `zucafe-fullstack` adentro, ábrela a ella).

**1.2** Abre la terminal de VS Code (**Terminal → New Terminal**).

Si sale un error rojo que habla de "ejecución de scripts deshabilitada", pega esto, cierra la terminal y abre una nueva:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**1.3 Backend** (servidor). En la terminal:

```powershell
cd backend
copy .env.example .env
```

Abre `backend/.env` y revisa:

| Línea | Qué poner |
|---|---|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/zucafe` (MongoDB de tu PC) |
| `ADMIN_USER` | tu usuario del panel (ej. `admin`) |
| `ADMIN_PASS` | tu contraseña del panel |
| `JWT_SECRET` | cualquier texto largo |

> Si ya tenías un `.env` de la versión anterior, cópialo a esta carpeta `backend` y listo.

```powershell
npm install
npm run dev
```

Debe salir `✅ MongoDB conectado` y `✅ Servidor listo en http://localhost:3000`. **Deja esta terminal abierta.**

**1.4 Frontend** (la página). Abre una **segunda terminal** con el botón **+** y escribe:

```powershell
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173** en el navegador. Ahí está tu página.

**1.5 Pruébalo:** haz un pedido, entra a **🔒 Admin** con tu usuario y contraseña del `.env` y mira que el pedido aparezca. Prueba el chat 💬.

---

## 2. Crear la base de datos en internet (MongoDB Atlas)

Tu MongoDB del computador no sirve para la página publicada; necesitas una en la nube (gratis).

1. Entra a **cloud.mongodb.com** e inicia sesión (o crea cuenta).
2. **Create** un cluster → elige el plan **Free (M0)** → **Create**.
3. Menú **Database Access** → **Add New Database User**: escribe un usuario y una contraseña (usa **solo letras y números** en la contraseña) → anótalos → **Add User**.
4. Menú **Network Access** → **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) → **Confirm**.
5. Menú **Database** → botón **Connect** en tu cluster → **Drivers** → copia la cadena. Se ve así:

```
mongodb+srv://USUARIO:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

6. Arréglala: cambia `<db_password>` por tu contraseña (sin los `< >`) y agrega `zucafe` justo después de `.net/`:

```
mongodb+srv://USUARIO:TuClave123@cluster0.abcde.mongodb.net/zucafe?retryWrites=true&w=majority&appName=Cluster0
```

Guarda esa cadena, la usarás en el paso 4. (Si quieres probarla ya, pégala en `MONGODB_URI` del `backend/.env` y reinicia el backend.)

---

## 3. Subir el código a GitHub (con 15+ commits)

**3.1** En **github.com** → botón **New** (repositorio nuevo):
- Nombre: `zucafe-fullstack`
- **Public**
- **No** marques README, .gitignore ni licencia (déjalo vacío)
- **Create repository**

**3.2** Primera vez en tu PC: dile a Git quién eres (cambia los datos):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo-de-github@ejemplo.com"
```

**3.3** En la terminal, ubícate en la carpeta principal (la que tiene `backend`, `frontend` y `.github`). Si estás dentro de `backend` o `frontend`, escribe `cd ..`. Luego:

```powershell
git init
git branch -M main
git remote add origin https://github.com/TU-USUARIO/zucafe-fullstack.git
```

(Cambia `TU-USUARIO` por tu usuario de GitHub.)

**3.4** Comprueba que no se vaya a subir lo que no debe:

```powershell
git status
```

No debe aparecer `node_modules` ni `.env` (el `.gitignore` los oculta). Si aparecen, avísame.

**3.5** Los commits. Pega este bloque completo (hace 20 commits, uno por cada parte del proyecto):

```powershell
git add .gitignore README.md PASOS.md
git commit -m "chore: estructura inicial, .gitignore y README"

git add backend/package.json backend/package-lock.json backend/.env.example
git commit -m "feat(backend): package.json y dependencias"

git add backend/index.js
git commit -m "feat(backend): servidor Express y conexión a MongoDB"

git add backend/models/Producto.js
git commit -m "feat(backend): modelo Producto"

git add backend/models/Pedido.js
git commit -m "feat(backend): modelo Pedido"

git add backend/middleware backend/routes/auth.js
git commit -m "feat(backend): login de admin con JWT"

git add backend/routes/productos.js
git commit -m "feat(backend): rutas CRUD de productos"

git add backend/routes/pedidos.js
git commit -m "feat(backend): rutas de pedidos"

git add backend/negocio.js backend/routes/chat.js
git commit -m "feat(backend): chatbot de atención"

git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/public frontend/src/main.jsx
git commit -m "feat(frontend): proyecto React con Vite"

git add frontend/src/index.css
git commit -m "style: colores, tipografías y estilos base"

git add frontend/src/config.js frontend/src/api.js frontend/src/utils.js frontend/src/assets
git commit -m "feat(frontend): configuración, conexión con la API y logo"

git add frontend/src/components/Navbar.jsx frontend/src/components/Hero.jsx
git commit -m "feat(frontend): navbar y portada con logo"

git add frontend/src/components/Origen.jsx
git commit -m "feat(frontend): sección de origen"

git add frontend/src/components/Catalogo.jsx
git commit -m "feat(frontend): catálogo de productos"

git add frontend/src/components/FormularioPedido.jsx
git commit -m "feat(frontend): formulario de pedido"

git add frontend/src/components/ChatbotIA.jsx
git commit -m "feat(frontend): chatbot flotante"

git add frontend/src/components/PanelAdmin.jsx
git commit -m "feat(frontend): panel admin con login, pedidos y catálogo"

git add frontend/src/App.jsx
git commit -m "feat(frontend): App une todas las secciones"

git add .github
git commit -m "chore: publicación automática en GitHub Pages"
```

> Los avisos que dicen `LF will be replaced by CRLF` son normales en Windows. Ignóralos.

Cuenta tus commits (deben ser 15 o más):

```powershell
git log --oneline
```

**3.6** Súbelo a GitHub:

```powershell
git push -u origin main
```

La primera vez se abre el navegador para que inicies sesión en GitHub. Después recarga la página de tu repositorio: ya verás las carpetas.

> Lo que ves en un repositorio de GitHub es el **código** y el README. No es tu página web; esa se publica en el paso 5.

**Después**, cada vez que cambies algo: `git add .`, `git commit -m "lo que cambié"` y `git push`. Cada cambio cuenta como commit.

---

## 4. Publicar el backend (Render)

1. Entra a **render.com** → **Get Started** → inicia sesión **con GitHub**.
2. **New +** → **Web Service** → elige tu repositorio `zucafe-fullstack` (si no aparece, da permiso a Render para ver tus repositorios).
3. Llena así:

| Campo | Valor |
|---|---|
| Name | `zucafe-api` |
| Branch | `main` |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** |

4. En **Environment Variables** agrega estas 4 (botón **Add Environment Variable**):

| Key | Value |
|---|---|
| `MONGODB_URI` | la cadena de Atlas del paso 2 |
| `ADMIN_USER` | tu usuario del panel |
| `ADMIN_PASS` | tu contraseña del panel (usa una buena) |
| `JWT_SECRET` | un texto largo cualquiera |

5. **Create Web Service**. Espera unos minutos hasta que diga **Live**.
6. Copia la dirección que aparece arriba, parecida a `https://zucafe-api-xxxx.onrender.com`.
7. Ábrela en el navegador: debe decir **API de Zucafé funcionando ☕**. Y si le agregas `/api/productos` al final, debes ver tus cafés.

> ⚠️ En el plan gratis, Render "duerme" el servidor si nadie lo usa. La primera visita después de un rato tarda cerca de **1 minuto** en responder. **Antes de la defensa, abre esa dirección unos minutos antes.**

---

## 5. Publicar la página (GitHub Pages)

**5.1** Abre `frontend/src/config.js` y cambia esta línea, pegando la dirección de Render (sin `/` al final):

```js
export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://zucafe-api-xxxx.onrender.com';
```

**5.2** Súbelo:

```powershell
git add frontend/src/config.js
git commit -m "chore: conectar el frontend con el backend publicado"
git push
```

**5.3** En GitHub, en tu repositorio: **Settings → Pages**. En **Build and deployment → Source** elige **GitHub Actions**.

**5.4** Ve a la pestaña **Actions**. Verás un proceso llamado *Publicar en GitHub Pages*. Espera a que tenga el ✅ verde (1–2 minutos).
- Si quedó en ❌ rojo porque lo activaste antes de hacer el paso 5.3: entra al proceso → **Re-run all jobs**.

**5.5** Tu página queda en:

```
https://TU-USUARIO.github.io/zucafe-fullstack/
```

(también aparece en **Settings → Pages**). Pega ese enlace en tu `README.md`.

---

## 6. Revisión final (checklist)

Abre tu enlace de GitHub Pages **en el celular y en el computador** y comprueba:

- [ ] Se ve el logo, la portada y el menú (en el celular, el menú ☰ funciona)
- [ ] El catálogo muestra los dos cafés con sus precios
- [ ] El formulario envía un pedido y sale "¡Pedido recibido!"
- [ ] En **🔒 Admin** entras y ves ese pedido
- [ ] Desde el admin cambias un precio y el catálogo se actualiza
- [ ] El chat 💬 responde precios, horario y ubicación
- [ ] El botón de WhatsApp abre el chat con el **310 211 8326**
- [ ] Tu repositorio tiene **15 commits o más** (pestaña *Commits*)

---

## ✏️ Quiero cambiar algo pequeño: ¿dónde?

| Quiero cambiar... | Lo edito en... |
|---|---|
| Número de WhatsApp | `frontend/src/config.js` **y** `backend/negocio.js` |
| Horario, ubicación, envíos y pagos que dice el chatbot | `backend/negocio.js` |
| Textos de la portada | `frontend/src/components/Hero.jsx` |
| Las 4 tarjetas de "Origen" | `frontend/src/components/Origen.jsx` |
| Precios y productos | El panel **🔒 Admin** (no hay que tocar código) |
| Colores | Las variables del inicio de `frontend/src/index.css` |
| El logo | Reemplaza `frontend/src/assets/logo.png` y `frontend/public/favicon.png` |
| Lo que responde el chatbot | `backend/routes/chat.js`, en la lista `temas` |

Después de editar: `git add .` → `git commit -m "descripción"` → `git push`. La página se actualiza sola (el frontend en GitHub Pages y el backend en Render).

---

## 🎤 Para la defensa

Debes saber explicar:

- **Cómo viaja un pedido:** formulario (React) → `fetch` → ruta `POST /api/pedidos` (Express) → modelo `Pedido` (Mongoose) → MongoDB → lista del panel admin.
- **Cómo funciona el login:** el servidor compara usuario y clave con el `.env`, entrega un *token* (JWT) y `verificarAdmin.js` lo revisa en las rutas protegidas.
- **Qué es un componente y qué son las props:** `Catalogo` recibe `productos` y `onPedir` como props desde `App`.
- **Cómo funciona el chatbot:** busca palabras clave en la pregunta, elige el tema con más coincidencias y responde; los precios los lee de MongoDB.
- **Por qué hay 3 servicios:** GitHub Pages (página), Render (servidor), MongoDB Atlas (datos).

Si trabajan en pareja, ambos deben dominar todo el código.
