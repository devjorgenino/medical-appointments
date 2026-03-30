import { jsx as _jsx } from "react/jsx-runtime";
import { ScheduleManager } from "@components/templates/ScheduleManager";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
const SchedulesPage = ({ user }) => {
    if (![1, 3].includes(Number(user.role_id))) {
        return _jsx(NotAuthorized, {});
    }
    return _jsx(ScheduleManager, { user: user });
};
export default SchedulesPage;
