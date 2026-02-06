// /api/process.js
import { createSlingShift } from "./slingService.js";

// Reutilizamos la cola global creada en /api/queue.js
let pendingQueue = global.pendingQueue || [];
global.pendingQueue = pendingQueue;

// Reutilizamos también el log de errores
let errorLog = global.errorLog || [];
global.errorLog = errorLog;

// Función para marcar Airtable como "Publicado"
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
        "fldKeQW27G27CBIJU": true
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Error updating Airtable:", err);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validación de seguridad
    const key = req.query.bridge_key;
    if (!key || key !== process.env.BRIDGE_KEY) {
      console.error("Clave inválida en /process:", key);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const config = {
      apiKey: process.env.SLING_API_KEY,
      orgId: process.env.SLING_ORG_ID
    };

    const processed = [];
    const failed = [];

    // Copiamos la cola y la vaciamos
    const queueToProcess = [...pendingQueue];
    pendingQueue.length = 0;

    for (const item of queueToProcess) {
      const data = item.payload;

      try {
        const slingResponse = await createSlingShift(config, data);

        if (!slingResponse.error) {
          // Marcar Airtable como publicado
          if (data.airtableRecordId) {
            await markAirtableAsPublished(data.airtableRecordId);
          }

          processed.push({
            id: item.id,
            airtableRecordId: data.airtableRecordId,
            slingResponse
          });
        } else {
          const errorItem = {
            queueId: item.id,
            airtableRecordId: data.airtableRecordId,
            payload: data,
            slingResponse,
            createdAt: new Date().toISOString()
          };
          errorLog.push(errorItem);
          failed.push(errorItem);
        }
      } catch (err) {
        console.error("Error procesando item:", err);
        const errorItem = {
          queueId: item.id,
          airtableRecordId: data.airtableRecordId,
          payload: data,
          error: err.message || String(err),
          createdAt: new Date().toISOString()
        };
        errorLog.push(errorItem);
        failed.push(errorItem);
      }
    }

    return res.status(200).json({
      ok: true,
      processedCount: processed.length,
      failedCount: failed.length,
      processed,
      failed
    });

  } catch (err) {
    console.error("Error en /process:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}