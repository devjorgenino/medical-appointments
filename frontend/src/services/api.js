import axios from "axios";
import { clearSession } from "@utils/auth";
const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
    validateStatus: (status) => status >= 200 && status < 300,
});
// Interceptor para añadir el token de autenticación a todas las solicitudes
api.interceptors.request.use((config) => {
    // Rutas públicas que no requieren token
    const publicRoutes = [
        "/auth/login",
        "/register",
        "/forgot-password",
        "/auth/password-reset",
    ];
    const isPublicRoute = publicRoutes.some((route) => config.url?.includes(route));
    // Solo añadir token si no es una ruta pública
    // El endpoint de refresh también necesita el token actual
    if (!isPublicRoute) {
        const token = localStorage.getItem("token");
        // Añadir el token si existe (aunque pueda estar expirado)
        // El backend nos dirá si está expirado con un 401
        // Para el endpoint de refresh, necesitamos el token aunque esté cerca de expirar
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Interceptor para manejar respuestas y errores de autenticación
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Si recibimos un error 401 (Unauthorized), el token es inválido o expirado
    if (error.response?.status === 401) {
        // No manejar 401 para el endpoint de refresh, dejar que el hook lo maneje
        const isRefreshRequest = error.config?.url?.includes("/auth/refresh");
        if (!isRefreshRequest) {
            // Limpiar la sesión
            clearSession();
            // Redirigir al login si no estamos ya ahí y no es una ruta pública
            if (typeof window !== "undefined") {
                const currentPath = window.location.pathname;
                const isPublicRoute = currentPath.includes("/login") ||
                    currentPath.includes("/register") ||
                    currentPath.includes("/forgot-password");
                if (!isPublicRoute) {
                    // Usar window.location.href para forzar una recarga completa y limpiar el estado
                    window.location.href = "/login";
                }
            }
        }
    }
    return Promise.reject(error);
});
// Funciones para autenticación (mantén aquí si no tienen archivo propio)
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/users/register", data);
export default api;
