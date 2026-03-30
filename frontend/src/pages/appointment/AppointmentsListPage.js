import { jsx as _jsx } from "react/jsx-runtime";
import { AppointmentsView } from '@components/organisms/AppointmentsView';
const AppointmentsPage = ({ user }) => {
    return _jsx(AppointmentsView, { user: user });
};
export default AppointmentsPage;
