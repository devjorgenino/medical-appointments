import api from "./api";
// Funciones para las solicitudes de pacientes
export const getPatients = () => api.get("/patients");
export const createPatient = (data) => api.post("/patients", data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);
export const getMyPatients = () => api.get("/patients/me");
