/**
 * Calcula la duración en horas entre dos tiempos
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
}

/**
 * Formatea tiempo desde formato HH:MM:SS a HH:MM
 */
export const formatTimeSlot = (time: string): string => {
  return time.slice(0, 5)
}

/**
 * Genera opciones de tiempo cada 30 minutos
 */
export const generateTimeOptions = (startHour = 0, endHour = 24): string[] => {
  const options: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    options.push(`${hour.toString().padStart(2, "0")}:00`)
    options.push(`${hour.toString().padStart(2, "0")}:30`)
  }
  return options
}

/**
 * Verifica si un tiempo está dentro del horario laboral
 */
export const isBusinessHours = (time: string): boolean => {
  const hour = Number.parseInt(time.split(":")[0])
  return hour >= 8 && hour < 20 // 8 AM - 8 PM
}

/**
 * Ordena time slots por hora de inicio
 */
export const sortTimeSlots = <T extends { start_time: string }>(slots: T[]): T[] => {
  return [...slots].sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a.start_time}:00`).getTime()
    const timeB = new Date(`2000-01-01T${b.start_time}:00`).getTime()
    return timeA - timeB
  })
}

/**
 * Calcula el total de horas activas en un conjunto de time slots
 */
export const calculateTotalActiveHours = (
  slots: { start_time: string; end_time: string; is_active: boolean }[],
): number => {
  return slots.reduce((total, slot) => {
    if (!slot.is_active) return total
    return total + calculateDuration(slot.start_time, slot.end_time)
  }, 0)
}

/**
 * Convierte minutos a formato HH:MM
 */
export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

/**
 * Convierte formato de tiempo HH:MM a minutos
 */
export const timeStringToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}
