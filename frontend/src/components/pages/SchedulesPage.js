import { jsx as _jsx } from "react/jsx-runtime";
import { ScheduleManager } from "@components/templates/ScheduleManager";
const SchedulesPage = ({ user }) => {
    console.log("Renderizando SchedulesPage con user:", user);
    if (user.role_id !== 1 && user.role_id !== 3) {
        return (_jsx("div", { className: "p-4", children: "Acceso denegado. Se requiere rol de administrador o m\u00E9dico." }));
    }
    return _jsx(ScheduleManager, { user: user });
};
export default SchedulesPage;
