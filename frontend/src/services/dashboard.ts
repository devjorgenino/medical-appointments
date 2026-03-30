import api from "./api";

// Obtener estadísticas generales del dashboard
export const getDashboardStats = () => api.get("/dashboard/stats");

// Obtener datos para gráficos
export const getAppointmentsTrend = () => api.get("/dashboard/appointments-trend");

// Obtener próximas citas
export const getUpcomingAppointments = (limit = 5) => 
  api.get(`/dashboard/upcoming-appointments?limit=${limit}`);
