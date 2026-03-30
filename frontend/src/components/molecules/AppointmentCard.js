import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { MoreVertical } from "lucide-react";
export function AppointmentCard({ appointment, onUpdate, onDelete, user }) {
    const isOwn = user.role_id === 2 && appointment.patientUserId === user.id;
    const canEdit = [1, 3].includes(user.role_id) || isOwn;
    const canDelete = [1, 2, 3].includes(user.role_id);
    const statusVariant = appointment.status === 'próxima' ? 'default' :
        appointment.status === 'pasada' ? 'secondary' :
            appointment.status === 'cancelada' ? 'destructive' : 'outline';
    return (_jsx(Card, { className: "p-4 hover:shadow-md transition-shadow dark:bg-gray-800/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: appointment.type }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Paciente: ", appointment.patientName] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Doctor: ", appointment.doctorName] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Fecha: ", appointment.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Hora: ", appointment.time] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: statusVariant, children: appointment.status }), canEdit && onUpdate && _jsx(Button, { variant: "outline", size: "sm", onClick: () => onUpdate(appointment.id), children: "Editar" }), canDelete && onDelete && _jsx(Button, { variant: "destructive", size: "sm", onClick: onDelete, children: "Cancelar" }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreVertical, { className: "h-4 w-4" }) })] })] }) }));
}
