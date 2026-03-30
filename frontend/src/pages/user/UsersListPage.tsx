import type React from "react";
import { memo, useCallback } from "react";
import { Plus, Edit, Trash2, User, Shield, UserCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import useUsers from "@hooks/user/useUsers";
import { useNavigate } from "react-router-dom";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import EmptyState from "@components/molecules/EmptyState";

interface UsersPageProps {
  user: { id: number; email: string; role_id: number };
}

const ROLE_OPTIONS = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Paciente" },
  { value: "3", label: "Medico" },
];

const getRoleIcon = (roleId: number) => {
  switch (roleId) {
    case 1:
      return <Shield className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />;
    case 2:
      return <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
    default:
      return <User className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />;
  }
};

const getRoleBadge = (roleId: number) => {
  const role = ROLE_OPTIONS.find((r) => r.value === roleId.toString());
  const colors = {
    1: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    2: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
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

const UsersPage: React.FC<UsersPageProps> = memo(({ user }) => {
  const navigate = useNavigate();

  const { users, setNewUser, setEditUser, handleDelete, ConfirmDialog } =
    useUsers(Number(user.role_id));

  const handleCreate = useCallback(() => {
    navigate("/user");
  }, [navigate]);

  const handleEdit = useCallback((u: typeof users[0]) => {
    setNewUser({
      email: u.email,
      password: "",
      role_id: u.role_id,
      nombre: u.nombre,
      apellido: u.apellido,
      numero_telefono: u.numero_telefono,
      direccion: u.direccion,
      sexo: u.sexo,
    });
    setEditUser(u);
    navigate("/user", {
      state: {
        infoUser: u,
      },
    });
  }, [setNewUser, setEditUser, navigate]);

  if (![1].includes(Number(user.role_id))) {
    return <NotAuthorized />;
  }

  return (
    <div className="space-y-6">
      {/* Header de la pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de Usuarios
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Administra los usuarios y sus roles en el sistema
          </p>
        </div>
        <div>
          <Button
            type="button"
            className="flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={handleCreate}
            aria-label="Crear nuevo usuario"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Crear Usuario</span>
          </Button>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
        {users.length === 0 ? (
          <EmptyState
            icon="users"
            title="No hay usuarios registrados"
            description="Comienza agregando usuarios al sistema para administrar sus permisos y roles."
            size="lg"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Lista de usuarios">
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
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      #{u.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2" role="group" aria-label={`Acciones para ${u.nombre} ${u.apellido}`}>
                        <Button
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          variant="outline"
                          onClick={() => handleEdit(u)}
                          aria-label={`Editar usuario ${u.nombre} ${u.apellido}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          variant="outline"
                          onClick={() => handleDelete(u.id)}
                          aria-label={`Eliminar usuario ${u.nombre} ${u.apellido}`}
                        >
                          <Trash2 className="w-4 h-4" />
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

UsersPage.displayName = 'UsersPage';

export default UsersPage;
