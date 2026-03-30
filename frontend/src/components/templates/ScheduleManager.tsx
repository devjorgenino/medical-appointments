import type React from "react";

import { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, Save } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { DayCard } from "@components/molecules/DayCard";
import { toast } from "@lib/toast";
import useSchedules from "@hooks/schedule/useSchedules";
import { DAYS_OF_WEEK } from "@lib/daysofweek";
import type {
  TimeSlot,
  DaySchedule,
  ScheduleCreate,
} from "@src/types/schedule";
import { isValidTimeRange, hasTimeSlotOverlap } from "@utils/validation";
import { calculateTotalActiveHours, generateTimeOptions } from "@utils/time";

interface ScheduleManagerProps {
  user: { id: number; email: string; role_id: number };
}

const TIME_OPTIONS = generateTimeOptions(0, 24);

const getTotalHours = (timeSlots: TimeSlot[]) => {
  return calculateTotalActiveHours(timeSlots);
};

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ user }) => {
  const {
    schedules,
    error,
    setError,
    handleAddSchedule,
    toggleScheduleEnabled,
    toggleTimeSlotActive,
    updateTimeSlot,
    deleteTimeSlot: apiDeleteTimeSlot,
  } = useSchedules();

  const [schedulesState, setSchedulesState] = useState<DaySchedule[]>(
    DAYS_OF_WEEK.map(({ key }) => ({
      day: key,
      is_enabled: false,
      time_slots: [],
    }))
  );

  const [editingSlot, setEditingSlot] = useState<{
    day: string;
    slot: TimeSlot;
  } | null>(null);

  useEffect(() => {
    const newSchedulesState = DAYS_OF_WEEK.map(({ key }) => {
      const schedule = schedules.find((s) => s.day === key) || {
        day: key,
        time_slots: [],
        is_enabled: false,
      };
      return {
        id: 'id' in schedule ? schedule.id : undefined,
        day: key,
        is_enabled: schedule.is_enabled,
        time_slots: schedule.time_slots,
      };
    });
    setSchedulesState((prev) => {
      if (JSON.stringify(newSchedulesState) !== JSON.stringify(prev)) {
        return newSchedulesState;
      }
      return prev;
    });
  }, [schedules]);

  const toggleDay = async (day: string, scheduleId?: number) => {
    if (scheduleId) {
      await toggleScheduleEnabled(scheduleId);
    } else {
      setSchedulesState((prev) =>
        prev.map((s) =>
          s.day === day ? { ...s, is_enabled: !s.is_enabled } : s
        )
      );
    }
  };

  const addTimeSlot = async (day: string, slot: TimeSlot) => {
    if (!isValidTimeRange(slot.start_time, slot.end_time)) {
      toast.error("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    const schedule = schedulesState.find((s) => s.day === day);
    const newSchedule: ScheduleCreate = {
      doctor_id: user.id,
      day,
      is_enabled: schedule?.is_enabled ?? true,
      time_slots: [...(schedule?.time_slots || []), { ...slot, id: undefined }],
    };

    await handleAddSchedule([newSchedule]);
  };

  const deleteTimeSlot = async (day: string, slotId: number) => {
    const schedule = schedulesState.find((s) => s.day === day);
    if (!schedule?.id) {
      toast.error(
        "No se puede eliminar: el horario no está guardado en el servidor."
      );
      return;
    }
    if (typeof day !== "string" || !DAYS_OF_WEEK.some((d) => d.key === day)) {
      toast.error("Error: el día no es válido.");
      return;
    }

    await apiDeleteTimeSlot(schedule.id, slotId);
  };

  const openEditTimeSlot = (day: string, slot: TimeSlot) => {
    setEditingSlot({ day, slot });
  };

  const editTimeSlot = async (day: string, slot: TimeSlot) => {
    if (!isValidTimeRange(slot.start_time, slot.end_time)) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      toast.error("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    const schedule = schedulesState.find((s) => s.day === day);
    if (!schedule) {
      setError("No se encontró el horario para el día especificado.");
      toast.error("No se encontró el horario para el día especificado.");
      return;
    }

    if (
      hasTimeSlotOverlap(
        { start_time: slot.start_time, end_time: slot.end_time },
        schedule.time_slots,
        slot.id
      )
    ) {
      setError(
        "El horario se superpone con otro existente. Ajuste los horarios adyacentes."
      );
      toast.error(
        "El horario se superpone con otro existente. Ajuste los horarios adyacentes."
      );
      return;
    }

    try {
      if (slot.id && schedule.id) {
        await updateTimeSlot(schedule.id, slot.id, {
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_active: slot.is_active,
        });
      }
      setSchedulesState((prev) =>
        prev.map((s) =>
          s.day === day
            ? {
                ...s,
                time_slots: s.time_slots.map((ts) =>
                  ts.id === slot.id ? { ...slot } : ts
                ),
              }
            : s
        )
      );
      setEditingSlot(null);
      toast.success("Horario actualizado exitosamente.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Error al actualizar el horario.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const copyScheduleToDay = async (fromDay: string, toDay: string) => {
    const fromSchedule = schedulesState.find((s) => s.day === fromDay);
    if (!fromSchedule) {
      toast.error(`No se encontró horario para ${fromDay}.`);
      return;
    }

    const newSchedule: ScheduleCreate = {
      doctor_id: user.id,
      day: toDay,
      is_enabled: true,
      time_slots: fromSchedule.time_slots.map((slot) => ({
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_active: slot.is_active,
      })),
    };

    await handleAddSchedule([newSchedule]);
  };

  const handleSaveSchedules = async () => {
    const schedulesToSave = schedulesState
      .filter((s) => s.is_enabled && s.time_slots.length > 0)
      .map((s) => {
        const uniqueTimeSlots = [];
        const seen = new Set<string>();
        for (const slot of s.time_slots) {
          const key = `${slot.start_time}-${slot.end_time}`;
          if (!seen.has(key) || slot.id) {
            seen.add(key);
            uniqueTimeSlots.push({
              id: slot.id,
              start_time: slot.start_time,
              end_time: slot.end_time,
              is_active: slot.is_active,
            });
          }
        }
        return {
          doctor_id: user.role_id === 3 ? user.id : 0,
          day: s.day,
          is_enabled: s.is_enabled,
          time_slots: uniqueTimeSlots,
        };
      });

    if (schedulesToSave.length === 0) {
      setError("No hay horarios para guardar.");
      toast.error("No hay horarios para guardar.");
      return;
    }

    if (user.role_id === 1 && schedulesToSave.some((s) => s.doctor_id === 0)) {
      setError("Debe especificar un doctor para guardar los horarios.");
      toast.error("Debe especificar un doctor para guardar los horarios.");
      return;
    }

    await handleAddSchedule(schedulesToSave);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gestión de Horarios
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Configure los horarios disponibles para las citas médicas.
          </p>
        </div>
        <Button
          type="button"
          className="flex items-center justify-center  text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={handleSaveSchedules}
        >
          <Save className="w-4 h-4" />
          Guardar Horarios
        </Button>
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/30">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Días activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {schedulesState.filter((s) => s.is_enabled).length}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Bloques de tiempo
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {schedulesState.reduce(
                      (total, s) => total + s.time_slots.length,
                      0
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Promedio diario
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      schedulesState.reduce(
                        (total, s) => total + getTotalHours(s.time_slots),
                        0
                      ) /
                        (schedulesState.filter((s) => s.is_enabled).length || 1)
                    )}
                    h
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {schedulesState.map((schedule) => {
          const dayInfo = DAYS_OF_WEEK.find((d) => d.key === schedule.day);
          if (!dayInfo) {
            return null;
          }
          return (
            <DayCard
              key={schedule.day}
              dayInfo={dayInfo}
              schedule={schedule}
              timeOptions={TIME_OPTIONS}
              onToggleDay={toggleDay}
              onAddTimeSlot={addTimeSlot}
              onDeleteTimeSlot={deleteTimeSlot}
              onToggleTimeSlotActive={toggleTimeSlotActive}
              onCopySchedule={copyScheduleToDay}
              onEditTimeSlot={openEditTimeSlot}
              availableDays={DAYS_OF_WEEK.filter((d) => d.key !== schedule.day)}
            />
          );
        })}
      </div>
      <Dialog
        open={!!editingSlot}
        onOpenChange={(open) => !open && setEditingSlot(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Editar horario
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Modifique los detalles del horario seleccionado.
            </DialogDescription>
          </DialogHeader>
          {editingSlot && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hora de inicio
                  </Label>
                  <Select
                    value={editingSlot.slot.start_time}
                    onValueChange={(value) =>
                      setEditingSlot((prev) =>
                        prev
                          ? {
                              ...prev,
                              slot: { ...prev.slot, start_time: value },
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hora de fin
                  </Label>
                  <Select
                    value={editingSlot.slot.end_time}
                    onValueChange={(value) =>
                      setEditingSlot((prev) =>
                        prev
                          ? { ...prev, slot: { ...prev.slot, end_time: value } }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center p-4 space-x-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Switch
                  id="active"
                  checked={editingSlot.slot.is_active}
                  onCheckedChange={(checked) =>
                    setEditingSlot((prev) =>
                      prev
                        ? {
                            ...prev,
                            slot: { ...prev.slot, is_active: checked },
                          }
                        : null
                    )
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label
                  htmlFor="active"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Horario activo
                </Label>
              </div>
            </div>
          )}
          <DialogFooter className="flex space-x-3">
            <Button variant="outline" onClick={() => setEditingSlot(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (editingSlot) {
                  editTimeSlot(editingSlot.day, editingSlot.slot);
                }
              }}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
