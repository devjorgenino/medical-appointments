import type React from "react"
import { lazy, Suspense } from "react"
import type { JSX } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// Lazy load all page components for better performance
const LoginPage = lazy(() => import("@pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("@pages/auth/RegisterPage"))
const ForgotPasswordPage = lazy(() => import("@pages/auth/ForgotPasswordPage"))
const ResetPasswordPage = lazy(() => import("@pages/auth/ResetPasswordPage"))
const DashboardHome = lazy(() => import("@pages/dashboard/DashboardHome"))
const DashboardLayout = lazy(() => import("@components/templates/DashboardLayout"))
const UsersListPage = lazy(() => import("@pages/user/UsersListPage"))
const UserFormPage = lazy(() => import("@pages/user/UserFormPage"))
const AppointmentsPage = lazy(() => import("@pages/appointment/AppointmentsListPage"))
const SchedulesPage = lazy(() => import("@pages/schedule/SchedulesListPage"))
const DoctorsListPage = lazy(() => import("@pages/doctor/DoctorsListPage"))
const DoctorFormPage = lazy(() => import("@pages/doctor/DoctorFormPage"))
const PatientsListPage = lazy(() => import("@pages/patient/PacientsListPage"))
const PatientFormPage = lazy(() => import("@pages/patient/PatientFormPage"))
const ProfilePage = lazy(() => import("@components/pages/ProfilePage"))

import useAuth from "@hooks/auth/useAuth"
import { ProtectedRoute } from "@components/auth/ProtectedRoute"
import { SessionExpiryModal } from "@components/auth/SessionExpiryModal"
import { isValidToken } from "@utils/auth"

// Loading fallback component for Suspense
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" role="status" aria-label="Cargando pagina"></div>
      <p className="text-muted-foreground text-sm">Cargando...</p>
    </div>
  </div>
)

export const AppContent: React.FC = () => {
  const { user, handleLogin, handleLogout, showExpiryModal, timeRemaining, extendSession, isExtending } = useAuth()

  // Verificar si hay token válido (independiente del estado del usuario)
  const hasValidToken = isValidToken()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={hasValidToken && user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={hasValidToken && user ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route
          path="/forgot-password"
          element={hasValidToken && user ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
            </ProtectedRoute>
          }
        >
          {user && (
            <>
              {/* Dashboard Home - Acceso para todos */}
              <Route path="dashboard" element={<DashboardHome />} />
              
              {/* Acceso para todos los usuarios autenticados */}
              <Route path="appointments" element={<AppointmentsPage user={user} />} />

              {/* Rutas por rol */}
              {(() => {
                const routesByRole: Record<number, JSX.Element[]> = {
                  1: [
                    <Route key="users" path="users" element={<UsersListPage user={user} />} />,
                    <Route key="user" path="user" element={<UserFormPage user={user} />} />,
                    <Route key="schedules" path="schedules" element={<SchedulesPage user={user} />} />,
                    <Route key="doctors" path="doctors" element={<DoctorsListPage user={user} />} />,
                    <Route key="doctor" path="doctor" element={<DoctorFormPage user={user} />} />,
                    <Route key="patients" path="patients" element={<PatientsListPage user={user} />} />,
                    <Route key="patient" path="patient" element={<PatientFormPage user={user} />} />,
                    <Route key="profile" path="profile" element={<ProfilePage />} />,
                  ],
                  2: [
                    <Route key="doctors" path="doctors" element={<DoctorsListPage user={user} />} />,
                    <Route key="profile" path="profile" element={<ProfilePage />} />,
                  ],
                  3: [
                    <Route key="patients" path="patients" element={<PatientsListPage user={user} />} />,
                    <Route key="patient" path="patient" element={<PatientFormPage user={user} />} />,
                    <Route key="schedules" path="schedules" element={<SchedulesPage user={user} />} />,
                    <Route key="profile" path="profile" element={<ProfilePage />} />,
                  ],
                }
                return routesByRole[user.role_id] || null
              })()}
            </>
          )}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Modal de expiración de sesión */}
      {user && (
        <SessionExpiryModal
          isOpen={showExpiryModal}
          timeRemaining={timeRemaining}
          onExtendSession={extendSession}
          onLogout={handleLogout}
          isExtending={isExtending}
        />
      )}
    </Suspense>
  )
}
