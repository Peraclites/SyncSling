export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Webhook endpoint OK" });
  }

  try {
    const body = req.body;

    console.log("Webhook recibido:", body);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error en webhook:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}