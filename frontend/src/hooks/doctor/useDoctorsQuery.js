import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@lib/toast";
import { createDoctor, updateDoctor, getDoctors, deleteDoctor } from "@services/doctor";
import { useConfirmModal } from "@hooks/useConfirmModal";
import { useState, useCallback } from 'react';
// Query keys for cache management
export const doctorKeys = {
    all: ['doctors'],
    lists: () => [...doctorKeys.all, 'list'],
    list: (filters) => [...doctorKeys.lists(), filters],
    details: () => [...doctorKeys.all, 'detail'],
    detail: (id) => [...doctorKeys.details(), id],
};
/**
 * React Query hook for doctors management
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetching
 * - Automatic cache invalidation on mutations
 */
const useDoctorsQuery = (userRoleId) => {
    const queryClient = useQueryClient();
    const { confirm, ConfirmDialog } = useConfirmModal();
    // Form state
    const [newDoctor, setNewDoctor] = useState({
        email: "",
        password: "",
        role_id: 3,
        nombre: "",
        apellido: "",
        numero_telefono: "",
        direccion: "",
        sexo: "",
        especialidad: "",
    });
    const [editDoctor, setEditDoctor] = useState(null);
    // Query: Fetch doctors with caching
    const { data: doctors = [], isLoading: loading, error, refetch: fetchDoctors, } = useQuery({
        queryKey: doctorKeys.lists(),
        queryFn: async () => {
            const response = await getDoctors();
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });
    // Mutation: Create doctor
    const createMutation = useMutation({
        mutationFn: (data) => createDoctor(data),
        onSuccess: () => {
            toast.success("Medico creado correctamente");
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
        },
        onError: (error) => {
            const detail = error.response?.data?.detail;
            let errorMsg = "Error al crear medico";
            if (detail) {
                if (Array.isArray(detail)) {
                    errorMsg = detail.map((e) => e.msg).join(" • ");
                }
                else if (typeof detail === "string") {
                    errorMsg = detail;
                }
            }
            toast.error(errorMsg);
        },
    });
    // Mutation: Update doctor
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateDoctor(id, data),
        onSuccess: () => {
            toast.success("Medico actualizado correctamente");
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
        },
        onError: (error) => {
            const detail = error.response?.data?.detail;
            let errorMsg = "Error al actualizar medico";
            if (detail) {
                if (Array.isArray(detail)) {
                    errorMsg = detail.map((e) => e.msg).join(" • ");
                }
                else if (typeof detail === "string") {
                    errorMsg = detail;
                }
            }
            toast.error(errorMsg);
        },
    });
    // Mutation: Delete doctor
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteDoctor(id),
        onSuccess: () => {
            toast.success("Medico eliminado correctamente");
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
        },
        onError: () => {
            toast.error("Error al eliminar medico");
        },
    });
    // Handlers
    const handleCreateOrUpdate = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (editDoctor) {
                const { password, ...updateData } = newDoctor;
                const dataToSend = password?.trim()
                    ? { ...updateData, password }
                    : { ...updateData, password: "" };
                await updateMutation.mutateAsync({ id: editDoctor.id, data: dataToSend });
            }
            else {
                await createMutation.mutateAsync(newDoctor);
            }
            // Reset form
            setNewDoctor({
                email: "",
                password: "",
                role_id: 3,
                nombre: "",
                apellido: "",
                numero_telefono: "",
                direccion: "",
                sexo: "",
                especialidad: "",
            });
            setEditDoctor(null);
            return true;
        }
        catch {
            return false;
        }
    }, [editDoctor, newDoctor, createMutation, updateMutation]);
    const handleDelete = useCallback(async (id) => {
        const confirmed = await confirm({
            title: "Eliminar medico",
            message: "¿Estas seguro de eliminar este medico?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            variant: "destructive",
        });
        if (!confirmed)
            return;
        deleteMutation.mutate(id);
    }, [confirm, deleteMutation]);
    return {
        // Data
        doctors,
        loading,
        error,
        // Form state
        newDoctor,
        editDoctor,
        setNewDoctor,
        setEditDoctor,
        // Actions
        handleCreateOrUpdate,
        handleDelete,
        fetchDoctors,
        // Mutation states
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        // Modal
        ConfirmDialog,
    };
};
export default useDoctorsQuery;
