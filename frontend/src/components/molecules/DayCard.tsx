import type React from "react"
import { useState, useCallback } from "react"
import { Plus, Clock } from "lucide-react"
import { Button } from "@components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { Label } from "@components/ui/label"
import { Switch } from "@components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { TimeSlotItem } from "@components/molecules/TimeSlotItem"
import { toast } from "@lib/toast"
import { DAYS_OF_WEEK } from "@lib/daysofweek"
import type { TimeSlot, DaySchedule } from "@src/types/schedule"
import { isValidTimeRange } from "@utils/validation"
import { calculateTotalActiveHours } from "@utils/time"

interface DayCardProps {
  dayInfo: { key: string; label: string; short: string }
  schedule: DaySchedule
  timeOptions: string[]
  onToggleDay: (day: string, scheduleId?: number) => void
  onAddTimeSlot: (day: string, slot: TimeSlot) => void
  onDeleteTimeSlot: (day: string, slotId: number) => void
  onToggleTimeSlotActive: (scheduleId: number, slotId: number) => void
  onCopySchedule: (fromDay: string, toDay: string) => void
  onEditTimeSlot: (day: string, slot: TimeSlot) => void
  availableDays: { key: string; label: string }[]
}

export const DayCard: React.FC<DayCardProps> = ({
  dayInfo,
  schedule,
  timeOptions,
  onToggleDay,
  onAddTimeSlot,
  onDeleteTimeSlot,
  onToggleTimeSlotActive,
  onCopySchedule,
  onEditTimeSlot,
  availableDays,
}) => {
  const [isAddingSlot, setIsAddingSlot] = useState(false)
  const [newSlot, setNewSlot] = useState({
    start_time: "09:00",
    end_time: "10:00",
    is_active: true,
  })

  const totalHours = calculateTotalActiveHours(schedule.time_slots)

  const handleAddSlot = () => {
    if (!isValidTimeRange(newSlot.start_time, newSlot.end_time)) {
      toast.error("La hora de fin debe ser posterior a la hora de inicio.")
      return
    }
    onAddTimeSlot(dayInfo.key, newSlot)
    setIsAddingSlot(false)
    setNewSlot({ start_time: "09:00", end_time: "10:00", is_active: true })
    toast.success("El nuevo horario ha sido agregado exitosamente.")
  }

  const handleDelete = useCallback(
    (slotId: number) => {
      if (!slotId) {
        toast.error("No se puede eliminar: el horario no está guardado en el servidor.")
        return
      }
      if (typeof dayInfo.key !== "string" || !DAYS_OF_WEEK.some((d) => d.key === dayInfo.key)) {
        toast.error("Error: el día no es válido.")
        return
      }
      onDeleteTimeSlot(dayInfo.key, slotId)
    },
    [dayInfo, onDeleteTimeSlot],
  )

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 ${
        schedule.is_enabled ? "border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900" : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dayInfo.label}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {schedule.is_enabled ? (
                <span className="font-medium text-green-600 dark:text-green-400">{totalHours}h disponibles</span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">No disponible</span>
              )}
            </p>
          </div>
          <Switch
            checked={schedule.is_enabled}
            onCheckedChange={() => onToggleDay(dayInfo.key, schedule.id)}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>
      {schedule.is_enabled && (
        <div className="p-6">
          <div className="space-y-3">
            {schedule.time_slots.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Sin horarios configurados</p>
              </div>
            ) : (
              schedule.time_slots.map((slot, index) => (
                <TimeSlotItem
                  key={slot.id || `new-${index}`}
                  slot={slot}
                  onEdit={() => onEditTimeSlot(dayInfo.key, slot)}
                  onDelete={() => handleDelete(slot.id!)}
                  onToggleActive={() => schedule.id && slot.id && onToggleTimeSlotActive(schedule.id, slot.id)}
                />
              ))
            )}
          </div>
          <Dialog open={isAddingSlot} onOpenChange={(open) => setIsAddingSlot(open)}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 mt-4 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-transparent"
                onClick={() => setIsAddingSlot(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar horario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Agregar horario - {dayInfo.label}</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Configure un nuevo bloque de tiempo disponible para este día.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hora de inicio</Label>
                    <Select
                      value={newSlot.start_time}
                      onValueChange={(value) => setNewSlot((prev) => ({ ...prev, start_time: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hora de fin</Label>
                    <Select
                      value={newSlot.end_time}
                      onValueChange={(value) => setNewSlot((prev) => ({ ...prev, end_time: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex space-x-3">
                <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddSlot}>Agregar horario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Select onValueChange={(fromDay) => onCopySchedule(fromDay, dayInfo.key)}>
            <SelectTrigger className="w-full mt-3 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="Copiar desde otro día..." />
            </SelectTrigger>
            <SelectContent>
              {availableDays.map((day) => (
                <SelectItem key={day.key} value={day.key}>
                  Copiar desde {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
