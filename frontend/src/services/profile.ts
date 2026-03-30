import api from "./api";

// Funciones para las solicitudes de usuarios
export const getProfile = () => api.get("/profile");

export const updateProfile = (data: {
  email: string;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
}) => api.put("/profile", data);

export const changePassword = (data: {
  current_password: string;
  new_password: string;
}) => api.patch("/profile/password", data);
