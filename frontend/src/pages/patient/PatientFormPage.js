import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import FormLayout from "@components/templates/FormLayout";
import ButtonsForm from "@components/molecules/ButtonsForm";
import usePatients from "@hooks/patient/usePatients";
const PatientFormPage = ({ user }) => {
    const location = useLocation();
    const infoUser = location.state?.infoUser;
    const { newPatient, editPatient, setNewPatient, setEditPatient, handleCreateOrUpdate, } = usePatients(Number(user.role_id));
    useEffect(() => {
        if (infoUser) {
            setNewPatient(infoUser);
            setEditPatient(infoUser);
        }
    }, [infoUser, setNewPatient, setEditPatient]);
    // Solo admin y médico pueden crear/editar pacientes
    if (![1, 3].includes(Number(user.role_id))) {
        return _jsx(NotAuthorized, {});
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: editPatient ? "Editar Paciente" : "Crear Nuevo Paciente" }) }) }), _jsx(FormLayout, { user: user, newData: newPatient, editData: editPatient, setNewData: setNewPatient, setEditData: setEditPatient, handleCreateOrUpdate: handleCreateOrUpdate, redirectPath: "/patients" // ← navegación solo en éxito
                , children: _jsx(ButtonsForm, { edit: !!editPatient, path: "/patients" }) })] }));
};
export default PatientFormPage;
