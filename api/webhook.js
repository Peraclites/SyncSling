import { createSlingShift } from "../services/slingService";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Webhook endpoint OK" });
  }

  try {
    const key = req.query.bridge_key;
    if (!key || key !== process.env.BRIDGE_KEY) {
      console.error("Clave inválida:", key);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = req.body;
    console.log("Webhook recibido:", body);

    const config = {
      apiKey: process.env.SLING_API_KEY,
      orgId: process.env.SLING_ORG_ID
    };

    console.log("Llamando a createSlingShift...");
    const slingResponse = await createSlingShift(config, body);

    console.log("Respuesta de Sling:", slingResponse);

    return res.status(200).json({
      ok: true,
      slingResponse
    });

  } catch (err) {
    console.error("Error en webhook:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}