import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@components/ui/select";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "@components/ui/popover";
import { CalendarIcon, Clock, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@lib/utils";
import { toast } from "@lib/toast";
import { getDoctors } from "@services/doctor";
import { getMyPatients, getPatients } from "@services/patient";
import { createAppointment } from "@services/appointment";
import { getAvailableTimeSlots } from "@services/schedule";
export function AppointmentModal({ isOpen, onClose, onSuccess, user, }) {
    console.log("AppointmentModal rendered with user:", user);
    console.log("localStorage token:", localStorage.getItem("token"));
    const [selectedDate, setSelectedDate] = useState();
    const [selectedDoctor, setSelectedDoctor] = useState();
    const [selectedPatient, setSelectedPatient] = useState();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const [appointmentType, setAppointmentType] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    // Fetch inicial de datos
    useEffect(() => {
        const fetchData = async () => {
            console.log("AppointmentModal: Starting data fetch...");
            console.log("User:", user);
            setLoading(true);
            setFetchError(null);
            try {
                // Pacientes
                if (Number(user.role_id) === 2) {
                    console.log("Fetching patient data for role_id:", user.role_id);
                    const meRes = await getMyPatients();
                    console.log("MyPatients response:", meRes.data);
                    setSelectedPatient(meRes.data.id);
                }
                else {
                    console.log("Fetching all patients...");
                    const patientsRes = await getPatients();
                    console.log("Patients response:", patientsRes.data);
                    setPatients(patientsRes.data || []);
                }
                // Doctores (todos para cualquier role)
                console.log("Fetching doctors...");
                try {
                    const doctorsRes = await getDoctors();
                    console.log("Doctors response:", doctorsRes.data);
                    setDoctors(doctorsRes.data || []);
                }
                catch (doctorError) {
                    console.error("Error fetching doctors:", doctorError);
                    if (doctorError instanceof Error) {
                        if (doctorError.message.includes('403')) {
                            setFetchError("No tienes permisos para ver doctores. Por favor, inicia sesión nuevamente.");
                        }
                        else if (doctorError.message.includes('401')) {
                            setFetchError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                        }
                        else {
                            setFetchError(`Error al cargar doctores: ${doctorError.message}`);
                        }
                    }
                    else {
                        setFetchError("Error desconocido al cargar doctores");
                    }
                    toast.error("Error al cargar doctores");
                }
            }
            catch (error) {
                console.error("Error in AppointmentModal fetchData:", error);
                setFetchError("Error al cargar los datos del formulario");
                toast.error("Error al cargar datos");
            }
            finally {
                setLoading(false);
            }
        };
        if (isOpen) {
            console.log("Modal is open, fetching data...");
            fetchData();
        }
    }, [isOpen, user]);
    // Fetch de time slots al cambiar doctor o fecha
    useEffect(() => {
        const fetchTimeSlots = async () => {
            if (!selectedDoctor || !selectedDate)
                return;
            setLoading(true);
            try {
                const dateStr = format(selectedDate, "yyyy-MM-dd");
                console.log("Fetching time slots for doctor:", selectedDoctor, "date:", dateStr);
                const slotsRes = await getAvailableTimeSlots(selectedDoctor, dateStr);
                console.log("Available slots response:", slotsRes.data);
                setAvailableTimeSlots(slotsRes.data || []);
            }
            catch (error) {
                console.error("Time slots error:", error);
                toast.error("Error al cargar horarios disponibles");
            }
            finally {
                setLoading(false);
            }
        };
        fetchTimeSlots();
    }, [selectedDoctor, selectedDate]);
    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient ||
            !selectedDoctor ||
            !selectedDate ||
            !selectedTimeSlot ||
            !appointmentType) {
            toast.error("Por favor, complete todos los campos");
            return;
        }
        const appointmentData = {
            patient_id: selectedPatient,
            doctor_id: selectedDoctor,
            date: format(selectedDate, "yyyy-MM-dd"),
            time_slot_id: selectedTimeSlot,
            type: appointmentType,
        };
        setLoading(true);
        try {
            await createAppointment(appointmentData);
            toast.success("Cita creada exitosamente");
            onSuccess();
            onClose();
        }
        catch (error) {
            console.error("Error creando cita:", error);
            if (error && typeof error === 'object' && 'response' in error) {
                console.error("Respuesta del server:", error.response.data);
            }
            toast.error("Error al crear la cita. Intente nuevamente.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "max-w-xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Crear Nueva Cita" }), _jsx(DialogDescription, { children: "Selecciona los detalles para programar la cita." })] }), fetchError && (_jsx("div", { className: "p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg", children: _jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: fetchError }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Doctor" }), _jsxs(Select, { disabled: loading || doctors.length === 0, onValueChange: (value) => {
                                                setSelectedDoctor(Number(value));
                                                const doc = doctors.find((d) => d.id === Number(value));
                                                setAppointmentType(doc?.especialidad || "");
                                            }, children: [_jsx(SelectTrigger, { className: "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200", children: _jsx(SelectValue, { placeholder: loading
                                                            ? "Cargando doctores..."
                                                            : doctors.length === 0
                                                                ? "No hay doctores disponibles"
                                                                : "Seleccione un doctor" }) }), _jsx(SelectContent, { className: "border-gray-200 dark:border-gray-700 shadow-lg", children: doctors.map((doc) => (_jsx(SelectItem, { value: doc.id.toString(), className: "hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/50", children: _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "font-medium", children: [doc.nombre, " ", doc.apellido] }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: doc.especialidad })] }) }) }, doc.id))) })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Paciente" }), user.role_id === 2 ? (_jsx(Input, { value: "T\u00FA mismo", readOnly: true, className: "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300" })) : (_jsxs(Select, { disabled: loading || patients.length === 0, onValueChange: (value) => setSelectedPatient(Number(value)), children: [_jsx(SelectTrigger, { className: "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200", children: _jsx(SelectValue, { placeholder: loading
                                                            ? "Cargando pacientes..."
                                                            : patients.length === 0
                                                                ? "No hay pacientes"
                                                                : "Seleccione un paciente" }) }), _jsx(SelectContent, { className: "border-gray-200 dark:border-gray-700 shadow-lg", children: patients.map((pat) => (_jsx(SelectItem, { value: pat.id.toString(), className: "hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/50", children: _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "font-medium", children: [pat.nombre, " ", pat.apellido] }), pat.fecha_nacimiento && (_jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Nacimiento: ", new Date(pat.fecha_nacimiento).toLocaleDateString('es-ES')] }))] }) }) }, pat.id))) })] }))] })] }), appointmentType && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Tipo de Cita" }), _jsx(Input, { value: appointmentType, readOnly: true, placeholder: "Especialidad del doctor seleccionado", className: "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300" })] })), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Fecha y Hora" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Fecha" }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200", !selectedDate && "text-gray-400 dark:text-gray-500", selectedDate && "text-gray-900 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"), children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" }), selectedDate
                                                                        ? format(selectedDate, "dd 'de' MMMM, yyyy", {
                                                                            locale: es,
                                                                        })
                                                                        : "Seleccionar fecha"] }) }), _jsx(PopoverContent, { className: "w-auto p-0 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg", align: "start", children: _jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: setSelectedDate, disabled: (date) => date < new Date(), initialFocus: true, className: "rounded-lg border-0" }) })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Hora Disponible" }), _jsxs(Select, { disabled: loading || availableTimeSlots.length === 0, onValueChange: (value) => setSelectedTimeSlot(Number(value)), children: [_jsx(SelectTrigger, { className: "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200", children: _jsx(SelectValue, { placeholder: loading
                                                                    ? "Cargando horas..."
                                                                    : availableTimeSlots.length === 0
                                                                        ? "No hay horas disponibles"
                                                                        : "Seleccione la hora" }) }), _jsx(SelectContent, { className: "border-gray-200 dark:border-gray-700 shadow-lg", children: availableTimeSlots.map((slot) => (_jsx(SelectItem, { value: slot.id.toString(), className: "hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/50", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" }), _jsx("span", { className: "font-medium", children: slot.start_time.slice(0, 5) }), _jsx("span", { className: "mx-1 text-gray-400 dark:text-gray-500", children: "-" }), _jsx("span", { className: "font-medium", children: slot.end_time.slice(0, 5) })] }) }, slot.id))) })] })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: onClose, disabled: loading, children: [_jsx(X, { className: "h-4 w-4" }), "Cancelar"] }), _jsxs(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700", disabled: loading, children: [_jsx(Save, { className: "h-4 w-4" }), "Guardar"] })] })] })] }) }));
}
