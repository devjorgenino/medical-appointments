import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@components/organisms/Sidebar";
import Header from "@components/organisms/Header";
import Breadcrumb from "@components/molecules/Breadcrumb";

interface DashboardLayoutProps {
  user: { 
    id: number; 
    email: string; 
    role_id: number;
    nombre: string;
    apellido: string;
    sexo?: string;
  };
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onLogout,
}) => {
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar-container");
      if (isSidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Saltar al contenido principal
      </a>

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative ${
          isCollapsed ? "md:w-20" : "md:w-72"
        } w-72 h-full transition-all duration-300 ease-in-out z-50`}
        aria-label="Menu de navegacion principal"
      >
        <Sidebar
          toggleSidebar={toggleSidebar}
          userRole={user.role_id}
          onLogout={onLogout}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </aside>

      {/* Overlay para moviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          userName={`${user.nombre} ${user.apellido}`}
          userRole={user.role_id}
          userSex={user.sexo}
          toggleSidebar={toggleSidebar}
        />
        <main 
          id="main-content" 
          className="flex-1 overflow-auto"
          role="main"
          aria-label="Contenido principal"
          tabIndex={-1}
        >
          <div className="mx-auto p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Migas de pan">
              <Breadcrumb />
            </nav>
            {/* Contenido de la pagina */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/10 border border-gray-200/60 dark:border-gray-700/50 p-6 lg:p-8 transition-colors duration-300">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
