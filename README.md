# 🎨 ZakaTattoo - Estudio de Tatuajes

Sitio web profesional para ZakaTattoo con sistema de consultas integrado.

## ✨ Características

- **Diseño moderno y edgy** inspirado en la estética de Instagram del estudio
- **Sistema de consultas** que guarda datos sin servicios terceros
- **Panel admin** para gestionar todas las solicitudes
- **Base de datos SQLite** para persistencia de datos
- **Totalmente responsive** para móvil, tablet y desktop
- **Formulario con envío a WhatsApp** como confirmación

## 🚀 Deployment

### Con Render

1. Crear una cuenta en [render.com](https://render.com)
2. Hacer fork/push a un repositorio GitHub
3. En Render, crear nuevo Web Service:
   - Conectar repositorio GitHub
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
4. Agregar variable de entorno: `ADMIN_KEY=zaka2024`

### Con Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. Conectar repositorio GitHub
3. Railway detectará automáticamente que es Node.js
4. Agregar variable `ADMIN_KEY=zaka2024`
5. Deploy automático

### Con Vercel

⚠️ **Nota:** Vercel tiene límite de 10 segundos por request. Para SQLite es complicado. Se recomienda Render o Railway.

## 📦 Instalación Local

```bash
# Clonar o descargar el proyecto
cd webzakatattoo

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar servidor
npm start
```

El sitio estará disponible en `http://localhost:3000`

## 🔐 Acceso al Panel Admin

- URL: `http://localhost:3000/admin.html`
- Clave: `zaka2024` (cambiar en producción)

Buscar, ver detalles de consultas y descargar como CSV.

## 📁 Estructura

```
webzakatattoo/
├── index.html          # Página principal
├── admin.html          # Panel administrativo
├── server.js           # Backend Express
├── package.json        # Dependencias
├── .env.example        # Variables de entorno (ejemplo)
├── .gitignore          # Archivos a ignorar
├── img/                # Imágenes de galería
└── consultas.db        # Base de datos SQLite (generada)
```

## 🔧 API Endpoints

### POST `/api/consultas`

Guardar una nueva consulta

```bash
curl -X POST http://localhost:3000/api/consultas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@mail.com",...}'
```

### GET `/api/consultas?clave=zaka2024`

Obtener todas las consultas (requiere clave)

### GET `/api/consultas/:id?clave=zaka2024`

Obtener consulta específica

### DELETE `/api/consultas/:id?clave=zaka2024`

Eliminar una consulta

## 🎨 Personalización

### Cambiar clave admin

Editar en `server.js`:

```javascript
if (clave !== process.env.ADMIN_KEY && clave !== 'NUEVA_CLAVE') {
```

### Cambiar colores

En `index.html` buscar `:root`:

```css
--primary: #ff3333; /* Color principal (rojo) */
--dark: #0a0a0a; /* Fondo oscuro */
```

### Número de WhatsApp

En `index.html` y `server.js`, cambiar:

```
5492617480205
```

## 📱 Variables de Entorno

```env
NODE_ENV=production        # Entorno (development/production)
PORT=3000                  # Puerto del servidor
ADMIN_KEY=zaka2024         # Clave para acceder al admin
DATABASE_URL=consultas.db  # Ruta base de datos SQLite
```

## 🐛 Troubleshooting

**Error: "Cannot find module sqlite3"**

```bash
npm install sqlite3
```

**Error: "Port already in use"**

```bash
# Cambiar puerto en .env
PORT=3001
```

**Base de datos no se crea**
Asegurarse de que la carpeta del proyecto tiene permisos de escritura.

## 📝 Notas

- Cada consulta se guarda automáticamente en la base de datos
- El formulario también envía a WhatsApp como confirmación
- Las imágenes deben estar en la carpeta `/img`
- El admin usa clave en URL: `admin.html?clave=zaka2024`

## 📧 Soporte

Para problemas o preguntas, contactar a través de:

- WhatsApp: +54 9 261 748 0205
- Instagram: @zaka_tattoo

---

**ZakaTattoo** © 2024 - Todos los derechos reservados
