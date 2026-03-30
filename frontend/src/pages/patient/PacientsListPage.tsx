import type React from "react";
import { memo, useCallback } from "react";
import { Plus, Edit, Trash2, User, UserCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import usePatients from "@hooks/patient/usePatients";
import EmptyState from "@components/molecules/EmptyState";

interface UsersPatientsPageProps {
  user: { id: number; email: string; role_id: number };
}

const ROLE_OPTIONS = [{ value: "2", label: "Paciente" }];

const getRoleIcon = (roleId: number) => {
  if (roleId === 2) {
    return <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
  }
};

const getRoleBadge = (roleId: number) => {
  const role = ROLE_OPTIONS.find((r) => r.value === roleId.toString());
  const colors = {
    1: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    2: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    3: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
        colors[roleId as keyof typeof colors]
      }`}
    >
      {getRoleIcon(roleId)}
      <span className="ml-1">{role?.label}</span>
    </span>
  );
};

const UsersPatientPage: React.FC<UsersPatientsPageProps> = memo(({ user }) => {
  const navigate = useNavigate();

  const {
    patients,
    setNewPatient,
    setEditPatient,
    handleDelete,
    ConfirmDialog,
  } = usePatients(Number(user.role_id));

  const handleEdit = useCallback((u: typeof patients[0]) => {
    setNewPatient({
      email: u.email,
      password: "",
      role_id: u.role_id,
      nombre: u.nombre,
      apellido: u.apellido,
      numero_telefono: u.numero_telefono || "",
      direccion: u.direccion || "",
      sexo: u.sexo || "",
      fecha_nacimiento: u.fecha_nacimiento || "",
    });
    setEditPatient(u);
    navigate("/patient", {
      state: {
        infoUser: u,
      },
    });
  }, [setNewPatient, setEditPatient, navigate]);

  const handleCreate = useCallback(() => {
    navigate("/patient");
  }, [navigate]);

  if (![1, 2, 3].includes(Number(user.role_id))) {
    return <NotAuthorized />;
  }

  return (
    <div className="space-y-6">
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de Pacientes
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Administra los pacientes en el sistema
          </p>
        </div>
        <div>
          <Button
            type="button"
            className="flex items-center justify-center space-x-2 text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={handleCreate}
            aria-label="Crear nuevo paciente"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Crear Paciente
          </Button>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
        {patients.length === 0 ? (
          <EmptyState
            icon="patients"
            title="No hay pacientes registrados"
            description="Comienza agregando pacientes al sistema para gestionar sus citas médicas."
            size="lg"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Lista de pacientes">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Nombre Completo
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Contacto
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Fecha de Nacimiento
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {patients.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      #{u.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-300" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(u.role_id)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {u.numero_telefono || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {u.fecha_nacimiento || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2" role="group" aria-label={`Acciones para ${u.nombre} ${u.apellido}`}>
                        <Button
                          className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          variant="outline"
                          onClick={() => handleEdit(u)}
                          aria-label={`Editar paciente ${u.nombre} ${u.apellido}`}
                        >
                          <Edit className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <Button
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          variant="outline"
                          onClick={() => handleDelete(u.id)}
                          aria-label={`Eliminar paciente ${u.nombre} ${u.apellido}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog />
    </div>
  );
});

UsersPatientPage.displayName = 'UsersPatientPage';

export default UsersPatientPage;
