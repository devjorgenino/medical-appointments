import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { AppointmentCard } from "@components/molecules/AppointmentCard";
import { updateAppointment, deleteAppointment } from "@services/appointment";
import { toast } from "@lib/toast";
import useAppointments from "@hooks/appointment/useAppointments";
import { useConfirmModal } from "@hooks/useConfirmModal";
import EmptyState from "@components/molecules/EmptyState";
export function AppointmentsList({ filterDate, refreshKey, user, setRefreshKey, filterStatus }) {
    const { confirm, ConfirmDialog } = useConfirmModal();
    const appointmentsResult = useAppointments({ filterDate, refreshKey, filterStatus });
    const canCreate = [1, 2, 3].includes(user.role_id);
    if (!appointmentsResult) {
        console.error("useAppointments retornó undefined");
        return (_jsxs(Card, { className: "p-12 text-center", children: [_jsx("h3", { className: "text-lg font-medium text-red-600 dark:text-red-400 mb-2", children: "Error al cargar citas" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No se pudo cargar la lista de citas. Por favor, intenta de nuevo." })] }));
    }
    const { appointments, loading } = appointmentsResult;
    const handleUpdate = async (id, data) => {
        try {
            await updateAppointment(id, data);
            toast.success("Cita actualizada");
            setRefreshKey((prev) => prev + 1);
        }
        catch (error) {
            console.error("Error updating appointment:", error);
            if (error && typeof error === 'object' && 'response' in error) {
                const errorResponse = error;
                toast.error(errorResponse.response.data?.detail || "Error al actualizar cita");
            }
            else {
                toast.error("Error al actualizar cita");
            }
        }
    };
    const handleDelete = async (id) => {
        const confirmed = await confirm({
            title: "Cancelar cita",
            message: "¿Estás seguro de cancelar esta cita?",
            confirmText: "Cancelar cita",
            cancelText: "No cancelar",
            variant: "destructive",
        });
        if (!confirmed)
            return;
        try {
            await deleteAppointment(id);
            toast.success("Cita cancelada");
            setRefreshKey((prev) => prev + 1);
        }
        catch (error) {
            console.error("Error deleting appointment:", error);
            if (error && typeof error === 'object' && 'response' in error) {
                const errorResponse = error;
                toast.error(errorResponse.response.data?.detail || "Error al cancelar cita");
            }
            else {
                toast.error("Error al cancelar cita");
            }
        }
    };
    // Agrupar citas por fecha
    const groupedAppointments = {};
    appointments.forEach((app) => {
        const dateKey = format(new Date(app.date), "yyyy-MM-dd");
        if (!groupedAppointments[dateKey])
            groupedAppointments[dateKey] = [];
        groupedAppointments[dateKey].push(app);
    });
    const sortedDates = Object.keys(groupedAppointments).sort();
    if (loading) {
        return (_jsx("div", { className: "space-y-6", children: [...Array(3)].map((_, i) => (_jsxs(Card, { className: "p-4 animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" }), _jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" })] }, i))) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [sortedDates.map((dateKey) => {
                const dayAppointments = groupedAppointments[dateKey];
                const date = new Date(dateKey);
                const appointmentCount = dayAppointments.length;
                return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CalendarIcon, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: format(date, "dd 'de' MMMM, yyyy", { locale: es }) })] }), _jsxs(Badge, { variant: "secondary", className: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", children: [appointmentCount, " ", appointmentCount === 1 ? "Cita" : "Citas"] })] }), _jsx("div", { className: "space-y-3", children: dayAppointments.map((app) => (_jsx(AppointmentCard, { appointment: {
                                    id: app.code,
                                    patientName: app.patient?.nombre && app.patient?.apellido
                                        ? `${app.patient.nombre} ${app.patient.apellido}`.trim()
                                        : `Paciente ID ${app.patient?.id || "desconocido"}`,
                                    doctorName: app.doctor?.nombre && app.doctor?.apellido
                                        ? `${app.doctor.nombre} ${app.doctor.apellido}`.trim()
                                        : `Doctor ID ${app.doctor?.id || "desconocido"}`,
                                    date: new Date(app.date),
                                    time: app.time_slot
                                        ? `${app.time_slot.start_time.slice(0, 5)} - ${app.time_slot.end_time.slice(0, 5)}`
                                        : "N/A",
                                    type: app.type,
                                    status: app.status ? app.status.name.toLowerCase() : "desconocido",
                                    patientUserId: app.patient?.user_id ?? undefined,
                                }, onUpdate: (updatedData) => handleUpdate(app.id, updatedData), onDelete: () => handleDelete(app.id), user: user }, app.id))) })] }, dateKey));
            }), appointments.length === 0 && (_jsx(EmptyState, { icon: "appointments", title: "No hay citas programadas", description: filterDate || filterStatus
                    ? "No se encontraron citas con los filtros aplicados. Prueba ajustando los filtros o creando una nueva cita."
                    : "Comienza creando una nueva cita médica para gestionar las appointments del sistema.", size: "lg" })), _jsx(ConfirmDialog, {})] }));
}
