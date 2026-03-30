import React, { useEffect, useState } from "react";
import StatsCard from "@components/molecules/StatsCard";
import EmptyState from "@components/molecules/EmptyState";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@components/atoms/Skeleton";
import {
  Clock,
  Calendar,
  CheckCircle,
  Stethoscope,
  UserCircle,
  TrendingUp,
  CalendarX,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getDashboardStats,
  getAppointmentsTrend,
  getUpcomingAppointments,
} from "@services/dashboard";
import { useTheme } from "@hooks/useTheme";

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, trendRes, appointmentsRes] = await Promise.all([
        getDashboardStats(),
        getAppointmentsTrend(),
        getUpcomingAppointments(5),
      ]);

      setStats(statsRes.data);
      setTrend(trendRes.data);
      setUpcomingAppointments(appointmentsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const appointmentStatusData = stats
    ? [
        { name: "Pendientes", value: stats.pending_appointments },
        { name: "Completadas", value: stats.completed_appointments },
        { name: "Hoy", value: stats.today_appointments },
      ]
    : [];

  const chartTextColor = theme === "dark" ? "#9ca3af" : "#6b7280";
  const chartGridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const tooltipBg = theme === "dark" ? "#1f2937" : "white";
  const tooltipBorder = theme === "dark" ? "#374151" : "#e5e7eb";

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Bienvenido al Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Cargando informacion...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>

        <SkeletonTable rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        customIcon={CalendarX}
        title="Error al cargar el dashboard"
        description={error}
        actionLabel="Reintentar"
        onAction={fetchDashboardData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Bienvenido al Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Resumen general de tu sistema medico
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Citas"
          value={stats?.total_appointments || 0}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Citas Hoy"
          value={stats?.today_appointments || 0}
          icon={Clock}
          color="green"
        />
        <StatsCard
          title="Total Pacientes"
          value={stats?.total_patients || 0}
          icon={UserCircle}
          color="purple"
        />
        <StatsCard
          title="Total Doctores"
          value={stats?.total_doctors || 0}
          icon={Stethoscope}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Citas */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tendencia de Citas (Ultimos 7 dias)
            </h2>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="date" stroke={chartTextColor} />
              <YAxis stroke={chartTextColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "0.75rem",
                  color: theme === "dark" ? "#f3f4f6" : "#1f2937",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="citas"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Estado de Citas - Pie Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Estado de Citas
            </h2>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {appointmentStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "0.75rem",
                  color: theme === "dark" ? "#f3f4f6" : "#1f2937",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Proximas Citas */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Proximas Citas
        </h2>
        {upcomingAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Hora
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Paciente
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Motivo
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {new Date(appointment.fecha).toLocaleDateString("es-ES")}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {appointment.hora || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {appointment.patient_name}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {appointment.doctor_name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {appointment.motivo}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.estado === "Completada"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : appointment.estado === "Pendiente"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        }`}
                      >
                        {appointment.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            customIcon={CalendarX}
            title="No hay citas proximas"
            description="Aun no tienes citas programadas. Las citas apareceran aqui cuando sean creadas."
            actionLabel="Ver todas las citas"
            actionLink="/appointments"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
