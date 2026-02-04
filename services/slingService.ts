import { SlingConfig, AirtablePayload } from '../types';

/**
 * Creates a shift in Sling.
 * Note: Sling API is authenticated via headers.
 * Sling requires a POST to /v1/shifts
 */
export async function createSlingShift(config: SlingConfig, data: AirtablePayload) {
  if (!config.apiKey || !config.orgId) {
    return { error: 'Sling Configuration missing.' };
  }

  // Map Airtable data to Sling format
  const startTime = `${data.date}T${data.start}:00Z`;
  const endTime = `${data.date}T${data.end}:00Z`;

  const body = {
    dt_start: startTime,
    dt_end: endTime,
    user: { id: parseInt(data.employeeId[0]) || 0 },
    location: { id: parseInt(data.locationId[0]) || 0 },
    position: { id: parseInt(data.positionId[0]) || 0 },
    notes: data.notes || '',
  };

  try {
    console.log('Pushing to Sling:', body);

    // REAL API CALL (now enabled)
    const response = await fetch(`https://api.getsling.com/v1/shifts`, {
      method: 'POST',
      headers: {
        'Authorization': config.apiKey,   // Example: "Bearer eyJhbGciOi..."
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log("Sling response:", result);

    // If Sling returns an error, surface it clearly
    if (!response.ok) {
      console.error("Sling error:", result);
      return { error: "Sling API error", details: result };
    }

    // Success
    return result;

  } catch (error: any) {
    console.error("Network or code error:", error);
    return { error: error.message || 'Network error connecting to Sling' };
  }
}