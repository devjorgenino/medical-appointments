import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { CalendarIcon, Clock, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@lib/utils";
import { toast } from "@lib/toast";

import { getDoctors } from "@services/doctor";
import { getMyPatients, getPatients } from "@services/patient";
import { createAppointment } from "@services/appointment";
import { getAvailableTimeSlots } from "@services/schedule";

interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  role_id: number;
  user_id: number;
}

interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento?: string;
  email: string;
  role_id: number;
  user_id: number;
}

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: { id: number; role_id: number; email: string };
}

export function AppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: AppointmentModalProps) {
  console.log("AppointmentModal rendered with user:", user);
  console.log("localStorage token:", localStorage.getItem("token"));
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDoctor, setSelectedDoctor] = useState<number | undefined>();
  const [selectedPatient, setSelectedPatient] = useState<number | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    number | undefined
  >();
  const [appointmentType, setAppointmentType] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
        } else {
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
        } catch (doctorError) {
          console.error("Error fetching doctors:", doctorError);
          if (doctorError instanceof Error) {
            if (doctorError.message.includes('403')) {
              setFetchError("No tienes permisos para ver doctores. Por favor, inicia sesión nuevamente.");
            } else if (doctorError.message.includes('401')) {
              setFetchError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            } else {
              setFetchError(`Error al cargar doctores: ${doctorError.message}`);
            }
          } else {
            setFetchError("Error desconocido al cargar doctores");
          }
          toast.error("Error al cargar doctores");
        }
      } catch (error) {
        console.error("Error in AppointmentModal fetchData:", error);
        setFetchError("Error al cargar los datos del formulario");
        toast.error("Error al cargar datos");
      } finally {
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
      if (!selectedDoctor || !selectedDate) return;
      setLoading(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        console.log(
          "Fetching time slots for doctor:",
          selectedDoctor,
          "date:",
          dateStr
        );
        const slotsRes = await getAvailableTimeSlots(selectedDoctor, dateStr);
        console.log("Available slots response:", slotsRes.data);
        setAvailableTimeSlots(slotsRes.data || []);
      } catch (error) {
        console.error("Time slots error:", error);
        toast.error("Error al cargar horarios disponibles");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDoctor, selectedDate]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedPatient ||
      !selectedDoctor ||
      !selectedDate ||
      !selectedTimeSlot ||
      !appointmentType
    ) {
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
    } catch (error: unknown) {
      console.error("Error creando cita:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error("Respuesta del server:", (error as { response: { data: unknown } }).response.data);
      }
      toast.error("Error al crear la cita. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Cita</DialogTitle>
          <DialogDescription>
            Selecciona los detalles para programar la cita.
          </DialogDescription>
        </DialogHeader>
        
        {fetchError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{fetchError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Doctor y Paciente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Doctor</Label>
              <Select
                disabled={loading || doctors.length === 0}
                onValueChange={(value) => {
                  setSelectedDoctor(Number(value));
                  const doc = doctors.find((d) => d.id === Number(value));
                  setAppointmentType(doc?.especialidad || "");
                }}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Cargando doctores..."
                        : doctors.length === 0
                        ? "No hay doctores disponibles"
                        : "Seleccione un doctor"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="border-gray-200 dark:border-gray-700 shadow-lg">
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/50">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="font-medium">{doc.nombre} {doc.apellido}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{doc.especialidad}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Paciente</Label>
              {user.role_id === 2 ? (
                <Input 
                  value="Tú mismo" 
                  readOnly 
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                />
              ) : (
                <Select
                  disabled={loading || patients.length === 0}
                  onValueChange={(value) => setSelectedPatient(Number(value))}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                    <SelectValue
                      placeholder={
                        loading
                          ? "Cargando pacientes..."
                          : patients.length === 0
                          ? "No hay pacientes"
                          : "Seleccione un paciente"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 dark:border-gray-700 shadow-lg">
                    {patients.map((pat) => (
                      <SelectItem key={pat.id} value={pat.id.toString()} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/50">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="font-medium">{pat.nombre} {pat.apellido}</div>
                            {pat.fecha_nacimiento && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Nacimiento: {new Date(pat.fecha_nacimiento).toLocaleDateString('es-ES')}
                              </div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Tipo de Cita (read-only basado en doctor) */}
          {appointmentType && (
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Cita</Label>
              <Input
                value={appointmentType}
                readOnly
                placeholder="Especialidad del doctor seleccionado"
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
              />
            </div>
          )}

          {/* Fecha y Hora */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fecha y Hora</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200",
                        !selectedDate && "text-gray-400 dark:text-gray-500",
                        selectedDate && "text-gray-900 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      {selectedDate
                        ? format(selectedDate, "dd 'de' MMMM, yyyy", {
                            locale: es,
                          })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="rounded-lg border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hora Disponible</Label>
                <Select
                  disabled={loading || availableTimeSlots.length === 0}
                  onValueChange={(value) => setSelectedTimeSlot(Number(value))}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                    <SelectValue
                      placeholder={
                        loading
                          ? "Cargando horas..."
                          : availableTimeSlots.length === 0
                          ? "No hay horas disponibles"
                          : "Seleccione la hora"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 dark:border-gray-700 shadow-lg">
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id.toString()} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/50">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="font-medium">{slot.start_time.slice(0, 5)}</span>
                          <span className="mx-1 text-gray-400 dark:text-gray-500">-</span>
                          <span className="font-medium">{slot.end_time.slice(0, 5)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
