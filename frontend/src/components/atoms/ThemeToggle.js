import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@hooks/useTheme";
const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();
    return (_jsx("button", { onClick: toggleTheme, className: `
        relative inline-flex items-center justify-center
        w-10 h-10
        rounded-xl
        bg-gray-100 dark:bg-gray-800
        border border-gray-200/60 dark:border-gray-700/60
        text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        hover:text-gray-900 dark:hover:text-white
        transition-all duration-300 ease-in-out
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        group
        ${className}
      `, "aria-label": theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro", title: theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro", children: _jsxs("div", { className: "relative w-5 h-5", children: [_jsx(Sun, { className: `
            absolute inset-0 w-5 h-5
            transition-all duration-300 ease-in-out
            ${theme === "light"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-50"}
          ` }), _jsx(Moon, { className: `
            absolute inset-0 w-5 h-5
            transition-all duration-300 ease-in-out
            ${theme === "dark"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-50"}
          ` })] }) }));
};
export default ThemeToggle;
