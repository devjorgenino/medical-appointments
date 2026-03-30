import type React from "react"
import NavItem from "../molecules/NavItem"
import { Clock, Users, Calendar, Menu, LogOut, Activity, Stethoscope, UserCircle, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react'
import { useEffect, useState } from "react"

interface SidebarProps {
  toggleSidebar: () => void
  userRole: number
  onLogout: () => void
  isCollapsed: boolean
  toggleCollapse: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar, userRole, onLogout, isCollapsed, toggleCollapse }) => {
  const isAdmin = userRole === 1
  const isPaciente = userRole === 2
  const isDoctor = userRole === 3

  const [isUser, setIsUser] = useState("")

  useEffect(() => {
    if (isAdmin) setIsUser("Administrador")
    else if (isDoctor) setIsUser("Doctor")
    else if (isPaciente) setIsUser("Paciente")
    else setIsUser("Usuario No Disponible")
  }, [userRole, isAdmin, isDoctor, isPaciente])

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/60 dark:border-gray-700/60 shadow-lg dark:shadow-2xl dark:shadow-black/20 relative transition-colors duration-300">
      {/* Header del sidebar */}
      <div className="h-[72px] p-6 border-b border-gray-200/40 dark:border-gray-700/40 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">MedicalApp</h1>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">{isUser}</p>
              </div>
            )}
          </div>
          {/* Boton para cerrar sidebar en mobile */}
          <button type="button" className="p-1 text-gray-400 dark:text-gray-500 md:hidden hover:text-gray-600 dark:hover:text-gray-300 transition-colors" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Boton para colapsar sidebar en desktop */}
      <button
        onClick={toggleCollapse}
        className="hidden md:flex absolute -right-3.5 top-20 z-10 items-center justify-center w-7 h-7 bg-white dark:bg-gray-800 border-2 border-gray-300/60 dark:border-gray-600/60 rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-blue-500/60 hover:border-transparent active:scale-95 transition-all duration-300 group ring-2 ring-white/80 dark:ring-gray-900/80"
        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-all group-hover:translate-x-0.5" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-all group-hover:-translate-x-0.5" />
        )}
      </button>

      {/* Navegacion */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          {!isCollapsed && (
            <p className="mb-3 text-xs font-medium tracking-wider text-gray-400 dark:text-gray-500 uppercase px-3">Principal</p>
          )}
          <ul className="space-y-1">
            {[{
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
              .filter(
                (item, idx, arr) =>
                  item.roles.includes(userRole) &&
                  arr.findIndex((i) => i.label === item.label && i.to === item.to) === idx,
              )
              .map((item) => (
                <li key={item.to}>
                  <NavItem to={item.to} icon={item.icon} isCollapsed={isCollapsed}>
                    {item.label}
                  </NavItem>
                </li>
              ))}
          </ul>
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
        <button
          type="button"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'} w-full px-4 py-3 text-gray-600 dark:text-gray-400 transition-all duration-200 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group`}
          onClick={onLogout}
          title={isCollapsed ? "Cerrar sesion" : undefined}
        >
          <LogOut className="w-4 h-4 group-hover:text-red-600 dark:group-hover:text-red-400" />
          {!isCollapsed && <span className="ml-3 text-sm font-medium">Cerrar sesion</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
