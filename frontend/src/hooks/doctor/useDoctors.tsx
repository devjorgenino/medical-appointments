import { useState, useEffect, useCallback } from "react";
import { toast } from "@lib/toast";
import { createDoctor, updateDoctor, getDoctors, deleteDoctor } from "@services/doctor";
import type { UserDoctor } from "@src/types/doctor";
import { useConfirmModal } from "@hooks/useConfirmModal";

const useDoctors = (userRoleId: number) => {
  const { confirm, ConfirmDialog } = useConfirmModal();

  const [doctors, setDoctors] = useState<UserDoctor[]>([]);
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
  const [editDoctor, setEditDoctor] = useState<UserDoctor | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data);
    } catch (error) {
      toast.error("Error al cargar médicos");
    }
  }, []);

  // ← LA CLAVE: devuelve boolean y NUNCA hace navigate aquí
  const handleCreateOrUpdate = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    try {
      if (editDoctor) {
        // Edición
        const { password, ...updateData } = newDoctor;
        const dataToSend = password?.trim() ? { ...updateData, password } : updateData;
        await updateDoctor(editDoctor.id, dataToSend);
        toast.success("Médico actualizado correctamente");
      } else {
        // Creación
        await createDoctor(newDoctor);
        toast.success("Médico creado correctamente");
      }

      // Reset formulario
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

      // Refrescamos lista
      await fetchDoctors();

      return true; // ← ÉXITO → FormLayout navegará
    } catch (error: any) {
      let errorMsg = "Error al guardar médico";

      const detail = error.response?.data?.detail;
      if (detail) {
        if (Array.isArray(detail)) {
          errorMsg = detail.map((e: any) => e.msg).join(" • ");
        } else if (typeof detail === "string") {
          errorMsg = detail;
        }
      }

      toast.error(errorMsg);
      return false; // ← ERROR → FormLayout NO navega
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "Eliminar médico",
      message: "¿Estás seguro de eliminar este médico?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await deleteDoctor(id);
      toast.success("Médico eliminado correctamente");
      await fetchDoctors();
    } catch (error) {
      toast.error("Error al eliminar médico");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    doctors,
    newDoctor,
    editDoctor,
    setNewDoctor,
    setEditDoctor,
    handleCreateOrUpdate,
    handleDelete,
    fetchDoctors,
    ConfirmDialog,
  };
};

export default useDoctors;