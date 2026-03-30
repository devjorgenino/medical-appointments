import api from "./api";
// Funciones para las solicitudes de usuarios
export const getProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);
export const changePassword = (data) => api.patch("/profile/password", data);
