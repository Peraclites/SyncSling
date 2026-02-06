// /api/errors.js

// Reutilizamos el log global de errores
export const config = {
  runtime: "nodejs"
};
let errorLog = global.errorLog || [];
global.errorLog = errorLog;

export default async function handler(req, res) {
  // GET → devolver errores
  if (req.method === "GET") {
    try {
      return res.status(200).json({
        ok: true,
        errors: errorLog
      });
    } catch (err) {
      console.error("Error en GET /errors:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // POST → registrar un error manualmente
  if (req.method === "POST") {
    try {
      const body = req.body;

      const item = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        ...body
      };

      errorLog.push(item);

      return res.status(200).json({ ok: true, errorId: item.id });
    } catch (err) {
      console.error("Error en POST /errors:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Otros métodos no permitidos
  return res.status(405).json({ error: "Method not allowed" });
}