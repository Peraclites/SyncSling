export async function createSlingShift(config, data) {
  if (!config.apiKey || !config.orgId) {
    return { error: 'Sling Configuration missing.' };
  }

  // Normalizar horas a HH:MM:SS
  const normalizeTime = (t) => {
    if (!t) return null;
    const [h, m] = t.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
  };

  const start = normalizeTime(data.start);
  const end = normalizeTime(data.end);

  if (!start || !end) {
    return { error: "Missing start or end time" };
  }

  const startTime = `${data.date}T${start}Z`;
  const endTime = `${data.date}T${end}Z`;

  const body = {
    dt_start: startTime,
    dt_end: endTime,
    user: { id: parseInt(data.employeeId?.[0] || "0") },
    location: { id: parseInt(data.locationId?.[0] || "0") },
    position: { id: parseInt(data.positionId?.[0] || "0") },
    notes: data.notes || '',
  };

  try {
    console.log('Pushing to Sling:', body);

    const response = await fetch(`https://api.getsling.com/v1/${config.orgId}/shifts`, {
  method: 'POST',
  headers: {
    'Authorization': config.apiKey,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

    const result = await response.json();
    console.log("Sling response:", result);

    if (!response.ok) {
      return { error: "Sling API error", details: result };
    }

    return result;

  } catch (error) {
    return { error: error.message || 'Network error connecting to Sling' };
  }
}