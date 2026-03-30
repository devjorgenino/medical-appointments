import { toast } from "@lib/toast"

/**
 * Extrae el mensaje de error de una respuesta de API
 */
export const extractErrorMessage = (error: any, defaultMessage = "Ha ocurrido un error"): string => {
  if (error?.response?.data?.detail) {
    // If detail is a string, return it directly (handles overlap errors like "El horario 09:00:00-10:00:00 se superpone...")
    if (typeof error.response.data.detail === "string") {
      return error.response.data.detail
    }
    // If detail is an object or array, stringify it
    if (typeof error.response.data.detail === "object") {
      return JSON.stringify(error.response.data.detail)
    }
  }
  if (error?.message) {
    return error.message
  }
  return defaultMessage
}

/**
 * Maneja errores de autenticación
 */
export const handleAuthError = (error: any): void => {
  if (error?.response?.status === 401) {
    toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
    window.location.href = "/login"
  } else {
    const message = extractErrorMessage(error, "Error de autenticación")
    toast.error(message)
  }
}

/**
 * Maneja errores de validación del servidor
 */
export const handleValidationError = (error: any): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (error?.response?.data?.detail) {
    // Si el detalle es un objeto con campos específicos
    if (typeof error.response.data.detail === "object") {
      Object.entries(error.response.data.detail).forEach(([field, message]) => {
        errors[field] = Array.isArray(message) ? message[0] : String(message)
      })
    } else {
      errors.general = error.response.data.detail
    }
  }

  return errors
}

/**
 * Maneja errores generales con logging (NO muestra toast - se maneja en cada hook)
 */
export const handleError = (error: any, context: string): void => {
  console.error(`Error en ${context}:`, error)
}

/**
 * Verifica si un error es de tipo de red
 */
export const isNetworkError = (error: any): boolean => {
  return error?.message === "Network Error" || !error?.response
}

/**
 * Verifica si un error es por permisos insuficientes
 */
export const isForbiddenError = (error: any): boolean => {
  return error?.response?.status === 403
}
