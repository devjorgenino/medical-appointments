import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Clock, Users, Stethoscope, UserCircle, Calendar, User, LayoutDashboard } from "lucide-react";
const Breadcrumb = () => {
    const location = useLocation();
    // Mapeo de rutas a nombres legibles y iconos
    const routeNames = {
        dashboard: { label: "Dashboard", icon: LayoutDashboard },
        appointments: { label: "Citas", icon: Clock },
        users: { label: "Usuarios", icon: Users },
        user: { label: "Crear Usuario", icon: Users },
        doctors: { label: "Doctores", icon: Stethoscope },
        doctor: { label: "Crear Doctor", icon: Stethoscope },
        patients: { label: "Pacientes", icon: UserCircle },
        patient: { label: "Crear Paciente", icon: UserCircle },
        schedules: { label: "Horarios", icon: Calendar },
        profile: { label: "Perfil", icon: User },
    };
    // Generar breadcrumbs desde la ruta actual
    const generateBreadcrumbs = () => {
        const paths = location.pathname.split("/").filter((x) => x);
        const breadcrumbs = [];
        // Si estamos en dashboard, solo mostrar Dashboard
        if (paths.length === 1 && paths[0] === "dashboard") {
            const routeData = routeNames["dashboard"];
            breadcrumbs.push({
                label: routeData.label,
                path: "/dashboard",
                icon: routeData.icon,
            });
            return breadcrumbs;
        }
        // Para otras rutas, siempre empezar con Inicio (Dashboard como home)
        breadcrumbs.push({ label: "Inicio", path: "/", icon: LayoutDashboard });
        // Construir breadcrumbs desde las partes de la ruta
        paths.forEach((path, index) => {
            const routePath = "/" + paths.slice(0, index + 1).join("/");
            const routeData = routeNames[path] || {
                label: path.charAt(0).toUpperCase() + path.slice(1),
                icon: undefined
            };
            breadcrumbs.push({
                label: routeData.label,
                path: routePath,
                icon: routeData.icon,
            });
        });
        return breadcrumbs;
    };
    const breadcrumbs = generateBreadcrumbs();
    // No mostrar breadcrumbs si no hay elementos
    if (breadcrumbs.length === 0) {
        return null;
    }
    return (_jsx("nav", { className: "flex items-center text-sm font-medium", "aria-label": "Breadcrumb", children: breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const IconComponent = breadcrumb.icon;
            return (_jsxs("div", { className: "flex items-center", children: [index > 0 && (_jsx(ChevronRight, { className: "w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" })), isLast ? (_jsxs("span", { className: "flex items-center px-3 py-1.5 text-blue-600 dark:text-blue-400 font-semibold rounded-lg", children: [IconComponent && (_jsx(IconComponent, { className: "w-4 h-4 mr-2" })), breadcrumb.label] })) : (_jsxs(Link, { to: breadcrumb.path, className: "flex items-center px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105", children: [IconComponent && (_jsx(IconComponent, { className: "w-4 h-4 mr-2" })), breadcrumb.label] }))] }, breadcrumb.path));
        }) }));
};
export default Breadcrumb;
