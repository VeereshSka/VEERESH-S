
export type Page = 'Dashboard' | 'Patients' | 'Doctors' | 'Appointments' | 'Pharmacy' | 'Settings';

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface PatientVitals {
  heartRate: number;
  spO2: number;
  temperature: number;
}

export type VitalStatus = 'Stable' | 'Warning' | 'Critical';

export interface DiagnosisResult {
  disease: string;
  category: string;
}

export interface DiagnosisHistoryItem {
  date: string;
  symptoms: string;
  conditions: DiagnosisResult[];
}

export interface Patient extends PatientVitals {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  room: string;
  status: VitalStatus;
  phone?: string;
  address?: string;
  specialist?: string;
  avatarUrl?: string;
  diagnosisHistory?: DiagnosisHistoryItem[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: 'Available' | 'On Call' | 'Busy';
  avatarUrl: string;
  // FIX: Updated location type to match data used in Doctors.tsx.
  location: 'Mangalore' | 'Shivamogga';
  phone: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  stock: number;
  price: number;
  expiryDate: string;
  // FIX: Updated location type to match data used in Pharmacy.tsx.
  location: 'Mangalore' | 'Shivamogga';
}

export interface MedicalFacility {
  title: string;
  uri: string;
}

export interface PrognosisResult {
  predictedCondition: string;
  confidenceScore: number;
  recommendedSolution: string;
}

export interface HospitalBooking {
  id: string;
  patientName: string;
  hospitalName: string;
  amount: number;
  bookingDate: string;
  status: 'Confirmed';
}

// FIX: Added Invoice and InvoiceItem types for use in HospitalPayments.tsx.
export interface InvoiceItem {
  description: string;
  cost: number;
}

export interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Overdue';
  items: InvoiceItem[];
}
