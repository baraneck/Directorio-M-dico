export interface Doctor {
  id: string; // Manual unique ID
  name: string;
  specialty: string;
  room: string;
  mutuas: string[];
  email?: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean; // Status for filtering
}

// Keeping Appointment type just in case it's needed for future reference, 
// but it's not used in the main view anymore.
export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  mutua?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  DOCTORS = 'DOCTORS',
  SETTINGS = 'SETTINGS'
}
