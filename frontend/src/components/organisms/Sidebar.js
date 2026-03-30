import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import NavItem from "../molecules/NavItem";
import { Clock, Users, Calendar, Menu, LogOut, Activity, Stethoscope, UserCircle, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from "react";
const Sidebar = ({ toggleSidebar, userRole, onLogout, isCollapsed, toggleCollapse }) => {
    const isAdmin = userRole === 1;
    const isPaciente = userRole === 2;
    const isDoctor = userRole === 3;
    const [isUser, setIsUser] = useState("");
    useEffect(() => {
        if (isAdmin)
            setIsUser("Administrador");
        else if (isDoctor)
            setIsUser("Doctor");
        else if (isPaciente)
            setIsUser("Paciente");
        else
            setIsUser("Usuario No Disponible");
    }, [userRole, isAdmin, isDoctor, isPaciente]);
    return (_jsxs("div", { className: "flex flex-col h-full bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/60 dark:border-gray-700/60 shadow-lg dark:shadow-2xl dark:shadow-black/20 relative transition-colors duration-300", children: [_jsx("div", { className: "h-[72px] p-6 border-b border-gray-200/40 dark:border-gray-700/40 flex items-center", children: _jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg", children: _jsx(Activity, { className: "w-5 h-5 text-white" }) }), !isCollapsed && (_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-white tracking-tight", children: "MedicalApp" }), _jsx("p", { className: "text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider", children: isUser })] }))] }), _jsx("button", { type: "button", className: "p-1 text-gray-400 dark:text-gray-500 md:hidden hover:text-gray-600 dark:hover:text-gray-300 transition-colors", onClick: toggleSidebar, children: _jsx(Menu, { className: "w-5 h-5" }) })] }) }), _jsx("button", { onClick: toggleCollapse, className: "hidden md:flex absolute -right-3.5 top-20 z-10 items-center justify-center w-7 h-7 bg-white dark:bg-gray-800 border-2 border-gray-300/60 dark:border-gray-600/60 rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-blue-500/60 hover:border-transparent active:scale-95 transition-all duration-300 group ring-2 ring-white/80 dark:ring-gray-900/80", "aria-label": isCollapsed ? "Expandir sidebar" : "Colapsar sidebar", title: isCollapsed ? "Expandir sidebar" : "Colapsar sidebar", children: isCollapsed ? (_jsx(ChevronRight, { className: "w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-all group-hover:translate-x-0.5" })) : (_jsx(ChevronLeft, { className: "w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-all group-hover:-translate-x-0.5" })) }), _jsx("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: _jsxs("div", { className: "mb-6", children: [!isCollapsed && (_jsx("p", { className: "mb-3 text-xs font-medium tracking-wider text-gray-400 dark:text-gray-500 uppercase px-3", children: "Principal" })), _jsx("ul", { className: "space-y-1", children: [{
                                    to: "dashboard",
                                    icon: LayoutDashboard,
                                    label: "Dashboard",
                                    roles: [1, 2, 3],
                                },
                                {
                                    to: "appointments",
                                    icon: Clock,
                                    label: "Citas",
                                    roles: [1, 2, 3],
                                },
                                {
                                    to: "users",
                                    icon: Users,
                                    label: "Usuarios",
                                    roles: [1],
                                },
                                {
                                    to: "doctors",
                                    icon: Stethoscope,
                                    label: "Doctores",
                                    roles: [1, 2],
                                },
                                {
                                    to: "patients",
                                    icon: UserCircle,
                                    label: "Pacientes",
                                    roles: [1, 3],
                                },
                                {
                                    to: "schedules",
                                    icon: Calendar,
                                    label: "Horarios",
                                    roles: [1, 3],
                                },
                            ]
                                .filter((item, idx, arr) => item.roles.includes(userRole) &&
                                arr.findIndex((i) => i.label === item.label && i.to === item.to) === idx)
                                .map((item) => (_jsx("li", { children: _jsx(NavItem, { to: item.to, icon: item.icon, isCollapsed: isCollapsed, children: item.label }) }, item.to))) })] }) }), _jsx("div", { className: "p-4 border-t border-gray-100 dark:border-gray-700/50", children: _jsxs("button", { type: "button", className: `flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'} w-full px-4 py-3 text-gray-600 dark:text-gray-400 transition-all duration-200 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group`, onClick: onLogout, title: isCollapsed ? "Cerrar sesion" : undefined, children: [_jsx(LogOut, { className: "w-4 h-4 group-hover:text-red-600 dark:group-hover:text-red-400" }), !isCollapsed && _jsx("span", { className: "ml-3 text-sm font-medium", children: "Cerrar sesion" })] }) })] }));
};
export default Sidebar;
