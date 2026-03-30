import api from "./api";

// Funciones para autenticación
export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

// Función para refrescar/renovar el token
export const refreshToken = () => api.post("/auth/refresh");

export const register = (data: {
  email: string;
  password: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
}) => api.post("/users/register", data);

export const requestPasswordReset = (email: string) =>
  api.post("/auth/password-reset", { email });   

export const validateResetToken = (token: string) =>
  api.get(`/auth/action-token/${token}`);

export const resetPasswordWithToken = (token: string, new_password: string) =>
  api.post(`/auth/action-token/${token}/use`, { new_password });