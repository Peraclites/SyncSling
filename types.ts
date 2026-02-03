
export interface AirtablePayload {
  recordId: string;
  date: string;
  start: string;
  end: string;
  locationId: string[];
  positionId: string[];
  employeeId: string[];
  notes?: string;
  summary?: string;
}

export interface SlingConfig {
  apiKey: string;
  orgId: string;
}

export interface SyncLog {
  id: string;
  timestamp: number;
  recordId: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  payload: AirtablePayload;
  response?: any;
}

export interface SlingShift {
  id?: number;
  user: { id: number };
  location: { id: number };
  position: { id: number };
  dt_start: string;
  dt_end: string;
  notes?: string;
}
