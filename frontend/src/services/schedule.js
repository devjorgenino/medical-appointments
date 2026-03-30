import api from "./api";
// Funciones para las solicitudes de horarios
export const getSchedules = () => api.get("/schedules/");
export const createSchedule = (data) => api.post("/schedules/", data);
export const toggleScheduleEnabled = (scheduleId) => api.patch(`/schedules/${scheduleId}/toggle`);
export const toggleTimeSlotActive = (scheduleId, timeslotId) => api.patch(`/schedules/${scheduleId}/timeslot/${timeslotId}/toggle`);
export const updateTimeSlot = (scheduleId, timeslotId, timeslot) => api.put(`/schedules/${scheduleId}/timeslot/${timeslotId}`, timeslot);
export const deleteTimeSlot = (scheduleId, timeslotId) => api.delete(`/schedules/${scheduleId}/timeslot/${timeslotId}`);
export const getAvailableTimeSlots = (doctor_id, date) => api.get(`/schedules/time-slots/`, { params: { doctor_id, date } });
