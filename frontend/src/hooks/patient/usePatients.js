import { useState, useEffect, useCallback } from "react";
import { toast } from "@lib/toast";
import { getPatients, createPatient, updatePatient, deletePatient, } from "@services/patient";
import { useConfirmModal } from "@hooks/useConfirmModal";
const usePatients = (userRoleId) => {
    const { confirm, ConfirmDialog } = useConfirmModal();
    const [patients, setPatients] = useState([]);
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
    const fetchPatients = useCallback(async () => {
        if (![1, 3].includes(Number(userRoleId))) {
            setPatients([]);
            return;
        }
        try {
            const response = await getPatients();
            setPatients(response.data || []);
        }
        catch (error) {
            toast.error("Error al cargar pacientes");
        }
    }, [userRoleId]);
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editPatient) {
                const { password, ...updateData } = newPatient;
                const dataToSend = password?.trim() ? { ...updateData, password } : updateData;
                await updatePatient(editPatient.id, dataToSend);
                toast.success("Paciente actualizado correctamente");
            }
            else {
                await createPatient(newPatient);
                toast.success("Paciente creado correctamente");
            }
            // Reset formulario
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
            await fetchPatients();
            return true;
        }
        catch (error) {
            let errorMsg = "Error al guardar paciente";
            const detail = error.response?.data?.detail;
            if (detail) {
                if (Array.isArray(detail)) {
                    errorMsg = detail.map((e) => e.msg).join(" • ");
                }
                else if (typeof detail === "string") {
                    errorMsg = detail;
                }
            }
            toast.error(errorMsg);
            return false;
        }
    };
    const handleDelete = async (id) => {
        const confirmed = await confirm({
            title: "Eliminar paciente",
            message: "¿Estás seguro de eliminar este paciente?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            variant: "destructive",
        });
        if (!confirmed)
            return;
        try {
            await deletePatient(id);
            toast.success("Paciente eliminado correctamente");
            await fetchPatients();
        }
        catch (error) {
            toast.error("Error al eliminar paciente");
        }
    };
    // Función auxiliar para el botón editar de la tabla
    const handleEdit = (patient) => {
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
    };
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);
    return {
        patients,
        newPatient,
        editPatient,
        setNewPatient,
        setEditPatient,
        handleCreateOrUpdate,
        handleDelete,
        handleEdit,
        fetchPatients,
        ConfirmDialog,
    };
};
export default usePatients;
