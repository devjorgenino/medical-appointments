import { useState, useEffect } from "react"
import { getAppointments } from "@services/appointment"
import { toast } from "@lib/toast"

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

interface UseAppointmentsProps {
  filterDate?: Date
  refreshKey: number
  filterStatus?: string
}

const useAppointments = ({ filterDate, refreshKey, filterStatus }: UseAppointmentsProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments()
      setAppointments(response.data)
    } catch (error: any) {
      console.error("Error al obtener las citas:", error.response?.data?.detail || error.message)
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (filterDate) {
          const start = new Date(filterDate)
          start.setHours(0, 0, 0, 0)
          const end = new Date(filterDate)
          end.setHours(23, 59, 59, 999)
          params.date_from = start.toISOString()
          params.date_to = end.toISOString()
        }
        if (filterStatus) {
          params.status_id = filterStatus === "próximas" ? 1 : filterStatus === "pasadas" ? 2 : undefined
        }
        console.log("Parámetros enviados a la API:", params)
        const response = await getAppointments(params)
        console.log("Respuesta de la API:", response.data)
        // Filtra citas con datos incompletos
        const validAppointments = response.data.filter(
          (app: Appointment) => app.patient && app.doctor && app.status && app.time_slot,
        )
        setAppointments(validAppointments)
        if (response.data.length !== validAppointments.length) {
          toast.info("Algunas citas no tienen datos completos de paciente, doctor, estado o franja horaria")
        }
      } catch (error: any) {
        console.error("Error en useAppointments:", error)
        const errorMessage = error.response?.data?.detail || "Error al obtener citas"
        toast.error(errorMessage)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [filterDate, refreshKey, filterStatus])

  console.log("Retornando desde useAppointments:", { appointments, loading })
  return { appointments, loading }
}

export default useAppointments
