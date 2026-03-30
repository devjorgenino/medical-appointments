import { useState, useEffect } from "react";
import { getSchedules, createSchedule, toggleScheduleEnabled as apiToggleScheduleEnabled, toggleTimeSlotActive as apiToggleTimeSlotActive, updateTimeSlot as apiUpdateTimeSlot, deleteTimeSlot as apiDeleteTimeSlot, } from "@services/schedule";
import { toast } from "@lib/toast";
import { formatTimeSlot } from "@utils/time";
import { extractErrorMessage } from "@utils/error-handler";
const useSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);
    // Función reutilizable para manejar errores
    const handleError = (error, defaultMessage, context) => {
        console.error(`Error in ${context}:`, error);
        if (error?.message === "Network Error" || !error?.response) {
            const networkError = "Error de conexión. Verifica tu conexión a internet o que el servidor esté funcionando.";
            setError(networkError);
            toast.error(networkError);
            return;
        }
        if (error?.response?.status === 401) {
            const authError = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            setError(authError);
            toast.error(authError);
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return;
        }
        if (error?.response?.status === 403) {
            const forbiddenError = "No tienes permisos para realizar esta acción.";
            setError(forbiddenError);
            toast.error(forbiddenError);
            return;
        }
        const errorMessage = extractErrorMessage(error, defaultMessage);
        setError(errorMessage);
        toast.error(errorMessage);
    };
    const formatScheduleTimeSlots = (schedule) => ({
        ...schedule,
        is_enabled: schedule.is_enabled ?? schedule.time_slots.length > 0,
        time_slots: schedule.time_slots.map((slot) => ({
            ...slot,
            start_time: formatTimeSlot(slot.start_time),
            end_time: formatTimeSlot(slot.end_time),
            is_active: slot.is_active ?? true,
        })),
    });
    const fetchSchedules = async () => {
        try {
            console.log("Fetching schedules...");
            const { data } = await getSchedules();
            console.log("Schedules response:", data);
            const formattedSchedules = data.map(formatScheduleTimeSlots);
            setSchedules(formattedSchedules);
            setError(null);
        }
        catch (error) {
            handleError(error, "Error al obtener los horarios.", "fetchSchedules");
        }
    };
    const handleAddSchedule = async (schedules) => {
        try {
            console.log("Creating schedules:", schedules);
            await createSchedule(schedules);
            setError(null);
            await fetchSchedules();
            toast.success("Horario agregado y guardado exitosamente.");
        }
        catch (error) {
            handleError(error, "Error al guardar los horarios.", "handleAddSchedule");
            throw error;
        }
    };
    const toggleScheduleEnabled = async (scheduleId) => {
        try {
            const { data } = await apiToggleScheduleEnabled(scheduleId);
            setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? formatScheduleTimeSlots(data) : s)));
            setError(null);
            toast.success("Horario actualizado exitosamente.");
        }
        catch (error) {
            handleError(error, "Error al actualizar el horario.", "toggleScheduleEnabled");
        }
    };
    const toggleTimeSlotActive = async (scheduleId, timeslotId) => {
        try {
            const { data } = await apiToggleTimeSlotActive(scheduleId, timeslotId);
            setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? formatScheduleTimeSlots(data) : s)));
            setError(null);
            toast.success("Estado de la franja horaria actualizado.");
        }
        catch (error) {
            handleError(error, "Error al actualizar la franja horaria.", "toggleTimeSlotActive");
        }
    };
    const deleteTimeSlot = async (scheduleId, timeslotId) => {
        try {
            const { data } = await apiDeleteTimeSlot(scheduleId, timeslotId);
            setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? formatScheduleTimeSlots(data) : s)));
            setError(null);
            toast.success("Horario eliminado exitosamente.");
        }
        catch (error) {
            handleError(error, "Error al eliminar la franja horaria.", "deleteTimeSlot");
            throw error;
        }
    };
    const updateTimeSlot = async (scheduleId, timeslotId, timeslot) => {
        try {
            const { data } = await apiUpdateTimeSlot(scheduleId, timeslotId, timeslot);
            setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? formatScheduleTimeSlots(data) : s)));
            setError(null);
            toast.success("Franja horaria actualizada exitosamente.");
        }
        catch (error) {
            handleError(error, "Error al actualizar la franja horaria.", "updateTimeSlot");
        }
    };
    useEffect(() => {
        fetchSchedules();
    }, []);
    return {
        schedules,
        error,
        setError,
        fetchSchedules,
        handleAddSchedule,
        toggleScheduleEnabled,
        toggleTimeSlotActive,
        updateTimeSlot,
        deleteTimeSlot,
    };
};
export default useSchedules;
