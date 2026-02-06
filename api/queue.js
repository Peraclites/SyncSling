// /api/queue.js

// Cola temporal en memoria (más adelante la moveremos a KV)
export const config = {
  runtime: "nodejs"
};
let pendingQueue = global.pendingQueue || [];
global.pendingQueue = pendingQueue;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validación de seguridad
    const key = req.query.bridge_key;
    if (!key || key !== process.env.BRIDGE_KEY) {
      console.error("Clave inválida en /queue:", key);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = req.body;
    console.log("Turno recibido para cola:", body);

    // Creamos un item de cola
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      payload: body
    };

    // Lo añadimos a la cola
    pendingQueue.push(item);

    return res.status(200).json({
      ok: true,
      queuedId: item.id,
      pendingCount: pendingQueue.length
    });

  } catch (err) {
    console.error("Error en /queue:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}