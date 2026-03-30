import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// Lazy load all page components for better performance
const LoginPage = lazy(() => import("@pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@pages/auth/ResetPasswordPage"));
const DashboardHome = lazy(() => import("@pages/dashboard/DashboardHome"));
const DashboardLayout = lazy(() => import("@components/templates/DashboardLayout"));
const UsersListPage = lazy(() => import("@pages/user/UsersListPage"));
const UserFormPage = lazy(() => import("@pages/user/UserFormPage"));
const AppointmentsPage = lazy(() => import("@pages/appointment/AppointmentsListPage"));
const SchedulesPage = lazy(() => import("@pages/schedule/SchedulesListPage"));
const DoctorsListPage = lazy(() => import("@pages/doctor/DoctorsListPage"));
const DoctorFormPage = lazy(() => import("@pages/doctor/DoctorFormPage"));
const PatientsListPage = lazy(() => import("@pages/patient/PacientsListPage"));
const PatientFormPage = lazy(() => import("@pages/patient/PatientFormPage"));
const ProfilePage = lazy(() => import("@components/pages/ProfilePage"));
import useAuth from "@hooks/auth/useAuth";
import { ProtectedRoute } from "@components/auth/ProtectedRoute";
import { SessionExpiryModal } from "@components/auth/SessionExpiryModal";
import { isValidToken } from "@utils/auth";
// Loading fallback component for Suspense
const PageLoader = () => (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin", role: "status", "aria-label": "Cargando pagina" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Cargando..." })] }) }));
export const AppContent = () => {
    const { user, handleLogin, handleLogout, showExpiryModal, timeRemaining, extendSession, isExtending } = useAuth();
    // Verificar si hay token válido (independiente del estado del usuario)
    const hasValidToken = isValidToken();
    return (_jsxs(Suspense, { fallback: _jsx(PageLoader, {}), children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: hasValidToken && user ? _jsx(Navigate, { to: "/", replace: true }) : _jsx(LoginPage, { onLogin: handleLogin }) }), _jsx(Route, { path: "/reset-password", element: _jsx(ResetPasswordPage, {}) }), _jsx(Route, { path: "/register", element: hasValidToken && user ? _jsx(Navigate, { to: "/", replace: true }) : _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/forgot-password", element: hasValidToken && user ? _jsx(Navigate, { to: "/", replace: true }) : _jsx(ForgotPasswordPage, {}) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: user ? _jsx(DashboardLayout, { user: user, onLogout: handleLogout }) : _jsx(Navigate, { to: "/login", replace: true }) }), children: [user && (_jsxs(_Fragment, { children: [_jsx(Route, { path: "dashboard", element: _jsx(DashboardHome, {}) }), _jsx(Route, { path: "appointments", element: _jsx(AppointmentsPage, { user: user }) }), (() => {
                                        const routesByRole = {
                                            1: [
                                                _jsx(Route, { path: "users", element: _jsx(UsersListPage, { user: user }) }, "users"),
                                                _jsx(Route, { path: "user", element: _jsx(UserFormPage, { user: user }) }, "user"),
                                                _jsx(Route, { path: "schedules", element: _jsx(SchedulesPage, { user: user }) }, "schedules"),
                                                _jsx(Route, { path: "doctors", element: _jsx(DoctorsListPage, { user: user }) }, "doctors"),
                                                _jsx(Route, { path: "doctor", element: _jsx(DoctorFormPage, { user: user }) }, "doctor"),
                                                _jsx(Route, { path: "patients", element: _jsx(PatientsListPage, { user: user }) }, "patients"),
                                                _jsx(Route, { path: "patient", element: _jsx(PatientFormPage, { user: user }) }, "patient"),
                                                _jsx(Route, { path: "profile", element: _jsx(ProfilePage, {}) }, "profile"),
                                            ],
                                            2: [
                                                _jsx(Route, { path: "doctors", element: _jsx(DoctorsListPage, { user: user }) }, "doctors"),
                                                _jsx(Route, { path: "profile", element: _jsx(ProfilePage, {}) }, "profile"),
                                            ],
                                            3: [
                                                _jsx(Route, { path: "patients", element: _jsx(PatientsListPage, { user: user }) }, "patients"),
                                                _jsx(Route, { path: "patient", element: _jsx(PatientFormPage, { user: user }) }, "patient"),
                                                _jsx(Route, { path: "schedules", element: _jsx(SchedulesPage, { user: user }) }, "schedules"),
                                                _jsx(Route, { path: "profile", element: _jsx(ProfilePage, {}) }, "profile"),
                                            ],
                                        };
                                        return routesByRole[user.role_id] || null;
                                    })()] })), _jsx(Route, { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }), user && (_jsx(SessionExpiryModal, { isOpen: showExpiryModal, timeRemaining: timeRemaining, onExtendSession: extendSession, onLogout: handleLogout, isExtending: isExtending }))] }));
};
