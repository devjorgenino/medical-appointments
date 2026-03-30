import api from "./api";

// Funciones para las solicitudes de pacientes
export const getPatients = () => api.get("/patients");

export const createPatient = (data: {
  email: string;
  password: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
  fecha_nacimiento?: string;
}) => api.post("/patients", data);

export const updatePatient = (
  id: number,
  data: {
    email: string;
    password?: string;
    role_id: number;
    nombre: string;
    apellido: string;
    numero_telefono?: string;
    direccion?: string;
    sexo?: string;
    fecha_nacimiento?: string;
  }
) => api.put(`/patients/${id}`, data);

export const deletePatient = (id: number) => api.delete(`/patients/${id}`);

export const getMyPatients = () => api.get("/patients/me");
