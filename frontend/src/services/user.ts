import api from "./api";

// Funciones para las solicitudes de usuarios
export const getUsers = () => api.get("/users");

export const createUser = (data: {
  email: string;
  password: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
}) => api.post("/users", data);

export const updateUser = (
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
  }
) => api.put(`/users/${id}`, data);

export const deleteUser = (id: number) => api.delete(`/users/${id}`);
