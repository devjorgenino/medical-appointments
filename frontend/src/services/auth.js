import api from "./api";
// Funciones para autenticación
export const login = (data) => api.post("/auth/login", data);
// Función para refrescar/renovar el token
export const refreshToken = () => api.post("/auth/refresh");
export const register = (data) => api.post("/users/register", data);
export const requestPasswordReset = (email) => api.post("/auth/password-reset", { email });
export const validateResetToken = (token) => api.get(`/auth/action-token/${token}`);
export const resetPasswordWithToken = (token, new_password) => api.post(`/auth/action-token/${token}/use`, { new_password });
