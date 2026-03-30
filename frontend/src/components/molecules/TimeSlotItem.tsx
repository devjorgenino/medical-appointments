import type React from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { Switch } from "@components/ui/switch"
import type { TimeSlot } from "@src/types/schedule"

interface TimeSlotItemProps {
  slot: TimeSlot
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}

export const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ slot, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {slot.start_time} - {slot.end_time}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            {!slot.is_active && (
              <Badge variant="secondary" className="text-xs">
                Inactivo
              </Badge>
            )}
            <Switch
              checked={slot.is_active}
              onCheckedChange={onToggleActive}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
