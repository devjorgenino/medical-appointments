import type React from "react";
import { Calendar, Phone, Mail, Stethoscope } from 'lucide-react';
import Button from "@components/atoms/Button";
import type { UserDoctor } from "@src/types/doctor";

interface DoctorCardProps {
  doctor: UserDoctor;
  onScheduleAppointment: (doctorId: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onScheduleAppointment }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-sm">
            <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dr. {doctor.nombre} {doctor.apellido}
            </h3>
            {doctor.especialidad && (
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mt-1">
                {doctor.especialidad}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body Card */}
      <div className="p-6 space-y-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
          <span>{doctor.email}</span>
        </div>
        
        {doctor.numero_telefono && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
            <span>{doctor.numero_telefono}</span>
          </div>
        )}

        {doctor.direccion && (
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-3 mt-0.5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="flex-1">{doctor.direccion}</span>
          </div>
        )}
      </div>

      {/* Footer Card */}
      <div className="px-6 pb-6">
        <Button
          type="button"
          className="w-full flex items-center justify-center space-x-2 py-2.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm"
          onClick={() => onScheduleAppointment(doctor.id)}
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar Cita</span>
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
