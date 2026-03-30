import api from "./api";

export interface Appointment {
  id: number;
  code: string;
  type: string;
  doctor: { id: number; nombre: string; apellido: string; especialidad: string; user_id: number };
  patient: { id: number; nombre: string; apellido: string; fecha_nacimiento?: string; user_id: number };
  time_slot: { id: number; start_time: string; end_time: string };
  date: string;
  cost: number;
  status: { id: number; name: string };
  notes?: string;
  is_paid: boolean;
}

export interface AppointmentCreate {
  type: string;
  doctor_id: number;
  patient_id: number;
  time_slot_id: number;
  date: string; 
  cost?: number;
  notes?: string;
}

export interface AppointmentUpdate {
  type?: string;
  status_id?: number;
  notes?: string;
  is_paid?: boolean;
}

export const getAppointments = (params?: { date_from?: string; date_to?: string; status_id?: number }) =>
  api.get<Appointment[]>("/appointments/", { params });

export const createAppointment = (data: AppointmentCreate) =>
  api.post<Appointment>("/appointments/", data);

export const updateAppointment = (id: number, data: AppointmentUpdate) =>
  api.put<Appointment>(`/appointments/${id}`, data);

export const deleteAppointment = (id: number) =>
  api.delete(`/appointments/${id}`);