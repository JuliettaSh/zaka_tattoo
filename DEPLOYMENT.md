# 🚀 GUÍA DE DEPLOYMENT

## OPCIÓN 1: RENDER.COM (⭐ RECOMENDADO)

### Pasos:

1. Ir a https://render.com y crear cuenta
2. Dar permiso para conectar tu GitHub
3. Hacer push del proyecto a un repo en GitHub
4. En Render, click en "New +" → "Web Service"
5. Seleccionar tu repositorio
6. Configurar:
   - **Name**: zaka-tattoo
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (gratuito)

7. En la sección "Environment", agregar:

   ```
   ADMIN_KEY=zaka2024
   NODE_ENV=production
   ```

8. Click en "Create Web Service"
9. Esperar a que termine el build (3-5 min)
10. Tu sitio estará en: `https://zaka-tattoo.onrender.com`

**Ventajas:**

- ✅ Gratis con SQLite
- ✅ Auto-deploy con cada push a GitHub
- ✅ Base de datos persistente
- ✅ Soporte 24/7

---

## OPCIÓN 2: RAILWAY.APP

### Pasos:

1. Ir a https://railway.app y conectar GitHub
2. Click en "New Project"
3. Seleccionar "Deploy from GitHub repo"
4. Seleccionar tu repositorio
5. Railway detectará automáticamente que es Node.js
6. En "Variables", agregar:

   ```
   ADMIN_KEY=zaka2024
   NODE_ENV=production
   PORT=3000
   ```

7. Hacer deploy
8. Tu sitio estará en la URL que proporciona Railway

**Ventajas:**

- ✅ Interface limpia
- ✅ Gratis con SQLite
- ✅ Muy rápido

---

## OPCIÓN 3: HEROKU (Pago - $5/mes)

### Pasos:

1. Crear cuenta en https://heroku.com
2. Instalar Heroku CLI
3. Terminal:

   ```bash
   heroku login
   heroku create zaka-tattoo
   git push heroku main
   heroku config:set ADMIN_KEY=zaka2024
   ```

4. Visitar: `https://zaka-tattoo.herokuapp.com`

---

## ⚠️ IMPORTANTE ANTES DE DEPLOY

### 1. Cambiar clave admin

Editar `.env` antes de hacer push:

```env
ADMIN_KEY=tu_clave_super_segura_aqui
```

### 2. Cambiar número de WhatsApp

En `server.js` línea ~40 y `index.html`:

```javascript
const numero = "TU_NUMERO_AQUI";
```

### 3. Cambiar dominio en formulario (si aplica)

Si tienes dominio propio, actualizar referencias.

---

## 🔗 CONECTAR DOMINIO PROPIO

### Render:

1. En "Settings" → "Custom Domain"
2. Agregar tu dominio
3. En tu registrador (GoDaddy, Namecheap, etc):
   - Crear CNAME: `TUDOMINIO.com` → `zaka-tattoo.onrender.com`

### Railway:

1. En "Settings" → "Domain"
2. Agregar dominio
3. Seguir instrucciones de DNS

---

## 🔍 VERIFICAR DESPUÉS DE DEPLOY

✅ Sitio principal carga: https://tuapp.onrender.com
✅ Formulario funciona: Llenar y enviar
✅ Panel admin accesible: https://tuapp.onrender.com/admin.html
✅ Datos se guardan: Verificar en admin panel
✅ WhatsApp integrado: Click en botón flotante

---

## 📝 VARIABLES DE ENTORNO

Estas son necesarias en TODAS las plataformas:

| Variable    | Valor      | Ejemplo      |
| ----------- | ---------- | ------------ |
| `NODE_ENV`  | production | `production` |
| `ADMIN_KEY` | Tu clave   | `zaka2024`   |
| `PORT`      | Puerto     | `3000`       |

---

## 🆘 PROBLEMAS COMUNES

**La base de datos desaparece después de reiniciar**

- En plataformas gratuitas, los servidores se reinician periódicamente
- Solución: Migrar a base de datos externa (MongoDB Atlas, Supabase)

**Error: "Cannot find module"**

- Asegurarse de que `package.json` está en la raíz
- Ver que `npm install` se ejecutó en el build

**Sitio muy lento**

- Render/Railway gratuitos pueden ser lentos
- Considerar Tier pago ($7-10/mes)

---

## 💾 BACKUP DE DATOS

Si necesitas backup de consultas:

1. Ir a admin.html
2. Click en "📥 Descargar CSV"
3. Se descarga archivo con todas las consultas

---

## 🎉 ¡LISTO!

Tu sitio está online. Ahora:

- Compartir link en Instagram
- Empezar a recibir consultas
- Verlas en panel admin
- Descargar como CSV si necesitas

¡Mucho éxito! 🎨
