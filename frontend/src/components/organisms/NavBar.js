import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import NavItem from "@components/molecules/NavItem";
import { Users, Calendar, CalendarClock } from "lucide-react";
const NavBar = ({ user }) => (_jsx("nav", { className: "p-4 text-white bg-indigo-800", children: _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx(NavItem, { to: "/appointments", icon: CalendarClock, children: "Citas" }) }), [1, 3].includes(user.role_id) && (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(NavItem, { to: "/users", icon: Users, children: "Usuarios" }) }), _jsx("li", { children: _jsx(NavItem, { to: "/schedules", icon: Calendar, children: "Horarios" }) })] }))] }) }));
export default NavBar;
