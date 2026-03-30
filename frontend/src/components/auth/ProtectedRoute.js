import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { isValidToken } from "@utils/auth";
/**
 * Componente que protege rutas verificando la autenticación del usuario
 * Redirige al login si no hay token válido o si el token está expirado
 */
export const ProtectedRoute = ({ children }) => {
    // Verificar si hay un token válido
    if (!isValidToken()) {
        // Si no hay token válido, redirigir al login
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
