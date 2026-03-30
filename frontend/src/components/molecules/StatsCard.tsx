import type React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600 dark:text-blue-400",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
    },
    green: {
      bg: "from-green-500 to-green-600",
      text: "text-green-600 dark:text-green-400",
      lightBg: "bg-green-50 dark:bg-green-900/20",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      text: "text-purple-600 dark:text-purple-400",
      lightBg: "bg-purple-50 dark:bg-purple-900/20",
    },
    orange: {
      bg: "from-orange-500 to-orange-600",
      text: "text-orange-600 dark:text-orange-400",
      lightBg: "bg-orange-50 dark:bg-orange-900/20",
    },
    red: {
      bg: "from-red-500 to-red-600",
      text: "text-red-600 dark:text-red-400",
      lightBg: "bg-red-50 dark:bg-red-900/20",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-semibold ${
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
            </div>
          )}
        </div>
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${colors.bg} shadow-lg`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
