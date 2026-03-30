import { Card } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { MoreVertical } from "lucide-react"

interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: Date
  time: string
  type: string
  status: string
  patientUserId?: number
}

interface AppointmentCardProps {
  appointment: Appointment
  onUpdate?: (id: string) => void
  onDelete?: () => void
  user: { id: number; role_id: number }
}

export function AppointmentCard({ appointment, onUpdate, onDelete, user }: AppointmentCardProps) {
  const isOwn = user.role_id === 2 && appointment.patientUserId === user.id;
  const canEdit = [1, 3].includes(user.role_id) || isOwn;
  const canDelete = [1, 2, 3].includes(user.role_id);

  const statusVariant = appointment.status === 'próxima' ? 'default' : 
                        appointment.status === 'pasada' ? 'secondary' : 
                        appointment.status === 'cancelada' ? 'destructive' : 'outline';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{appointment.type}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Paciente: {appointment.patientName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Doctor: {appointment.doctorName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fecha: {appointment.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hora: {appointment.time}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={statusVariant}>
            {appointment.status}
          </Badge>
          {canEdit && onUpdate && <Button variant="outline" size="sm" onClick={() => onUpdate(appointment.id)}>Editar</Button>}
          {canDelete && onDelete && <Button variant="destructive" size="sm" onClick={onDelete}>Cancelar</Button>}
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
