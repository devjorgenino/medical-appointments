import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import StatsCard from "@components/molecules/StatsCard";
import EmptyState from "@components/molecules/EmptyState";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@components/atoms/Skeleton";
import { Clock, Calendar, CheckCircle, Stethoscope, UserCircle, TrendingUp, CalendarX, } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { getDashboardStats, getAppointmentsTrend, getUpcomingAppointments, } from "@services/dashboard";
import { useTheme } from "@hooks/useTheme";
const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [trend, setTrend] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Error al cargar los datos del dashboard");
        }
        finally {
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
        return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white tracking-tight", children: "Bienvenido al Dashboard" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Cargando informacion..." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {}), _jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(SkeletonChart, {}), _jsx(SkeletonChart, {})] }), _jsx(SkeletonTable, { rows: 5 })] }));
    }
    if (error) {
        return (_jsx(EmptyState, { customIcon: CalendarX, title: "Error al cargar el dashboard", description: error, actionLabel: "Reintentar", onAction: fetchDashboardData }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white tracking-tight", children: "Bienvenido al Dashboard" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Resumen general de tu sistema medico" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(StatsCard, { title: "Total de Citas", value: stats?.total_appointments || 0, icon: Calendar, color: "blue" }), _jsx(StatsCard, { title: "Citas Hoy", value: stats?.today_appointments || 0, icon: Clock, color: "green" }), _jsx(StatsCard, { title: "Total Pacientes", value: stats?.total_patients || 0, icon: UserCircle, color: "purple" }), _jsx(StatsCard, { title: "Total Doctores", value: stats?.total_doctors || 0, icon: Stethoscope, color: "orange" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Tendencia de Citas (Ultimos 7 dias)" }), _jsx(TrendingUp, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: trend, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: chartGridColor }), _jsx(XAxis, { dataKey: "date", stroke: chartTextColor }), _jsx(YAxis, { stroke: chartTextColor }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder}`,
                                                borderRadius: "0.75rem",
                                                color: theme === "dark" ? "#f3f4f6" : "#1f2937",
                                            } }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "citas", stroke: "#3b82f6", strokeWidth: 3, dot: { fill: "#3b82f6", r: 5 }, activeDot: { r: 7 } })] }) })] }), _jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Estado de Citas" }), _jsx(CheckCircle, { className: "w-5 h-5 text-green-600 dark:text-green-400" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: appointmentStatusData, cx: "50%", cy: "50%", labelLine: false, label: (entry) => entry.name, outerRadius: 100, fill: "#8884d8", dataKey: "value", children: appointmentStatusData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: tooltipBg,
                                                border: `1px solid ${tooltipBorder}`,
                                                borderRadius: "0.75rem",
                                                color: theme === "dark" ? "#f3f4f6" : "#1f2937",
                                            } })] }) })] })] }), _jsxs("div", { className: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-6", children: "Proximas Citas" }), upcomingAppointments.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [_jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300", children: "Fecha" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300", children: "Hora" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300", children: "Paciente" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300", children: "Doctor" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300", children: "Motivo" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300", children: "Estado" })] }) }), _jsx("tbody", { children: upcomingAppointments.map((appointment) => (_jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors", children: [_jsx("td", { className: "py-3 px-4 text-gray-900 dark:text-white", children: new Date(appointment.fecha).toLocaleDateString("es-ES") }), _jsx("td", { className: "py-3 px-4 text-gray-900 dark:text-white", children: appointment.hora || "N/A" }), _jsx("td", { className: "py-3 px-4 text-gray-900 dark:text-white", children: appointment.patient_name }), _jsx("td", { className: "py-3 px-4 text-gray-900 dark:text-white", children: appointment.doctor_name }), _jsx("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: appointment.motivo }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${appointment.estado === "Completada"
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : appointment.estado === "Pendiente"
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"}`, children: appointment.estado }) })] }, appointment.id))) })] }) })) : (_jsx(EmptyState, { customIcon: CalendarX, title: "No hay citas proximas", description: "Aun no tienes citas programadas. Las citas apareceran aqui cuando sean creadas.", actionLabel: "Ver todas las citas", actionLink: "/appointments" }))] })] }));
};
export default DashboardHome;
