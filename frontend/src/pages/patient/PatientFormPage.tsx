/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type React from "react";
import { useLocation } from "react-router-dom";

import { NotAuthorized } from "@components/organisms/NotAuthorized";
import FormLayout from "@components/templates/FormLayout";
import ButtonsForm from "@components/molecules/ButtonsForm";
import usePatients from "@hooks/patient/usePatients";

interface PageProps {
  user: { id: number; role_id: number; email: string };
}

const PatientFormPage: React.FC<PageProps> = ({ user }) => {
  const location = useLocation();
  const infoUser = location.state?.infoUser;

  const {
    newPatient,
    editPatient,
    setNewPatient,
    setEditPatient,
    handleCreateOrUpdate,
  } = usePatients(Number(user.role_id));

  useEffect(() => {
    if (infoUser) {
      setNewPatient(infoUser);
      setEditPatient(infoUser);
    }
  }, [infoUser, setNewPatient, setEditPatient]);

  // Solo admin y médico pueden crear/editar pacientes
  if (![1, 3].includes(Number(user.role_id))) {
    return <NotAuthorized />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editPatient ? "Editar Paciente" : "Crear Nuevo Paciente"}
          </h1>
        </div>
      </div>

      <FormLayout
        user={user}
        newData={newPatient}
        editData={editPatient} // ← null en creación
        setNewData={setNewPatient as any}
        setEditData={setEditPatient as any}
        handleCreateOrUpdate={handleCreateOrUpdate}
        redirectPath="/patients" // ← navegación solo en éxito
      >
        <ButtonsForm edit={!!editPatient} path="/patients" />
      </FormLayout>
    </div>
  );
};

export default PatientFormPage;
