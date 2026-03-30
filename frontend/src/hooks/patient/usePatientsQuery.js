import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@lib/toast";
import { getPatients, createPatient, updatePatient, deletePatient, } from "@services/patient";
import { useConfirmModal } from "@hooks/useConfirmModal";
import { useState, useCallback } from 'react';
// Query keys for cache management
export const patientKeys = {
    all: ['patients'],
    lists: () => [...patientKeys.all, 'list'],
    list: (filters) => [...patientKeys.lists(), filters],
    details: () => [...patientKeys.all, 'detail'],
    detail: (id) => [...patientKeys.details(), id],
};
/**
 * React Query hook for patients management
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetching
 * - Optimistic updates on mutations
 * - Automatic cache invalidation
 */
const usePatientsQuery = (userRoleId) => {
    const queryClient = useQueryClient();
    const { confirm, ConfirmDialog } = useConfirmModal();
    // Form state (still managed locally for controlled inputs)
    const [newPatient, setNewPatient] = useState({
        email: "",
        password: "",
        role_id: 2,
        nombre: "",
        apellido: "",
        numero_telefono: "",
        direccion: "",
        sexo: "",
        fecha_nacimiento: "",
    });
    const [editPatient, setEditPatient] = useState(null);
    // Query: Fetch patients with caching
    const { data: patients = [], isLoading: loading, error, refetch: fetchPatients, } = useQuery({
        queryKey: patientKeys.lists(),
        queryFn: async () => {
            const response = await getPatients();
            return response.data || [];
        },
        // Only fetch if user has correct role
        enabled: [1, 3].includes(Number(userRoleId)),
        staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    });
    // Mutation: Create patient
    const createMutation = useMutation({
        mutationFn: (data) => createPatient(data),
        onSuccess: () => {
            toast.success("Paciente creado correctamente");
            // Invalidate and refetch patients list
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: (error) => {
            const detail = error.response?.data?.detail;
            let errorMsg = "Error al crear paciente";
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
    // Mutation: Update patient
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updatePatient(id, data),
        onSuccess: () => {
            toast.success("Paciente actualizado correctamente");
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: (error) => {
            const detail = error.response?.data?.detail;
            let errorMsg = "Error al actualizar paciente";
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
    // Mutation: Delete patient
    const deleteMutation = useMutation({
        mutationFn: (id) => deletePatient(id),
        onSuccess: () => {
            toast.success("Paciente eliminado correctamente");
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: () => {
            toast.error("Error al eliminar paciente");
        },
    });
    // Handlers
    const handleCreateOrUpdate = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (editPatient) {
                const { password, ...updateData } = newPatient;
                const dataToSend = password?.trim()
                    ? { ...updateData, password }
                    : { ...updateData, password: "" };
                await updateMutation.mutateAsync({ id: editPatient.id, data: dataToSend });
            }
            else {
                await createMutation.mutateAsync(newPatient);
            }
            // Reset form
            setNewPatient({
                email: "",
                password: "",
                role_id: 2,
                nombre: "",
                apellido: "",
                numero_telefono: "",
                direccion: "",
                sexo: "",
                fecha_nacimiento: "",
            });
            setEditPatient(null);
            return true;
        }
        catch {
            return false;
        }
    }, [editPatient, newPatient, createMutation, updateMutation]);
    const handleDelete = useCallback(async (id) => {
        const confirmed = await confirm({
            title: "Eliminar paciente",
            message: "¿Estas seguro de eliminar este paciente?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            variant: "destructive",
        });
        if (!confirmed)
            return;
        deleteMutation.mutate(id);
    }, [confirm, deleteMutation]);
    const handleEdit = useCallback((patient) => {
        setNewPatient({
            email: patient.email,
            password: "",
            role_id: 2,
            nombre: patient.nombre,
            apellido: patient.apellido,
            numero_telefono: patient.numero_telefono || "",
            direccion: patient.direccion || "",
            sexo: patient.sexo || "",
            fecha_nacimiento: patient.fecha_nacimiento || "",
        });
        setEditPatient(patient);
    }, []);
    return {
        // Data
        patients,
        loading,
        error,
        // Form state
        newPatient,
        editPatient,
        setNewPatient,
        setEditPatient,
        // Actions
        handleCreateOrUpdate,
        handleDelete,
        handleEdit,
        fetchPatients,
        // Mutation states (for loading indicators)
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        // Modal
        ConfirmDialog,
    };
};
export default usePatientsQuery;
