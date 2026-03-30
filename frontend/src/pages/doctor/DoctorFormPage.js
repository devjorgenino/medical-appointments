import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import FormLayout from "@components/templates/FormLayout"; // ← Asegúrate de que sea FormLayout
import ButtonsForm from "@components/molecules/ButtonsForm";
import useDoctors from "@hooks/doctor/useDoctors";
const DoctorFormPage = ({ user }) => {
    const location = useLocation();
    const infoUser = location.state?.infoUser;
    const { newDoctor, editDoctor, setNewDoctor, setEditDoctor, handleCreateOrUpdate, } = useDoctors(Number(user.role_id));
    // Cargar datos cuando venimos de edición
    useEffect(() => {
        if (infoUser) {
            setNewDoctor(infoUser);
            setEditDoctor(infoUser);
        }
    }, [infoUser, setEditDoctor, setNewDoctor]);
    // Solo admin puede crear/editar doctores
    if (user.role_id !== 1) {
        return _jsx(NotAuthorized, {});
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: editDoctor ? "Editar Doctor" : "Crear Nuevo Doctor" }) }) }), _jsx(FormLayout, { user: user, newData: newDoctor, editData: editDoctor, setNewData: setNewDoctor, setEditData: setEditDoctor, handleCreateOrUpdate: handleCreateOrUpdate, redirectPath: "/doctors" // ← Aquí controlamos la redirección
                , children: _jsx(ButtonsForm, { edit: !!editDoctor, path: "/doctors" }) })] }));
};
export default DoctorFormPage;
