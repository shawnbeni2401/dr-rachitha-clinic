export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  history: string;
  lastVisit: string;
  email?: string;
  phone?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AyurvedicSearchResponse {
  content: string;
  sources: GroundingSource[];
}

export interface AyurvedicResult {
  name: string;
  details: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  notes: string;
}