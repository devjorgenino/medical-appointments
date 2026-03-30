import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback } from "react";
import { Plus, Edit, Trash2, User, UserCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import usePatients from "@hooks/patient/usePatients";
import EmptyState from "@components/molecules/EmptyState";
const ROLE_OPTIONS = [{ value: "2", label: "Paciente" }];
const getRoleIcon = (roleId) => {
    if (roleId === 2) {
        return _jsx(UserCheck, { className: "w-4 h-4 text-blue-600 dark:text-blue-400", "aria-hidden": "true" });
    }
};
const getRoleBadge = (roleId) => {
    const role = ROLE_OPTIONS.find((r) => r.value === roleId.toString());
    const colors = {
        1: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        2: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        3: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return (_jsxs("span", { className: `inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colors[roleId]}`, children: [getRoleIcon(roleId), _jsx("span", { className: "ml-1", children: role?.label })] }));
};
const UsersPatientPage = memo(({ user }) => {
    const navigate = useNavigate();
    const { patients, setNewPatient, setEditPatient, handleDelete, ConfirmDialog, } = usePatients(Number(user.role_id));
    const handleEdit = useCallback((u) => {
        setNewPatient({
            email: u.email,
            password: "",
            role_id: u.role_id,
            nombre: u.nombre,
            apellido: u.apellido,
            numero_telefono: u.numero_telefono || "",
            direccion: u.direccion || "",
            sexo: u.sexo || "",
            fecha_nacimiento: u.fecha_nacimiento || "",
        });
        setEditPatient(u);
        navigate("/patient", {
            state: {
                infoUser: u,
            },
        });
    }, [setNewPatient, setEditPatient, navigate]);
    const handleCreate = useCallback(() => {
        navigate("/patient");
    }, [navigate]);
    if (![1, 2, 3].includes(Number(user.role_id))) {
        return _jsx(NotAuthorized, {});
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Gestion de Pacientes" }), _jsx("p", { className: "mt-1 text-gray-600 dark:text-gray-400", children: "Administra los pacientes en el sistema" })] }), _jsx("div", { children: _jsxs(Button, { type: "button", className: "flex items-center justify-center space-x-2 text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", onClick: handleCreate, "aria-label": "Crear nuevo paciente", children: [_jsx(Plus, { className: "w-4 h-4", "aria-hidden": "true" }), "Crear Paciente"] }) })] }), _jsx("div", { className: "overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl", children: patients.length === 0 ? (_jsx(EmptyState, { icon: "patients", title: "No hay pacientes registrados", description: "Comienza agregando pacientes al sistema para gestionar sus citas m\u00E9dicas.", size: "lg" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", role: "table", "aria-label": "Lista de pacientes", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700/50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "ID" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Usuario" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Nombre Completo" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Rol" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Contacto" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Fecha de Nacimiento" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: patients.map((u) => (_jsxs("tr", { className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50", children: [_jsxs("td", { className: "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap", children: ["#", u.id] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full", children: _jsx(User, { className: "w-4 h-4 text-gray-500 dark:text-gray-300", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: u.email }) })] }) }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap", children: [u.nombre, " ", u.apellido] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getRoleBadge(u.role_id) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap", children: u.numero_telefono || "N/A" }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap", children: u.fecha_nacimiento || "N/A" }), _jsx("td", { className: "px-6 py-4 text-sm font-medium whitespace-nowrap", children: _jsxs("div", { className: "flex space-x-2", role: "group", "aria-label": `Acciones para ${u.nombre} ${u.apellido}`, children: [_jsx(Button, { className: "p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300", variant: "outline", onClick: () => handleEdit(u), "aria-label": `Editar paciente ${u.nombre} ${u.apellido}`, children: _jsx(Edit, { className: "w-4 h-4", "aria-hidden": "true" }) }), _jsx(Button, { className: "p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300", variant: "outline", onClick: () => handleDelete(u.id), "aria-label": `Eliminar paciente ${u.nombre} ${u.apellido}`, children: _jsx(Trash2, { className: "w-4 h-4", "aria-hidden": "true" }) })] }) })] }, u.id))) })] }) })) }), _jsx(ConfirmDialog, {})] }));
});
UsersPatientPage.displayName = 'UsersPatientPage';
export default UsersPatientPage;
