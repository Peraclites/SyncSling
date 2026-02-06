// /api/pending.js

// Usamos la misma cola global creada en /api/queue.js
export const config = {
  runtime: "nodejs"
};
let pendingQueue = global.pendingQueue || [];
global.pendingQueue = pendingQueue;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    return res.status(200).json({
      ok: true,
      pending: pendingQueue
    });
  } catch (err) {
    console.error("Error en /pending:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}