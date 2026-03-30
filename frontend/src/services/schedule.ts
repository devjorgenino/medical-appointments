import api from "./api"
import type { ScheduleCreate as ScheduleCreateType, TimeSlotBase as TimeSlotBaseType } from "@src/types/schedule"

// Funciones para las solicitudes de horarios
export const getSchedules = () => api.get("/schedules/")

export const createSchedule = (data: ScheduleCreateType[]) => api.post("/schedules/", data)

export const toggleScheduleEnabled = (scheduleId: number) => api.patch(`/schedules/${scheduleId}/toggle`)

export const toggleTimeSlotActive = (scheduleId: number, timeslotId: number) =>
  api.patch(`/schedules/${scheduleId}/timeslot/${timeslotId}/toggle`)

export const updateTimeSlot = (scheduleId: number, timeslotId: number, timeslot: TimeSlotBaseType) =>
  api.put(`/schedules/${scheduleId}/timeslot/${timeslotId}`, timeslot)

export const deleteTimeSlot = (scheduleId: number, timeslotId: number) =>
  api.delete(`/schedules/${scheduleId}/timeslot/${timeslotId}`)

export const getAvailableTimeSlots = (doctor_id: number, date: string) =>
  api.get(`/schedules/time-slots/`, { params: { doctor_id, date } })
