/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type React from "react";
import { useLocation } from "react-router-dom";

import { NotAuthorized } from "@components/organisms/NotAuthorized";
import FormLayout from "@components/templates/FormLayout";   // ← Asegúrate de que sea FormLayout
import ButtonsForm from "@components/molecules/ButtonsForm";
import useDoctors from "@hooks/doctor/useDoctors";

interface PageProps {
  user: { id: number; role_id: number; email: string };
}

const DoctorFormPage: React.FC<PageProps> = ({ user }) => {
  const location = useLocation();
  const infoUser = location.state?.infoUser;

  const {
    newDoctor,
    editDoctor,
    setNewDoctor,
    setEditDoctor,
    handleCreateOrUpdate,
  } = useDoctors(Number(user.role_id));

  // Cargar datos cuando venimos de edición
  useEffect(() => {
    if (infoUser) {
      setNewDoctor(infoUser);
      setEditDoctor(infoUser);
    }
  }, [infoUser, setEditDoctor, setNewDoctor]);

  // Solo admin puede crear/editar doctores
  if (user.role_id !== 1) {
    return <NotAuthorized />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editDoctor ? "Editar Doctor" : "Crear Nuevo Doctor"}
          </h1>
        </div>
      </div>

      {/* Formulario reutilizable */}
      <FormLayout
        user={user}
        newData={newDoctor}
        editData={editDoctor}                     // ← null en creación → isCreation = true
        setNewData={setNewDoctor as any}
        setEditData={setEditDoctor as any}
        handleCreateOrUpdate={handleCreateOrUpdate} // ← debe devolver Promise<boolean>
        redirectPath="/doctors"                    // ← Aquí controlamos la redirección
      >
        {/* Botones Cancelar / Guardar */}
        <ButtonsForm
          edit={!!editDoctor}
          path="/doctors"
        />
      </FormLayout>
    </div>
  );
};

export default DoctorFormPage;