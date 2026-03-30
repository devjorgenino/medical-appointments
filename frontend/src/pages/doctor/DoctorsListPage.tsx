import type React from "react";
import { memo, useCallback } from "react";
import { Plus, Edit, Trash2, User, UserCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import useDoctors from "@hooks/doctor/useDoctors";
import DoctorCard from "@components/molecules/DoctorCard";
import EmptyState from "@components/molecules/EmptyState";

interface UsersDoctorPageProps {
  user: { id: number; email: string; role_id: number };
}

const ROLE_OPTIONS = [{ value: "3", label: "Medico" }];

const getRoleIcon = (roleId: number) => {
  if (roleId === 3) {
    return <User className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />;
  }
};

const getRoleBadge = (roleId: number) => {
  const role = ROLE_OPTIONS.find((r) => r.value === roleId.toString());
  const colors = {
    3: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
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

const UsersDoctorPage: React.FC<UsersDoctorPageProps> = memo(({ user }) => {
  const navigate = useNavigate();

  const { doctors, setNewDoctor, setEditDoctor, handleDelete, ConfirmDialog } =
    useDoctors(Number(user.role_id));

  const handleScheduleAppointment = useCallback((doctorId: number) => {
    navigate("/appointments", {
      state: { selectedDoctorId: doctorId, openModal: true },
    });
  }, [navigate]);

  const handleCreate = useCallback(() => {
    navigate("/doctor");
  }, [navigate]);

  const handleEdit = useCallback((u: typeof doctors[0]) => {
    setNewDoctor({
      email: u.email,
      password: "",
      role_id: u.role_id,
      nombre: u.nombre,
      apellido: u.apellido,
      numero_telefono: u.numero_telefono || "",
      direccion: u.direccion || "",
      sexo: u.sexo || "",
      especialidad: u.especialidad || "",
    });
    setEditDoctor(u);
    navigate("/doctor", {
      state: {
        infoUser: u,
      },
    });
  }, [setNewDoctor, setEditDoctor, navigate]);

  if (![1, 2, 3].includes(Number(user.role_id))) {
    return <NotAuthorized />;
  }

  // Vista de tarjetas para pacientes (role_id === 2)
  if (user.role_id === 2) {
    return (
      <div className="space-y-6">
        {/* Header de la pagina */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nuestros Doctores
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Encuentra al doctor ideal para ti y agenda tu cita
            </p>
          </div>
        </div>

        {/* Grid de tarjetas de doctores */}
        {doctors.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center" role="status">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full">
              <UserCheck className="w-8 h-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay doctores disponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Por el momento no hay doctores registrados en el sistema.
            </p>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Lista de doctores disponibles"
          >
            {doctors.map((doctor) => (
              <div key={doctor.id} role="listitem">
                <DoctorCard
                  doctor={doctor}
                  onScheduleAppointment={handleScheduleAppointment}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vista de tabla para admins y doctores
  return (
    <div className="space-y-6">
      {/* Header de la pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de Doctores
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Administra los doctores en el sistema
          </p>
        </div>
        {(user.role_id === 1 || user.role_id === 3) && (
          <div>
            <Button
              type="button"
              className="flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2"
              onClick={handleCreate}
              aria-label="Crear nuevo doctor"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Crear Doctor</span>
            </Button>
          </div>
        )}
      </div>

      {/* Lista de doctores */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
        {doctors.length === 0 ? (
          <EmptyState
            icon="doctors"
            title="No hay doctores registrados"
            description="Comienza agregando doctores al sistema para gestionar sus especialidades y horarios."
            size="lg"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Lista de doctores">
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
                    Especialidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {doctors.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      #{u.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
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
                      {(() => {
                        if (typeof u.especialidad === "string") {
                          return u.especialidad;
                        } else if (u.especialidad) {
                          return JSON.stringify(u.especialidad);
                        }
                        return "---";
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2" role="group" aria-label={`Acciones para Dr. ${u.nombre} ${u.apellido}`}>
                        <Button
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          variant="outline"
                          onClick={() => handleEdit(u)}
                          aria-label={`Editar doctor ${u.nombre} ${u.apellido}`}
                        >
                          <Edit className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <Button
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          variant="outline"
                          onClick={() => handleDelete(u.id)}
                          aria-label={`Eliminar doctor ${u.nombre} ${u.apellido}`}
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

UsersDoctorPage.displayName = 'UsersDoctorPage';

export default UsersDoctorPage;
