import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback } from "react";
import { Plus, Edit, Trash2, User, UserCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import useDoctors from "@hooks/doctor/useDoctors";
import DoctorCard from "@components/molecules/DoctorCard";
import EmptyState from "@components/molecules/EmptyState";
const ROLE_OPTIONS = [{ value: "3", label: "Medico" }];
const getRoleIcon = (roleId) => {
    if (roleId === 3) {
        return _jsx(User, { className: "w-4 h-4 text-gray-600 dark:text-gray-400", "aria-hidden": "true" });
    }
};
const getRoleBadge = (roleId) => {
    const role = ROLE_OPTIONS.find((r) => r.value === roleId.toString());
    const colors = {
        3: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
    };
    return (_jsxs("span", { className: `inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[roleId]}`, children: [getRoleIcon(roleId), _jsx("span", { className: "ml-1", children: role?.label })] }));
};
const UsersDoctorPage = memo(({ user }) => {
    const navigate = useNavigate();
    const { doctors, setNewDoctor, setEditDoctor, handleDelete, ConfirmDialog } = useDoctors(Number(user.role_id));
    const handleScheduleAppointment = useCallback((doctorId) => {
        navigate("/appointments", {
            state: { selectedDoctorId: doctorId, openModal: true },
        });
    }, [navigate]);
    const handleCreate = useCallback(() => {
        navigate("/doctor");
    }, [navigate]);
    const handleEdit = useCallback((u) => {
        setNewDoctor({
            email: u.email,
            password: "",
            role_id: u.role_id,
            nombre: u.nombre,
            apellido: u.apellido,
            numero_telefono: u.numero_telefono || "",
            direccion: u.direccion || "",
            sexo: u.sexo || "",
            especialidad: u.especialidad || "",
        });
        setEditDoctor(u);
        navigate("/doctor", {
            state: {
                infoUser: u,
            },
        });
    }, [setNewDoctor, setEditDoctor, navigate]);
    if (![1, 2, 3].includes(Number(user.role_id))) {
        return _jsx(NotAuthorized, {});
    }
    // Vista de tarjetas para pacientes (role_id === 2)
    if (user.role_id === 2) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Nuestros Doctores" }), _jsx("p", { className: "mt-1 text-gray-600 dark:text-gray-400", children: "Encuentra al doctor ideal para ti y agenda tu cita" })] }) }), doctors.length === 0 ? (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center", role: "status", children: [_jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full", children: _jsx(UserCheck, { className: "w-8 h-8 text-gray-400 dark:text-gray-500", "aria-hidden": "true" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No hay doctores disponibles" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Por el momento no hay doctores registrados en el sistema." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", role: "list", "aria-label": "Lista de doctores disponibles", children: doctors.map((doctor) => (_jsx("div", { role: "listitem", children: _jsx(DoctorCard, { doctor: doctor, onScheduleAppointment: handleScheduleAppointment }) }, doctor.id))) }))] }));
    }
    // Vista de tabla para admins y doctores
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Gestion de Doctores" }), _jsx("p", { className: "mt-1 text-gray-600 dark:text-gray-400", children: "Administra los doctores en el sistema" })] }), (user.role_id === 1 || user.role_id === 3) && (_jsx("div", { children: _jsxs(Button, { type: "button", className: "flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2", onClick: handleCreate, "aria-label": "Crear nuevo doctor", children: [_jsx(Plus, { className: "w-4 h-4", "aria-hidden": "true" }), _jsx("span", { children: "Crear Doctor" })] }) }))] }), _jsx("div", { className: "overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl", children: doctors.length === 0 ? (_jsx(EmptyState, { icon: "doctors", title: "No hay doctores registrados", description: "Comienza agregando doctores al sistema para gestionar sus especialidades y horarios.", size: "lg" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", role: "table", "aria-label": "Lista de doctores", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700/50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "ID" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Usuario" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Nombre Completo" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Rol" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Contacto" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Especialidad" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: doctors.map((u) => (_jsxs("tr", { className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50", children: [_jsxs("td", { className: "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap", children: ["#", u.id] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full", children: _jsx(User, { className: "w-4 h-4 text-gray-500 dark:text-gray-400", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: u.email }) })] }) }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap", children: [u.nombre, " ", u.apellido] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getRoleBadge(u.role_id) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap", children: u.numero_telefono || "N/A" }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap", children: (() => {
                                                if (typeof u.especialidad === "string") {
                                                    return u.especialidad;
                                                }
                                                else if (u.especialidad) {
                                                    return JSON.stringify(u.especialidad);
                                                }
                                                return "---";
                                            })() }), _jsx("td", { className: "px-6 py-4 text-sm font-medium whitespace-nowrap", children: _jsxs("div", { className: "flex space-x-2", role: "group", "aria-label": `Acciones para Dr. ${u.nombre} ${u.apellido}`, children: [_jsx(Button, { className: "p-1 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300", variant: "outline", onClick: () => handleEdit(u), "aria-label": `Editar doctor ${u.nombre} ${u.apellido}`, children: _jsx(Edit, { className: "w-4 h-4", "aria-hidden": "true" }) }), _jsx(Button, { className: "p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300", variant: "outline", onClick: () => handleDelete(u.id), "aria-label": `Eliminar doctor ${u.nombre} ${u.apellido}`, children: _jsx(Trash2, { className: "w-4 h-4", "aria-hidden": "true" }) })] }) })] }, u.id))) })] }) })) }), _jsx(ConfirmDialog, {})] }));
});
UsersDoctorPage.displayName = 'UsersDoctorPage';
export default UsersDoctorPage;
