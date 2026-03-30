import type React from "react"
import { NavLink } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

interface NavItemProps {
  to: string
  icon: LucideIcon
  children: React.ReactNode
  isCollapsed?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, children, isCollapsed = false }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-105"
          : "text-gray-700/80 dark:text-gray-300/80 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:shadow-md hover:transform hover:scale-[1.02] hover:translate-x-1"
      }`
    }
    title={isCollapsed ? String(children) : ""}
  >
    <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isCollapsed ? '' : 'group-hover:scale-110'}`} />
    {!isCollapsed && <span className="transition-all duration-300">{children}</span>}
  </NavLink>
)

export default NavItem
