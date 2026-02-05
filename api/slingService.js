export async function createSlingShift(config, data) {
  if (!config.apiKey || !config.orgId) {
    return { error: 'Sling Configuration missing.' };
  }

  const startTime = `${data.date}T${data.start}:00Z`;
  const endTime = `${data.date}T${data.end}:00Z`;

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

    const response = await fetch(`https://api.getsling.com/v1/shifts`, {
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
      console.error("Sling error:", result);
      return { error: "Sling API error", details: result };
    }

    return result;

  } catch (error) {
    console.error("Network or code error:", error);
    return { error: error.message || 'Network error connecting to Sling' };
  }
}