import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "../atoms/Button";
import ThemeToggle from "../atoms/ThemeToggle";
import { Menu, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
const Header = ({ userName, userRole, userSex, toggleSidebar, }) => {
    // Función para obtener el prefijo del doctor según el sexo
    const getDoctorPrefix = () => {
        if (userRole === 3) {
            // 3 = Doctor
            return userSex === "F" ? "Dra." : "Dr.";
        }
        return "";
    };
    const displayName = getDoctorPrefix()
        ? `${getDoctorPrefix()} ${userName}`
        : userName;
    return (_jsx("header", { className: "h-[72px] px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center sticky top-0 z-30 transition-colors duration-300", children: _jsxs("div", { className: "flex justify-between items-center w-full", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Button, { className: "p-2 text-gray-500 dark:text-gray-400 md:hidden hover:text-gray-700 dark:hover:text-gray-200", onClick: toggleSidebar, children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-white tracking-tight", children: "Dashboard" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: displayName || "Usuario" })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "hidden items-center px-4 py-2.5 w-72 bg-white/50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm backdrop-blur-sm md:flex transition-all duration-200 focus-within:border-blue-400/60 dark:focus-within:border-blue-500/60 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-md", children: [_jsx(Search, { className: "mr-3 w-4 h-4 text-gray-500 dark:text-gray-400" }), _jsx("input", { type: "text", placeholder: "Buscar...", className: "flex-1 text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-700 dark:text-gray-200 bg-transparent border-none outline-none focus:ring-0" })] }), _jsx(ThemeToggle, {}), _jsx("div", { className: "flex items-center pl-3 space-x-3 border-l border-gray-200/60 dark:border-gray-700/60", children: _jsx("div", { className: "flex justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105", children: _jsx(Link, { to: "/profile", className: "flex items-center justify-center", children: _jsx(User, { className: "w-5 h-5 text-white" }) }) }) })] })] }) }));
};
export default Header;
