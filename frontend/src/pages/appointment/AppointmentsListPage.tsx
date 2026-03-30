import React from 'react';
import { AppointmentsView } from '@components/organisms/AppointmentsView'; 

interface AppointmentsPageProps {
  user: { id: number; role_id: number; email: string };
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ user }) => {
  return <AppointmentsView user={user} />;
};

export default AppointmentsPage;