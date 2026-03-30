import React from "react";
import NavItem from "@components/molecules/NavItem";
import { Users, Calendar, CalendarClock } from "lucide-react";

interface NavBarProps {
  user: { id: number; email: string; role_id: number };
}

const NavBar: React.FC<NavBarProps> = ({ user }) => (
  <nav className="p-4 text-white bg-indigo-800">
    <ul className="space-y-2">
      <li>
        <NavItem to="/appointments" icon={CalendarClock}>
          Citas
        </NavItem>
      </li>
      {[1, 3].includes(user.role_id) && (
        <>
          <li>
            <NavItem to="/users" icon={Users}>
              Usuarios
            </NavItem>
          </li>
          <li>
            <NavItem to="/schedules" icon={Calendar}>
              Horarios
            </NavItem>
          </li>
        </>
      )}
    </ul>
  </nav>
);

export default NavBar;
