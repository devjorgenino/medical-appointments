import { useState, useEffect } from "react";
import { getAppointments } from "@services/appointment";
import { toast } from "@lib/toast";
const useAppointments = ({ filterDate, refreshKey, filterStatus }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAppointments = async () => {
        try {
            const response = await getAppointments();
            setAppointments(response.data);
        }
        catch (error) {
            console.error("Error al obtener las citas:", error.response?.data?.detail || error.message);
        }
    };
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filterDate) {
                    const start = new Date(filterDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(filterDate);
                    end.setHours(23, 59, 59, 999);
                    params.date_from = start.toISOString();
                    params.date_to = end.toISOString();
                }
                if (filterStatus) {
                    params.status_id = filterStatus === "próximas" ? 1 : filterStatus === "pasadas" ? 2 : undefined;
                }
                console.log("Parámetros enviados a la API:", params);
                const response = await getAppointments(params);
                console.log("Respuesta de la API:", response.data);
                // Filtra citas con datos incompletos
                const validAppointments = response.data.filter((app) => app.patient && app.doctor && app.status && app.time_slot);
                setAppointments(validAppointments);
                if (response.data.length !== validAppointments.length) {
                    toast.info("Algunas citas no tienen datos completos de paciente, doctor, estado o franja horaria");
                }
            }
            catch (error) {
                console.error("Error en useAppointments:", error);
                const errorMessage = error.response?.data?.detail || "Error al obtener citas";
                toast.error(errorMessage);
                setAppointments([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [filterDate, refreshKey, filterStatus]);
    console.log("Retornando desde useAppointments:", { appointments, loading });
    return { appointments, loading };
};
export default useAppointments;
