import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, Save } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@components/ui/select";
import { DayCard } from "@components/molecules/DayCard";
import { toast } from "@lib/toast";
import useSchedules from "@hooks/schedule/useSchedules";
import { DAYS_OF_WEEK } from "@lib/daysofweek";
import { isValidTimeRange, hasTimeSlotOverlap } from "@utils/validation";
import { calculateTotalActiveHours, generateTimeOptions } from "@utils/time";
const TIME_OPTIONS = generateTimeOptions(0, 24);
const getTotalHours = (timeSlots) => {
    return calculateTotalActiveHours(timeSlots);
};
export const ScheduleManager = ({ user }) => {
    const { schedules, error, setError, handleAddSchedule, toggleScheduleEnabled, toggleTimeSlotActive, updateTimeSlot, deleteTimeSlot: apiDeleteTimeSlot, } = useSchedules();
    const [schedulesState, setSchedulesState] = useState(DAYS_OF_WEEK.map(({ key }) => ({
        day: key,
        is_enabled: false,
        time_slots: [],
    })));
    const [editingSlot, setEditingSlot] = useState(null);
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
    const toggleDay = async (day, scheduleId) => {
        if (scheduleId) {
            await toggleScheduleEnabled(scheduleId);
        }
        else {
            setSchedulesState((prev) => prev.map((s) => s.day === day ? { ...s, is_enabled: !s.is_enabled } : s));
        }
    };
    const addTimeSlot = async (day, slot) => {
        if (!isValidTimeRange(slot.start_time, slot.end_time)) {
            toast.error("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }
        const schedule = schedulesState.find((s) => s.day === day);
        const newSchedule = {
            doctor_id: user.id,
            day,
            is_enabled: schedule?.is_enabled ?? true,
            time_slots: [...(schedule?.time_slots || []), { ...slot, id: undefined }],
        };
        await handleAddSchedule([newSchedule]);
    };
    const deleteTimeSlot = async (day, slotId) => {
        const schedule = schedulesState.find((s) => s.day === day);
        if (!schedule?.id) {
            toast.error("No se puede eliminar: el horario no está guardado en el servidor.");
            return;
        }
        if (typeof day !== "string" || !DAYS_OF_WEEK.some((d) => d.key === day)) {
            toast.error("Error: el día no es válido.");
            return;
        }
        await apiDeleteTimeSlot(schedule.id, slotId);
    };
    const openEditTimeSlot = (day, slot) => {
        setEditingSlot({ day, slot });
    };
    const editTimeSlot = async (day, slot) => {
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
        if (hasTimeSlotOverlap({ start_time: slot.start_time, end_time: slot.end_time }, schedule.time_slots, slot.id)) {
            setError("El horario se superpone con otro existente. Ajuste los horarios adyacentes.");
            toast.error("El horario se superpone con otro existente. Ajuste los horarios adyacentes.");
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
            setSchedulesState((prev) => prev.map((s) => s.day === day
                ? {
                    ...s,
                    time_slots: s.time_slots.map((ts) => ts.id === slot.id ? { ...slot } : ts),
                }
                : s));
            setEditingSlot(null);
            toast.success("Horario actualizado exitosamente.");
        }
        catch (error) {
            const errorMessage = error.response?.data?.detail || "Error al actualizar el horario.";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };
    const copyScheduleToDay = async (fromDay, toDay) => {
        const fromSchedule = schedulesState.find((s) => s.day === fromDay);
        if (!fromSchedule) {
            toast.error(`No se encontró horario para ${fromDay}.`);
            return;
        }
        const newSchedule = {
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
            const seen = new Set();
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
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: "Gesti\u00F3n de Horarios" }), _jsx("p", { className: "mt-2 text-sm text-gray-600 dark:text-gray-400", children: "Configure los horarios disponibles para las citas m\u00E9dicas." })] }), _jsxs(Button, { type: "button", className: "flex items-center justify-center  text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", onClick: handleSaveSchedules, children: [_jsx(Save, { className: "w-4 h-4" }), "Guardar Horarios"] })] }), error && (_jsx("div", { className: "p-4 mb-4 text-red-700 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/30", children: error })), _jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [_jsxs(Card, { className: "md:col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [_jsx(CardHeader, { className: "border-b border-gray-200 dark:border-gray-700", children: _jsx(CardTitle, { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Resumen" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: _jsx(Calendar, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "D\u00EDas activos" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: schedulesState.filter((s) => s.is_enabled).length })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg", children: _jsx(Users, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Bloques de tiempo" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: schedulesState.reduce((total, s) => total + s.time_slots.length, 0) })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg", children: _jsx(TrendingUp, { className: "w-5 h-5 text-orange-600 dark:text-orange-400" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Promedio diario" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [Math.round(schedulesState.reduce((total, s) => total + getTotalHours(s.time_slots), 0) /
                                                                    (schedulesState.filter((s) => s.is_enabled).length || 1)), "h"] })] })] })] }) })] }), schedulesState.map((schedule) => {
                        const dayInfo = DAYS_OF_WEEK.find((d) => d.key === schedule.day);
                        if (!dayInfo) {
                            return null;
                        }
                        return (_jsx(DayCard, { dayInfo: dayInfo, schedule: schedule, timeOptions: TIME_OPTIONS, onToggleDay: toggleDay, onAddTimeSlot: addTimeSlot, onDeleteTimeSlot: deleteTimeSlot, onToggleTimeSlotActive: toggleTimeSlotActive, onCopySchedule: copyScheduleToDay, onEditTimeSlot: openEditTimeSlot, availableDays: DAYS_OF_WEEK.filter((d) => d.key !== schedule.day) }, schedule.day));
                    })] }), _jsx(Dialog, { open: !!editingSlot, onOpenChange: (open) => !open && setEditingSlot(null), children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-semibold", children: "Editar horario" }), _jsx(DialogDescription, { className: "text-gray-600 dark:text-gray-400", children: "Modifique los detalles del horario seleccionado." })] }), editingSlot && (_jsxs("div", { className: "grid gap-6 py-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Hora de inicio" }), _jsxs(Select, { value: editingSlot.slot.start_time, onValueChange: (value) => setEditingSlot((prev) => prev
                                                        ? {
                                                            ...prev,
                                                            slot: { ...prev.slot, start_time: value },
                                                        }
                                                        : null), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: TIME_OPTIONS.map((time) => (_jsx(SelectItem, { value: time, children: time }, time))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Hora de fin" }), _jsxs(Select, { value: editingSlot.slot.end_time, onValueChange: (value) => setEditingSlot((prev) => prev
                                                        ? { ...prev, slot: { ...prev.slot, end_time: value } }
                                                        : null), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: TIME_OPTIONS.map((time) => (_jsx(SelectItem, { value: time, children: time }, time))) })] })] })] }), _jsxs("div", { className: "flex items-center p-4 space-x-3 rounded-lg bg-gray-50 dark:bg-gray-700/50", children: [_jsx(Switch, { id: "active", checked: editingSlot.slot.is_active, onCheckedChange: (checked) => setEditingSlot((prev) => prev
                                                ? {
                                                    ...prev,
                                                    slot: { ...prev.slot, is_active: checked },
                                                }
                                                : null), className: "data-[state=checked]:bg-blue-600" }), _jsx(Label, { htmlFor: "active", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Horario activo" })] })] })), _jsxs(DialogFooter, { className: "flex space-x-3", children: [_jsx(Button, { variant: "outline", onClick: () => setEditingSlot(null), children: "Cancelar" }), _jsx(Button, { onClick: () => {
                                        if (editingSlot) {
                                            editTimeSlot(editingSlot.day, editingSlot.slot);
                                        }
                                    }, children: "Guardar cambios" })] })] }) })] }));
};
