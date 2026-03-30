import { ScheduleManager } from "@components/templates/ScheduleManager";

interface SchedulesPageProps {
  user: { id: number; email: string; role_id: number };
}

const SchedulesPage: React.FC<SchedulesPageProps> = ({ user }) => {
  console.log("Renderizando SchedulesPage con user:", user);
  if (user.role_id !== 1 && user.role_id !== 3) {
    return (
      <div className="p-4">
        Acceso denegado. Se requiere rol de administrador o médico.
      </div>
    );
  }

  return <ScheduleManager user={user} />;
};

export default SchedulesPage;