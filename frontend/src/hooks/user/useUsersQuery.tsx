import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@lib/toast";
import { getUsers, createUser, updateUser, deleteUser } from "@services/user";
import type { User, UseUsersReturn } from "@src/types/user";
import { useConfirmModal } from "@hooks/useConfirmModal";
import { useState, useCallback } from 'react';

// Query keys for cache management
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

type NewUser = {
  email: string;
  password: string;
  role_id: number;
  nombre: string;
  apellido: string;
  numero_telefono?: string;
  direccion?: string;
  sexo?: string;
};

/**
 * React Query hook for users management
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetching
 * - Automatic cache invalidation on mutations
 */
const useUsersQuery = (userRoleId: number) => {
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirmModal();

  // Form state
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    password: "",
    role_id: 3,
    nombre: "",
    apellido: "",
  });
  const [editUser, setEditUser] = useState<User | null>(null);

  // Query: Fetch users with caching
  const {
    data: users = [],
    isLoading: loading,
    error,
    refetch: fetchUsers,
  } = useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await getUsers();
      return response.data || [];
    },
    // Only fetch if user is admin
    enabled: Number(userRoleId) === 1,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation: Create user
  const createMutation = useMutation({
    mutationFn: (data: NewUser) => createUser(data),
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail;
      let errorMsg = "Error al crear usuario";
      if (detail) {
        if (Array.isArray(detail)) {
          errorMsg = detail.map((e: any) => e.msg).join(" • ");
        } else if (typeof detail === "string") {
          errorMsg = detail;
        }
      }
      toast.error(errorMsg);
    },
  });

  // Mutation: Update user
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NewUser }) => 
      updateUser(id, data),
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail;
      let errorMsg = "Error al actualizar usuario";
      if (detail) {
        if (Array.isArray(detail)) {
          errorMsg = detail.map((e: any) => e.msg).join(" • ");
        } else if (typeof detail === "string") {
          errorMsg = detail;
        }
      }
      toast.error(errorMsg);
    },
  });

  // Mutation: Delete user
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: () => {
      toast.error("Error al eliminar usuario");
    },
  });

  // Handlers
  const handleCreateOrUpdate = useCallback(async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    try {
      if (editUser) {
        await updateMutation.mutateAsync({
          id: editUser.id,
          data: {
            email: newUser.email,
            password: newUser.password || "",
            role_id: newUser.role_id,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            numero_telefono: newUser.numero_telefono,
            direccion: newUser.direccion,
            sexo: newUser.sexo,
          },
        });
      } else {
        await createMutation.mutateAsync(newUser);
      }

      // Reset form
      setNewUser({
        email: "",
        password: "",
        role_id: 3,
        nombre: "",
        apellido: "",
      });
      setEditUser(null);

      return true;
    } catch {
      return false;
    }
  }, [editUser, newUser, createMutation, updateMutation]);

  const handleDelete = useCallback(async (id: number) => {
    const confirmed = await confirm({
      title: "Eliminar usuario",
      message: "¿Estas seguro de eliminar este usuario?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (!confirmed) return;

    deleteMutation.mutate(id);
  }, [confirm, deleteMutation]);

  return {
    // Data
    users,
    loading,
    error,
    
    // Form state
    newUser,
    editUser,
    setNewUser,
    setEditUser,
    
    // Actions
    handleCreateOrUpdate,
    handleDelete,
    fetchUsers,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Modal
    ConfirmDialog,
  };
};

export default useUsersQuery;
