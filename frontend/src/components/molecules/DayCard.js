import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { Plus, Clock } from "lucide-react";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { TimeSlotItem } from "@components/molecules/TimeSlotItem";
import { toast } from "@lib/toast";
import { DAYS_OF_WEEK } from "@lib/daysofweek";
import { isValidTimeRange } from "@utils/validation";
import { calculateTotalActiveHours } from "@utils/time";
export const DayCard = ({ dayInfo, schedule, timeOptions, onToggleDay, onAddTimeSlot, onDeleteTimeSlot, onToggleTimeSlotActive, onCopySchedule, onEditTimeSlot, availableDays, }) => {
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [newSlot, setNewSlot] = useState({
        start_time: "09:00",
        end_time: "10:00",
        is_active: true,
    });
    const totalHours = calculateTotalActiveHours(schedule.time_slots);
    const handleAddSlot = () => {
        if (!isValidTimeRange(newSlot.start_time, newSlot.end_time)) {
            toast.error("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }
        onAddTimeSlot(dayInfo.key, newSlot);
        setIsAddingSlot(false);
        setNewSlot({ start_time: "09:00", end_time: "10:00", is_active: true });
        toast.success("El nuevo horario ha sido agregado exitosamente.");
    };
    const handleDelete = useCallback((slotId) => {
        if (!slotId) {
            toast.error("No se puede eliminar: el horario no está guardado en el servidor.");
            return;
        }
        if (typeof dayInfo.key !== "string" || !DAYS_OF_WEEK.some((d) => d.key === dayInfo.key)) {
            toast.error("Error: el día no es válido.");
            return;
        }
        onDeleteTimeSlot(dayInfo.key, slotId);
    }, [dayInfo, onDeleteTimeSlot]);
    return (_jsxs("div", { className: `bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 ${schedule.is_enabled ? "border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900" : "border-gray-200 dark:border-gray-700"}`, children: [_jsx("div", { className: "p-6 border-b border-gray-100 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: dayInfo.label }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: schedule.is_enabled ? (_jsxs("span", { className: "font-medium text-green-600 dark:text-green-400", children: [totalHours, "h disponibles"] })) : (_jsx("span", { className: "text-gray-400 dark:text-gray-500", children: "No disponible" })) })] }), _jsx(Switch, { checked: schedule.is_enabled, onCheckedChange: () => onToggleDay(dayInfo.key, schedule.id), className: "data-[state=checked]:bg-blue-600" })] }) }), schedule.is_enabled && (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "space-y-3", children: schedule.time_slots.length === 0 ? (_jsxs("div", { className: "py-8 text-center", children: [_jsx(Clock, { className: "w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Sin horarios configurados" })] })) : (schedule.time_slots.map((slot, index) => (_jsx(TimeSlotItem, { slot: slot, onEdit: () => onEditTimeSlot(dayInfo.key, slot), onDelete: () => handleDelete(slot.id), onToggleActive: () => schedule.id && slot.id && onToggleTimeSlotActive(schedule.id, slot.id) }, slot.id || `new-${index}`)))) }), _jsxs(Dialog, { open: isAddingSlot, onOpenChange: (open) => setIsAddingSlot(open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: "w-full p-3 mt-4 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-transparent", onClick: () => setIsAddingSlot(true), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Agregar horario"] }) }), _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "text-xl font-semibold", children: ["Agregar horario - ", dayInfo.label] }), _jsx(DialogDescription, { className: "text-gray-600 dark:text-gray-400", children: "Configure un nuevo bloque de tiempo disponible para este d\u00EDa." })] }), _jsx("div", { className: "grid gap-6 py-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Hora de inicio" }), _jsxs(Select, { value: newSlot.start_time, onValueChange: (value) => setNewSlot((prev) => ({ ...prev, start_time: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: timeOptions.map((time) => (_jsx(SelectItem, { value: time, children: time }, time))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Hora de fin" }), _jsxs(Select, { value: newSlot.end_time, onValueChange: (value) => setNewSlot((prev) => ({ ...prev, end_time: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: timeOptions.map((time) => (_jsx(SelectItem, { value: time, children: time }, time))) })] })] })] }) }), _jsxs(DialogFooter, { className: "flex space-x-3", children: [_jsx(Button, { variant: "outline", onClick: () => setIsAddingSlot(false), children: "Cancelar" }), _jsx(Button, { onClick: handleAddSlot, children: "Agregar horario" })] })] })] }), _jsxs(Select, { onValueChange: (fromDay) => onCopySchedule(fromDay, dayInfo.key), children: [_jsx(SelectTrigger, { className: "w-full mt-3 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600", children: _jsx(SelectValue, { placeholder: "Copiar desde otro d\u00EDa..." }) }), _jsx(SelectContent, { children: availableDays.map((day) => (_jsxs(SelectItem, { value: day.key, children: ["Copiar desde ", day.label] }, day.key))) })] })] }))] }));
};
