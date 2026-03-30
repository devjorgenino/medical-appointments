import api from "./api";

// Funciones para las solicitudes de doctores
export const getDoctors = () => api.get("/doctors/");

export const createDoctor = (data: {
  email: string;
  password: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
  especialidad: string;
}) => api.post("/doctors/", data);

export const updateDoctor = (
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
    especialidad: string;
  }
) => api.put(`/doctors/${id}/`, data);

export const deleteDoctor = (id: number) => api.delete(`/doctors/${id}/`);
