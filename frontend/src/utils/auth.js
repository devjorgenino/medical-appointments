import { jwtDecode } from "jwt-decode";
/**
 * Valida si un token JWT está expirado
 * @param token - Token JWT a validar
 * @returns true si el token está expirado o inválido, false si es válido
 */
export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        // Verificar si el token tiene exp (expiración)
        if (!decoded.exp) {
            return true; // Si no tiene exp, considerarlo expirado
        }
        // Convertir exp (timestamp en segundos) a milisegundos y comparar con la fecha actual
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        // Si la expiración es menor a la hora actual, el token está expirado
        return expirationTime < currentTime;
    }
    catch (error) {
        console.error("Error al validar token:", error);
        return true; // Si hay error al decodificar, considerar expirado
    }
};
/**
 * Valida si existe un token y si no está expirado
 * @returns true si el token es válido, false si no existe o está expirado
 */
export const isValidToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }
    return !isTokenExpired(token);
};
/**
 * Limpia todos los datos de sesión del localStorage
 */
export const clearSession = () => {
    localStorage.removeItem("token");
    // Limpiar cualquier otro dato de sesión si existe
    // localStorage.removeItem("user");
    // localStorage.removeItem("refresh_token");
};
/**
 * Obtiene el token del localStorage y valida si está expirado
 * @returns El token si es válido, null si no existe o está expirado
 */
export const getValidToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }
    if (isTokenExpired(token)) {
        clearSession();
        return null;
    }
    return token;
};
/**
 * Obtiene el tiempo restante hasta que expire el token (en milisegundos)
 * @param token - Token JWT
 * @returns Tiempo restante en milisegundos, o 0 si está expirado o no tiene exp
 */
export const getTokenTimeRemaining = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) {
            return 0;
        }
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeRemaining = expirationTime - currentTime;
        return timeRemaining > 0 ? timeRemaining : 0;
    }
    catch (error) {
        console.error("Error al obtener tiempo restante del token:", error);
        return 0;
    }
};
/**
 * Verifica si el token está cerca de expirar (dentro de los minutos especificados)
 * @param token - Token JWT
 * @param minutesBeforeExpiry - Minutos antes de la expiración para considerar "cerca"
 * @returns true si está cerca de expirar, false si no
 */
export const isTokenNearExpiry = (token, minutesBeforeExpiry = 5) => {
    const timeRemaining = getTokenTimeRemaining(token);
    const threshold = minutesBeforeExpiry * 60 * 1000; // Convertir minutos a milisegundos
    return timeRemaining > 0 && timeRemaining <= threshold;
};
/**
 * Obtiene el tiempo restante hasta que expire el token en formato legible
 * @param token - Token JWT
 * @returns String con el tiempo restante (ej: "1 minuto 30 segundos", "30 segundos")
 */
export const getTokenTimeRemainingFormatted = (token) => {
    const timeRemaining = getTokenTimeRemaining(token);
    if (timeRemaining <= 0) {
        return "Expirado";
    }
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    // Si hay menos de 1 minuto, mostrar solo segundos
    if (minutes === 0) {
        return `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
    }
    // Si hay 1 minuto o más, mostrar minutos y segundos si hay segundos
    if (seconds > 0) {
        return `${minutes} ${minutes === 1 ? "minuto" : "minutos"} ${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
    }
    // Solo minutos sin segundos
    return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
};
