/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type React from "react";
import { useLocation } from "react-router-dom";

import { NotAuthorized } from "@components/organisms/NotAuthorized";
import useUsers from "@hooks/user/useUsers";
import FormPage from "@components/templates/FormLayout";
import ButtonsForm from "@components/molecules/ButtonsForm";
// If FormPage has its own props type, import it:
interface PageProps {
  user: { id: number; role_id: number; email: string };
}

const UserFormPage: React.FC<PageProps> = ({ user }) => {
  const location = useLocation();
  const infoUser = location.state?.infoUser;

  const { newUser, editUser, setNewUser, setEditUser, handleCreateOrUpdate } =
    useUsers(Number(user.role_id));

  useEffect(() => {
    if (infoUser) {
      setNewUser(infoUser);
      setEditUser(infoUser);
    }
  }, [infoUser, setEditUser, setNewUser]);

  if (![1].includes(Number(user.role_id))) {
    return <NotAuthorized />;
  }

  return (
    <div className="space-y-6">
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editUser ? `Editar Usuario` : `Crear Nuevo Usuario`}
          </h1>
        </div>
      </div>

      <FormPage
        user={user}
        newData={newUser}
        editData={editUser}
        setNewData={(data) => setNewUser(data as any)}
        setEditData={(data) => setEditUser(data as any)}
        handleCreateOrUpdate={handleCreateOrUpdate}
      >
        <ButtonsForm
          edit={!!editUser}
          path={"/users"}
        />
      </FormPage>
    </div>
  );
};

export default UserFormPage;
