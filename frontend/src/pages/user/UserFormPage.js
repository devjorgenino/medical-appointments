import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import useUsers from "@hooks/user/useUsers";
import FormPage from "@components/templates/FormLayout";
import ButtonsForm from "@components/molecules/ButtonsForm";
const UserFormPage = ({ user }) => {
    const location = useLocation();
    const infoUser = location.state?.infoUser;
    const { newUser, editUser, setNewUser, setEditUser, handleCreateOrUpdate } = useUsers(Number(user.role_id));
    useEffect(() => {
        if (infoUser) {
            setNewUser(infoUser);
            setEditUser(infoUser);
        }
    }, [infoUser, setEditUser, setNewUser]);
    if (![1].includes(Number(user.role_id))) {
        return _jsx(NotAuthorized, {});
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: editUser ? `Editar Usuario` : `Crear Nuevo Usuario` }) }) }), _jsx(FormPage, { user: user, newData: newUser, editData: editUser, setNewData: (data) => setNewUser(data), setEditData: (data) => setEditUser(data), handleCreateOrUpdate: handleCreateOrUpdate, children: _jsx(ButtonsForm, { edit: !!editUser, path: "/users" }) })] }));
};
export default UserFormPage;
