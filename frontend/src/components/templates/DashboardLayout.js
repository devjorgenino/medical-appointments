import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@components/organisms/Sidebar";
import Header from "@components/organisms/Header";
import Breadcrumb from "@components/molecules/Breadcrumb";
const DashboardLayout = ({ user, onLogout, }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);
    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);
    // Close sidebar on Escape key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isSidebarOpen]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector(".sidebar-container");
            if (isSidebarOpen && sidebar && !sidebar.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen]);
    return (_jsxs("div", { className: "flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300", children: [_jsx("a", { href: "#main-content", className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", children: "Saltar al contenido principal" }), _jsx("aside", { className: `sidebar-container ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative ${isCollapsed ? "md:w-20" : "md:w-72"} w-72 h-full transition-all duration-300 ease-in-out z-50`, "aria-label": "Menu de navegacion principal", children: _jsx(Sidebar, { toggleSidebar: toggleSidebar, userRole: user.role_id, onLogout: onLogout, isCollapsed: isCollapsed, toggleCollapse: toggleCollapse }) }), isSidebarOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/20 dark:bg-black/40 md:hidden backdrop-blur-sm", onClick: toggleSidebar, "aria-hidden": "true", role: "presentation" })), _jsxs("div", { className: "flex flex-col flex-1 min-w-0", children: [_jsx(Header, { userName: `${user.nombre} ${user.apellido}`, userRole: user.role_id, userSex: user.sexo, toggleSidebar: toggleSidebar }), _jsx("main", { id: "main-content", className: "flex-1 overflow-auto", role: "main", "aria-label": "Contenido principal", tabIndex: -1, children: _jsxs("div", { className: "mx-auto p-6 lg:p-8", children: [_jsx("nav", { className: "mb-8", "aria-label": "Migas de pan", children: _jsx(Breadcrumb, {}) }), _jsx("div", { className: "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/10 border border-gray-200/60 dark:border-gray-700/50 p-6 lg:p-8 transition-colors duration-300", children: _jsx(Outlet, {}) })] }) })] })] }));
};
export default DashboardLayout;
