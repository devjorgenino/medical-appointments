import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Card } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { AppointmentCard } from "@components/molecules/AppointmentCard"
import { updateAppointment, deleteAppointment } from "@services/appointment"
import { toast } from "@lib/toast"
import useAppointments from "@hooks/appointment/useAppointments"
import { useConfirmModal } from "@hooks/useConfirmModal"
import EmptyState from "@components/molecules/EmptyState"

interface Appointment {
  id: number
  code: string
  type: string
  doctor: { id: number; nombre: string; apellido: string; especialidad: string; user_id: number }
  patient: { id: number; nombre: string; apellido: string; fecha_nacimiento?: string; user_id: number }
  time_slot: { id: number; start_time: string; end_time: string }
  date: string
  cost: number
  status: { id: number; name: string }
  notes?: string
  is_paid: boolean
}

interface AppointmentsListProps {
  filterDate?: Date
  refreshKey: number
  user: { id: number; role_id: number; email: string }
  setRefreshKey: (fn: (prev: number) => number) => void
  filterStatus?: string
}

export function AppointmentsList({ filterDate, refreshKey, user, setRefreshKey, filterStatus }: AppointmentsListProps) {
  const { confirm, ConfirmDialog } = useConfirmModal()
  const appointmentsResult = useAppointments({ filterDate, refreshKey, filterStatus })
  const canCreate = [1, 2, 3].includes(user.role_id)

  if (!appointmentsResult) {
    console.error("useAppointments retornó undefined")
    return (
      <Card className="p-12 text-center">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error al cargar citas</h3>
        <p className="text-gray-500 dark:text-gray-400">No se pudo cargar la lista de citas. Por favor, intenta de nuevo.</p>
      </Card>
    )
  }

  const { appointments, loading } = appointmentsResult

  const handleUpdate = async (id: number, data: unknown) => {
    try {
      await updateAppointment(id, data as { status_id?: number; notes?: string; is_paid?: boolean });
      toast.success("Cita actualizada")
      setRefreshKey((prev) => prev + 1)
    } catch (error: unknown) {
      console.error("Error updating appointment:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response: { data: { detail?: string } } };
        toast.error(errorResponse.response.data?.detail || "Error al actualizar cita");
      } else {
        toast.error("Error al actualizar cita");
      }
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "Cancelar cita",
      message: "¿Estás seguro de cancelar esta cita?",
      confirmText: "Cancelar cita",
      cancelText: "No cancelar",
      variant: "destructive",
    })

    if (!confirmed) return

    try {
      await deleteAppointment(id)
      toast.success("Cita cancelada")
      setRefreshKey((prev) => prev + 1)
    } catch (error: unknown) {
      console.error("Error deleting appointment:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response: { data: { detail?: string } } };
        toast.error(errorResponse.response.data?.detail || "Error al cancelar cita");
      } else {
        toast.error("Error al cancelar cita");
      }
    }
  }

  // Agrupar citas por fecha
  const groupedAppointments: { [key: string]: Appointment[] } = {}
  appointments.forEach((app) => {
    const dateKey = format(new Date(app.date), "yyyy-MM-dd")
    if (!groupedAppointments[dateKey]) groupedAppointments[dateKey] = []
    groupedAppointments[dateKey].push(app)
  })

  const sortedDates = Object.keys(groupedAppointments).sort()

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const dayAppointments = groupedAppointments[dateKey]
        const date = new Date(dateKey)
        const appointmentCount = dayAppointments.length

        return (
          <div key={dateKey} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {format(date, "dd 'de' MMMM, yyyy", { locale: es })}
                </h3>
              </div>
              <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {appointmentCount} {appointmentCount === 1 ? "Cita" : "Citas"}
              </Badge>
            </div>
            <div className="space-y-3">
              {dayAppointments.map((app) => (
                <AppointmentCard
                  key={app.id}
                  appointment={{
                    id: app.code,
                    patientName: app.patient?.nombre && app.patient?.apellido
                      ? `${app.patient.nombre} ${app.patient.apellido}`.trim()
                      : `Paciente ID ${app.patient?.id || "desconocido"}`,
                    doctorName: app.doctor?.nombre && app.doctor?.apellido
                      ? `${app.doctor.nombre} ${app.doctor.apellido}`.trim()
                      : `Doctor ID ${app.doctor?.id || "desconocido"}`,
                    date: new Date(app.date),
                    time: app.time_slot
                      ? `${app.time_slot.start_time.slice(0, 5)} - ${app.time_slot.end_time.slice(0, 5)}`
                      : "N/A",
                    type: app.type,
                    status: app.status ? app.status.name.toLowerCase() : "desconocido",
                    patientUserId: app.patient?.user_id ?? undefined,
                  }}
                  onUpdate={(updatedData) => handleUpdate(app.id, updatedData)}
                  onDelete={() => handleDelete(app.id)}
                  user={user}
                />
              ))}
            </div>
          </div>
        )
      })}

      {appointments.length === 0 && (
        <EmptyState
          icon="appointments"
          title="No hay citas programadas"
          description={filterDate || filterStatus 
            ? "No se encontraron citas con los filtros aplicados. Prueba ajustando los filtros o creando una nueva cita."
            : "Comienza creando una nueva cita médica para gestionar las appointments del sistema."
          }
          size="lg"
        />
      )}
      <ConfirmDialog />
    </div>
  )
}
