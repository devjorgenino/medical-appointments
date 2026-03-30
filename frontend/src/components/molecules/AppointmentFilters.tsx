import { Calendar } from "@components/ui/calendar"
import { Button } from "@components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"
import { CalendarIcon, Filter } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@lib/utils"  // Asume lib/utils existe

interface AppointmentFiltersProps {
  selectedDate?: Date
  onDateChange: (date: Date | undefined) => void
  selectedStatus?: string  // Agregado: 'próximas', 'pasadas', etc.
  onStatusChange: (status: string | undefined) => void  // Agregado
}

export function AppointmentFilters({ selectedDate, onDateChange, selectedStatus, onStatusChange }: AppointmentFiltersProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
      </div>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: es }) : "Seleccionar fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} initialFocus />
        </PopoverContent>
      </Popover>

      {/* Quick Filters */}
      <div className="flex items-center space-x-2">
        <Button variant={selectedStatus === 'próximas' ? 'default' : 'outline'} size="sm" className="dark:text-white dark:border-gray-600" onClick={() => onStatusChange('próximas')}>
          Próximas
        </Button>
        <Button variant={selectedStatus === 'pasadas' ? 'default' : 'outline'} size="sm" className="dark:text-white dark:border-gray-600" onClick={() => onStatusChange('pasadas')}>
          Pasadas
        </Button>
        <Button variant="outline" size="sm" className="dark:text-white dark:border-gray-600" onClick={() => onDateChange(new Date())}>Hoy</Button>  
      </div>

      {/* Clear Filters */}
      {(selectedDate || selectedStatus) && (
        <Button variant="ghost" size="sm" className="dark:text-gray-300" onClick={() => { onDateChange(undefined); onStatusChange(undefined); }}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}