import React from "react";

import { ScheduleManager } from "@components/templates/ScheduleManager";
import { NotAuthorized } from "@components/organisms/NotAuthorized";

interface SchedulesPageProps {
  user: { id: number; email: string; role_id: number };
}

const SchedulesPage: React.FC<SchedulesPageProps> = ({ user }) => {
  if (![1, 3].includes(Number(user.role_id))) {
    return <NotAuthorized />;
  }

  return <ScheduleManager user={user} />;
};

export default SchedulesPage;
