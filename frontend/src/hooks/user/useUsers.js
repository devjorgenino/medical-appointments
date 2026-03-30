import { useState, useEffect, useCallback } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@services/user";
import { toast } from "@lib/toast";
import { useConfirmModal } from "@hooks/useConfirmModal";
const useUsers = (userRoleId) => {
    const { confirm, ConfirmDialog } = useConfirmModal();
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        role_id: 3,
        nombre: "",
        apellido: "",
        // No especificamos numero_telefono, direccion ni sexo, ya que son opcionales
    });
    const [editUser, setEditUser] = useState(null);
    const fetchUsers = useCallback(async () => {
        if (Number(userRoleId) !== 1)
            return;
        try {
            const response = await getUsers();
            setUsers(response.data);
        }
        catch (error) {
            if (error &&
                typeof error === "object" &&
                "response" in error &&
                error.response &&
                typeof error.response === "object" &&
                "data" in error.response) {
                const detail = error.response &&
                    error.response.data &&
                    typeof error.response.data === "object" &&
                    "detail" in error.response.data
                    ? error.response.data.detail
                    : undefined;
                toast.error("Error al obtener usuarios");
                console.error("Error al obtener usuarios:", detail || error.message);
            }
            else {
                toast.error("Error al obtener usuarios");
                console.error("Error al obtener usuarios:", error.message);
            }
        }
    }, [userRoleId]);
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editUser) {
                await updateUser(editUser.id, {
                    email: newUser.email,
                    password: newUser.password || undefined,
                    role_id: newUser.role_id,
                    nombre: newUser.nombre,
                    apellido: newUser.apellido,
                    numero_telefono: newUser.numero_telefono,
                    direccion: newUser.direccion,
                    sexo: newUser.sexo,
                });
                toast.success("Usuario actualizado correctamente");
            }
            else {
                await createUser(newUser);
                toast.success("Usuario creado correctamente");
            }
            setNewUser({
                email: "",
                password: "",
                role_id: 3,
                nombre: "",
                apellido: "",
                // Reiniciamos sin especificar numero_telefono, direccion ni sexo
            });
            setEditUser(null);
            fetchUsers();
            return true;
        }
        catch (error) {
            let errorMsg = "Error al guardar";
            const detail = error.response?.data?.detail;
            if (detail) {
                if (Array.isArray(detail)) {
                    // Une todos los mensajes de validación
                    errorMsg = detail.map((e) => e.msg).join(" • ");
                }
                else if (typeof detail === "string") {
                    errorMsg = detail;
                }
            }
            toast.error(errorMsg);
            console.error(error); // para que sigas viendo el error completo en consola
            return false;
        }
    };
    const handleDelete = async (id) => {
        const confirmed = await confirm({
            title: "Eliminar usuario",
            message: "¿Estás seguro de eliminar este usuario?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            variant: "destructive",
        });
        if (!confirmed)
            return;
        try {
            await deleteUser(id);
            toast.success("Usuario eliminado correctamente");
            fetchUsers();
        }
        catch (error) {
            if (error &&
                typeof error === "object" &&
                "response" in error &&
                error.response &&
                typeof error.response === "object" &&
                "data" in error.response &&
                error.response.data &&
                typeof error.response.data === "object" &&
                "detail" in error.response.data) {
                toast.error("Error al eliminar usuario");
                console.error("Error al eliminar usuario:", error.response.data.detail);
            }
            else {
                toast.error("Error al eliminar usuario");
                console.error("Error al eliminar usuario:", error.message);
            }
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [userRoleId, fetchUsers]);
    return {
        users,
        newUser,
        editUser,
        setNewUser,
        setEditUser,
        fetchUsers,
        handleCreateOrUpdate,
        handleDelete,
        ConfirmDialog,
    };
};
export default useUsers;
