import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import { AppointmentsList } from "@components/molecules/AppointmentsList";
import { AppointmentModal } from "@components/molecules/AppointmentModal";
import { AppointmentFilters } from "@components/molecules/AppointmentFilters";
import ErrorBoundary from "@components/templates/ErrorBoundary";

interface AppointmentsViewProps {
  user: { id: number; role_id: number; email: string };
}

export function AppointmentsView({ user }: AppointmentsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
  };

  const canCreate = [1, 2, 3].includes(user.role_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gestion de Citas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra las citas medicas y su programacion
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        )}
      </div>

      <AppointmentFilters
        selectedDate={filterDate}
        onDateChange={setFilterDate}
        selectedStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />

      <ErrorBoundary>
        <AppointmentsList
          filterDate={filterDate}
          refreshKey={refreshKey}
          user={user}
          setRefreshKey={setRefreshKey}
          filterStatus={filterStatus}
        />
      </ErrorBoundary>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAppointmentCreated}
        user={user}
      />
    </div>
  );
}
