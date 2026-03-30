import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Clock, Users, Stethoscope, UserCircle, Calendar, User, LayoutDashboard } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  // Mapeo de rutas a nombres legibles y iconos
  const routeNames: Record<string, { label: string; icon: React.ComponentType<any> }> = {
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
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split("/").filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [];

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

  return (
    <nav className="flex items-center text-sm font-medium" aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const IconComponent = breadcrumb.icon;

        return (
          <div key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
            )}
            {isLast ? (
              <span className="flex items-center px-3 py-1.5 text-blue-600 dark:text-blue-400 font-semibold rounded-lg">
                {IconComponent && (
                  <IconComponent className="w-4 h-4 mr-2" />
                )}
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="flex items-center px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105"
              >
                {IconComponent && (
                  <IconComponent className="w-4 h-4 mr-2" />
                )}
                {breadcrumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
