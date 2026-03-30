export interface TimeSlot {
  id?: number
  start_time: string
  end_time: string
  is_active: boolean
}

export interface TimeSlotBase {
  start_time: string
  end_time: string
  is_active: boolean
}

export interface Schedule {
  id: number
  doctor_id: number
  day: string
  is_enabled: boolean
  time_slots: TimeSlot[]
}

export interface ScheduleCreate {
  doctor_id: number
  day: string
  is_enabled: boolean
  time_slots: TimeSlotBase[]
}

export interface DaySchedule {
  id?: number
  day: string
  is_enabled: boolean
  time_slots: TimeSlot[]
}
