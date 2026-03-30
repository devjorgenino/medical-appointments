import { toast as sonnerToast } from "sonner"

/**
 * Wrapper centralizado para notificaciones toast usando Sonner
 * Proporciona una API consistente en toda la aplicación
 */
export const toast = {
  success: (message: string) => {
    return sonnerToast.success(message)
  },
  error: (message: string) => {
    return sonnerToast.error(message)
  },
  info: (message: string) => {
    return sonnerToast.info(message)
  },
  warning: (message: string) => {
    return sonnerToast.warning(message)
  },
  // Toast genérico (usado en algunos lugares del código)
  default: (message: string) => {
    return sonnerToast(message)
  },
}

// Export default para compatibilidad con imports anteriores
export default toast
