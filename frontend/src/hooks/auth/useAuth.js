import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login, refreshToken } from "@services/auth";
import { jwtDecode } from "jwt-decode";
import { isValidToken, clearSession, isTokenExpired, isTokenNearExpiry, getTokenTimeRemainingFormatted, } from "@utils/auth";
import { toast } from "@lib/toast";
// Función auxiliar para mapear JWT a User (fuera del componente para evitar recreaciones)
const mapJwtToUser = (decoded) => {
    return {
        id: decoded.id,
        email: decoded.sub,
        role_id: decoded.role_id,
        nombre: decoded.nombre || "",
        apellido: decoded.apellido || "",
        numero_telefono: decoded.numero_telefono || undefined,
        direccion: decoded.direccion || undefined,
        sexo: decoded.sexo || undefined,
    };
};
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState("");
    const [isExtending, setIsExtending] = useState(false);
    const navigate = useNavigate();
    // Minutos antes de la expiración para mostrar el modal
    // Con token de 1 minuto, mostrar el aviso 30 segundos antes (0.5 minutos)
    const EXPIRY_WARNING_MINUTES = 0.5;
    // Función para cargar y validar el usuario desde el token
    const loadUserFromToken = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        // Validar si el token está expirado
        if (isTokenExpired(token)) {
            console.warn("Token expirado, limpiando sesión");
            clearSession();
            setUser(null);
            navigate("/login");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const user = mapJwtToUser(decoded);
            setUser(user);
        }
        catch (error) {
            console.error("Error al decodificar el token:", error);
            clearSession();
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);
    // Función para verificar si el token está cerca de expirar
    const checkTokenExpiry = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowExpiryModal(false);
            return;
        }
        // Si el token ya expiró, limpiar sesión y redirigir
        if (isTokenExpired(token)) {
            console.warn("Token expirado durante la sesión");
            clearSession();
            setUser(null);
            setShowExpiryModal(false);
            navigate("/login");
            return;
        }
        // Verificar si está cerca de expirar
        if (isTokenNearExpiry(token, EXPIRY_WARNING_MINUTES)) {
            const remaining = getTokenTimeRemainingFormatted(token);
            setTimeRemaining(remaining);
            setShowExpiryModal(true);
        }
        else {
            setShowExpiryModal(false);
        }
    }, [navigate, EXPIRY_WARNING_MINUTES]);
    // Función para extender la sesión
    const extendSession = useCallback(async () => {
        setIsExtending(true);
        try {
            const response = await refreshToken();
            const { access_token } = response.data;
            localStorage.setItem("token", access_token);
            const decoded = jwtDecode(access_token);
            const updatedUser = mapJwtToUser(decoded);
            setUser(updatedUser);
            setShowExpiryModal(false);
            toast.success("Sesión extendida exitosamente");
            console.log("Sesión extendida exitosamente");
        }
        catch (error) {
            console.error("Error al extender la sesión:", error);
            toast.error("No se pudo extender la sesión. Cerrando sesión...");
            clearSession();
            setUser(null);
            setShowExpiryModal(false);
            navigate("/login");
        }
        finally {
            setIsExtending(false);
        }
    }, [navigate]);
    useEffect(() => {
        loadUserFromToken();
        // Verificar expiración inmediatamente
        checkTokenExpiry();
        // Validar el token periódicamente (cada 5 segundos para detectar expiración próxima)
        // Con token de 1 minuto, verificamos más frecuentemente para mayor precisión
        const interval = setInterval(() => {
            checkTokenExpiry();
        }, 5000); // Verificar cada 5 segundos
        return () => clearInterval(interval);
    }, [loadUserFromToken, checkTokenExpiry]);
    // Efecto para actualizar el tiempo restante cuando el modal está abierto
    useEffect(() => {
        if (!showExpiryModal) {
            return;
        }
        // Actualizar el tiempo restante cada segundo cuando el modal está abierto
        const updateInterval = setInterval(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                clearSession();
                setUser(null);
                setShowExpiryModal(false);
                navigate("/login");
                return;
            }
            // Si el token expiró mientras el modal está abierto, cerrar sesión
            if (isTokenExpired(token)) {
                clearSession();
                setUser(null);
                setShowExpiryModal(false);
                navigate("/login");
                return;
            }
            // Actualizar el tiempo restante
            const remaining = getTokenTimeRemainingFormatted(token);
            setTimeRemaining(remaining);
        }, 1000); // Actualizar cada segundo
        return () => clearInterval(updateInterval);
    }, [showExpiryModal, navigate]);
    const handleLogin = async (formData) => {
        try {
            const response = await login(formData);
            const { access_token } = response.data;
            localStorage.setItem("token", access_token);
            const decoded = jwtDecode(access_token);
            const user = mapJwtToUser(decoded);
            setUser(user);
            navigate("/dashboard");
        }
        catch (error) {
            const errorMessage = error && typeof error === "object" && "response" in error
                ? error.response?.data?.detail
                : error instanceof Error
                    ? error.message
                    : "Error desconocido";
            console.error("Error al iniciar sesión:", errorMessage);
            throw error;
        }
    };
    const handleLogout = () => {
        clearSession();
        setUser(null);
        setShowExpiryModal(false);
        navigate("/login");
    };
    return {
        user,
        handleLogin,
        handleLogout,
        isAuthenticated: isValidToken() && user !== null,
        showExpiryModal,
        timeRemaining,
        extendSession,
        isExtending,
    };
};
export default useAuth;
