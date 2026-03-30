import React from "react";
import { Navigate } from "react-router-dom";
import { isValidToken } from "@utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas verificando la autenticación del usuario
 * Redirige al login si no hay token válido o si el token está expirado
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Verificar si hay un token válido
  if (!isValidToken()) {
    // Si no hay token válido, redirigir al login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

