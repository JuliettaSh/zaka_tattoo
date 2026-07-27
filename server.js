const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
// Mensaje a telegram
async function notificarTelegram(consulta) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const texto = `*Nueva consulta ZakaTattoo*
👤 ${consulta.nombre}
📧 ${consulta.email}
📱 ${consulta.telefono}
🖋 Tipo: ${consulta.tipo} | Tamaño: ${consulta.tamano}
📍 ${consulta.ubicacion}
📝 ${consulta.descripcion}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: texto,
      parse_mode: "Markdown",
    }),
  }).catch((err) => console.error("Telegram error:", err));
}
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Nota: el middleware estático se registra AL FINAL para evitar exponer
// archivos sensibles como `admin.html`. Las rutas protegidas se definen antes.

// Base de datos
const dbPath = process.env.DATABASE_URL || path.join(__dirname, "consultas.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Error abriendo BD:", err);
  else console.log("Base de datos conectada");
});

// Crear tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL,
        tipo TEXT NOT NULL,
        tamano TEXT NOT NULL,
        ubicacion TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// ========== RUTAS ==========

// Recibir datos del formulario
app.post("/api/consultas", (req, res) => {
  const { nombre, email, telefono, tipo, tamano, ubicacion, descripcion } =
    req.body;

  const sql = `INSERT INTO consultas (nombre, email, telefono, tipo, tamano, ubicacion, descripcion)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [nombre, email, telefono, tipo, tamano, ubicacion, descripcion],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al guardar la consulta" });
      }
      notificarTelegram({
        nombre,
        email,
        telefono,
        tipo,
        tamano,
        ubicacion,
        descripcion,
      });
      res.json({ success: true, id: this.lastID });
    },
  );
});

// Obtener todas las consultas (protegido con clave)
app.get("/api/consultas", (req, res) => {
  const clave = req.query.clave || req.headers["x-admin-key"];
  // Permitir acceso si se pasó clave válida o si la cookie de sesión está presente
  const hasSession = req.cookies && req.cookies.admin === "true";
  if (
    !(hasSession || clave === process.env.ADMIN_KEY || clave === "zaka2024")
  ) {
    return res.status(401).json({ error: "No autorizado" });
  }

  db.all("SELECT * FROM consultas ORDER BY fecha DESC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener consultas" });
    }
    res.json(rows);
  });
});

// Obtener una consulta específica
app.get("/api/consultas/:id", (req, res) => {
  const clave = req.query.clave || req.headers["x-admin-key"];
  const hasSession = req.cookies && req.cookies.admin === "true";
  if (
    !(hasSession || clave === process.env.ADMIN_KEY || clave === "zaka2024")
  ) {
    return res.status(401).json({ error: "No autorizado" });
  }

  db.get(
    "SELECT * FROM consultas WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener consulta" });
      }
      res.json(row);
    },
  );
});

// Eliminar una consulta
app.delete("/api/consultas/:id", (req, res) => {
  const clave = req.query.clave || req.headers["x-admin-key"];
  const hasSession = req.cookies && req.cookies.admin === "true";
  if (
    !(hasSession || clave === process.env.ADMIN_KEY || clave === "zaka2024")
  ) {
    return res.status(401).json({ error: "No autorizado" });
  }

  db.run("DELETE FROM consultas WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al eliminar" });
    }
    res.json({ success: true });
  });
});

// Verificar servidor
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Ruta protegida para servir el panel admin
app.get("/admin", (req, res) => {
  const clave = req.query.clave || req.headers["x-admin-key"];
  // Permite el acceso si la cookie de sesión está presente o si la clave es correcta
  const hasSession = req.cookies && req.cookies.admin === "true";
  if (
    !(hasSession || clave === process.env.ADMIN_KEY || clave === "zaka2024")
  ) {
    // Si no está autenticado, servir un pequeño formulario de login
    return res.send(`
      <!doctype html>
      <html>
        <head><meta charset="utf-8"><title>Admin login</title></head>
        <body style="font-family:Arial,Helvetica,sans-serif;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;">
          <div style="max-width:360px;width:100%;padding:2rem;background:#1e1b26;border-radius:8px;">
            <h2 style="margin:0 0 1rem;color:${process.env.ADMIN_KEY ? "#f8c77c" : "#d97a57"}">Acceso Admin</h2>
            <p style="color:#b9a89f;margin:0 0 1rem">Introduce la clave para acceder al panel.</p>
            <form id="loginForm">
              <input name="clave" type="password" placeholder="Clave" style="width:100%;padding:0.75rem;margin-bottom:1rem;border:1px solid #333;background:#111;color:#fff;" />
              <button type="submit" style="width:100%;padding:0.75rem;background:${process.env.ADMIN_KEY ? "#f8c77c" : "#d97a57"};border:none;color:#111;font-weight:700;">Entrar</button>
            </form>
            <p id="msg" style="color:#ff9;margin-top:0.75rem;display:none"></p>
          </div>
          <script>
            document.getElementById('loginForm').addEventListener('submit', async (e)=>{
              e.preventDefault();
              const clave = new FormData(e.target).get('clave');
              const res = await fetch('/admin/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clave})});
              if (res.ok) {
                location.href = '/admin';
              } else {
                const el = document.getElementById('msg'); el.style.display='block'; el.textContent='Clave incorrecta';
              }
            });
          </script>
        </body>
      </html>
    `);
  }
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Login para admin: establece cookie de sesión
app.post("/admin/login", (req, res) => {
  const clave = req.body && req.body.clave;
  if (clave === process.env.ADMIN_KEY || clave === "zaka2024") {
    res.cookie("admin", "true", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true });
  }
  res.status(401).json({ error: "Clave incorrecta" });
});

// Logout: borrar cookie
app.post("/admin/logout", (req, res) => {
  res.clearCookie("admin", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.json({ success: true });
});

// Bloquear acceso directo a /admin.html (evita exposición por static)
app.get("/admin.html", (req, res) => {
  res.status(404).send("Not found");
});

// Servir archivos estáticos (index, img, etc.) desde la carpeta del proyecto
app.use(express.static(path.join(__dirname, ".")));

app.listen(PORT, () => {
  console.log(`🎨 Servidor corriendo en puerto ${PORT}`);
});
