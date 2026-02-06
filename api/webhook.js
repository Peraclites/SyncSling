import { createSlingShift } from "./slingService.js";

// ⬇️ Añade esta función aquí, justo debajo del import
async function markAirtableAsPublished(airtableRecordId) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;

  if (!apiKey || !baseId || !tableId) {
    console.error("Missing Airtable environment variables");
    return;
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableId}/${airtableRecordId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        "fldKeQW27G27CBIJU": true   // <-- tu checkbox "Publicado"
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Error updating Airtable:", err);
  }
}

// ⬇️ Tu handler principal
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

    // ⬇️ Si Sling ha creado el turno correctamente → marcar checkbox en Airtable
    if (!slingResponse.error && body.airtableRecordId) {
      await markAirtableAsPublished(body.airtableRecordId);
    }

    return res.status(200).json({
      ok: true,
      slingResponse
    });

  } catch (err) {
    console.error("Error en webhook:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}