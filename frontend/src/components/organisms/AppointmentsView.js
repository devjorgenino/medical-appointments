import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import { AppointmentsList } from "@components/molecules/AppointmentsList";
import { AppointmentModal } from "@components/molecules/AppointmentModal";
import { AppointmentFilters } from "@components/molecules/AppointmentFilters";
import ErrorBoundary from "@components/templates/ErrorBoundary";
export function AppointmentsView({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterDate, setFilterDate] = useState(undefined);
    const [filterStatus, setFilterStatus] = useState(undefined);
    const [refreshKey, setRefreshKey] = useState(0);
    const handleAppointmentCreated = () => {
        setRefreshKey((prev) => prev + 1);
        setIsModalOpen(false);
    };
    const canCreate = [1, 2, 3].includes(user.role_id);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: "Gestion de Citas" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "Administra las citas medicas y su programacion" })] }), canCreate && (_jsxs(Button, { onClick: () => setIsModalOpen(true), className: "flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", children: [_jsx(Plus, { className: "h-4 w-4" }), "Nueva Cita"] }))] }), _jsx(AppointmentFilters, { selectedDate: filterDate, onDateChange: setFilterDate, selectedStatus: filterStatus, onStatusChange: setFilterStatus }), _jsx(ErrorBoundary, { children: _jsx(AppointmentsList, { filterDate: filterDate, refreshKey: refreshKey, user: user, setRefreshKey: setRefreshKey, filterStatus: filterStatus }) }), _jsx(AppointmentModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSuccess: handleAppointmentCreated, user: user })] }));
}
