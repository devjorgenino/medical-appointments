import React from "react";
import { LucideIcon, Users, Calendar, Stethoscope, User, CalendarX } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: "users" | "appointments" | "doctors" | "patients" | "custom" | "error";
  customIcon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  size?: "sm" | "md" | "lg";
}

const iconMap = {
  users: Users,
  appointments: Calendar,
  doctors: Stethoscope,
  patients: User,
  custom: User,
  error: CalendarX,
};

const sizeClasses = {
  sm: {
    container: "py-8 px-4",
    icon: "w-12 h-12",
    iconContainer: "w-16 h-16",
    title: "text-base",
    description: "text-sm",
    action: "px-4 py-2 text-sm",
  },
  md: {
    container: "py-12 px-4",
    icon: "w-10 h-10",
    iconContainer: "w-20 h-20",
    title: "text-lg",
    description: "text-base",
    action: "px-5 py-2.5 text-base",
  },
  lg: {
    container: "py-16 px-4",
    icon: "w-12 h-12",
    iconContainer: "w-24 h-24",
    title: "text-xl",
    description: "text-lg",
    action: "px-6 py-3 text-lg",
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "custom",
  customIcon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  size = "md",
}) => {
  const IconComponent = customIcon || iconMap[icon];
  const sizes = sizeClasses[size];

  return (
    <div
      className={`flex flex-col items-center justify-center ${sizes.container}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center justify-center ${sizes.iconContainer} rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-4`}
      >
        <IconComponent className={`${sizes.icon} text-gray-400 dark:text-gray-500`} aria-hidden="true" />
      </div>
      <h3 className={`${sizes.title} font-bold text-gray-900 dark:text-white mb-2`}>{title}</h3>
      <p className={`${sizes.description} text-gray-600 dark:text-gray-400 text-center max-w-md mb-6`}>{description}</p>
      
      {(actionLabel && (actionLink || onAction)) && (
        <>
          {actionLink ? (
            <Link
              to={actionLink}
              className={`${sizes.action} bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className={`${sizes.action} bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
      <span className="sr-only">No hay elementos para mostrar</span>
    </div>
  );
};

export default EmptyState;
