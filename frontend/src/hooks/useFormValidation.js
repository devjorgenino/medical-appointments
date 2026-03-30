import { useState, useCallback } from "react";
import { validateEmail, validatePassword, validateName, validatePhone, validateAddress, validateSpecialty, validateBirthDate, validateSex, validateRole, } from "@utils/validation";
/**
 * Hook personalizado para manejar validaciones de formularios de forma centralizada
 * @param config Configuración de validaciones por campo
 * @param initialData Datos iniciales del formulario (opcional)
 */
export function useFormValidation(config) {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    /**
     * Valida un campo individual
     */
    const validateField = useCallback((fieldName, value, data) => {
        const rule = config[fieldName];
        if (!rule)
            return;
        const error = rule.validator(value, data);
        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    }, [config]);
    /**
     * Maneja el evento blur del campo
     */
    const handleBlur = useCallback((fieldName) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        // La validación se hará cuando se llame validateField después
    }, []);
    /**
     * Valida todos los campos del formulario
     */
    const validateAll = useCallback((data) => {
        const newErrors = {};
        // Marcar todos los campos como tocados
        const allFields = Object.keys(config);
        const newTouched = {};
        allFields.forEach((field) => {
            newTouched[field] = true;
        });
        setTouched(newTouched);
        // Validar cada campo
        Object.entries(config).forEach(([fieldName, rule]) => {
            const value = data[fieldName];
            const error = rule.validator(value, data);
            if (error) {
                newErrors[fieldName] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [config]);
    /**
     * Resetea los estados de validación
     */
    const resetValidation = useCallback(() => {
        setErrors({});
        setTouched({});
    }, []);
    /**
     * Establece manualmente un error en un campo
     */
    const setFieldError = useCallback((fieldName, error) => {
        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    }, []);
    return {
        errors,
        touched,
        validateField,
        handleBlur,
        validateAll,
        resetValidation,
        setFieldError,
    };
}
/**
 * Configuraciones predefinidas de validación para diferentes tipos de formularios
 */
// Configuración para formulario de usuario completo (FormLayout)
export function createUserFormValidationConfig(isCreation = true) {
    return {
        email: {
            validator: (value) => validateEmail(value || "", true),
            required: true,
        },
        password: {
            validator: (value, data) => {
                // Solo validar si es creación o si se está cambiando la contraseña
                if (isCreation || value) {
                    return validatePassword(value || "", isCreation);
                }
                return "";
            },
            required: isCreation,
        },
        nombre: {
            validator: (value) => validateName(value || "", "nombre", true),
            required: true,
        },
        apellido: {
            validator: (value) => validateName(value || "", "apellido", true),
            required: true,
        },
        numero_telefono: {
            validator: (value) => validatePhone(value || "", false),
            required: false,
        },
        direccion: {
            validator: (value) => validateAddress(value || "", false),
            required: false,
        },
        sexo: {
            validator: (value) => validateSex(value || "", true),
            required: true,
        },
        role_id: {
            validator: (value) => validateRole(value, true),
            required: true,
        },
        especialidad: {
            validator: (value, data) => {
                // Solo validar si es médico (role_id === 3)
                if (data?.role_id === 3) {
                    return validateSpecialty(value || "", isCreation || !!value);
                }
                return "";
            },
            required: false,
        },
        fecha_nacimiento: {
            validator: (value, data) => {
                // Solo validar si es paciente (role_id === 2) y tiene valor
                if (data?.role_id === 2 && value) {
                    return validateBirthDate(value || "", false);
                }
                return "";
            },
            required: false,
        },
    };
}
// Configuración para formulario de registro
export function createRegisterFormValidationConfig() {
    return {
        email: {
            validator: (value) => validateEmail(value || "", true),
            required: true,
        },
        password: {
            validator: (value) => validatePassword(value || "", true),
            required: true,
        },
        nombre: {
            validator: (value) => validateName(value || "", "nombre", true),
            required: true,
        },
        apellido: {
            validator: (value) => validateName(value || "", "apellido", true),
            required: true,
        },
        numero_telefono: {
            validator: (value) => validatePhone(value || "", true),
            required: true,
        },
        direccion: {
            validator: (value) => validateAddress(value || "", true),
            required: true,
        },
        sexo: {
            validator: (value) => validateSex(value || "", true),
            required: true,
        },
    };
}
// Configuración para formulario de perfil
export function createProfileFormValidationConfig() {
    return {
        email: {
            validator: (value) => validateEmail(value || "", true),
            required: true,
        },
        nombre: {
            validator: (value) => validateName(value || "", "nombre", true),
            required: true,
        },
        apellido: {
            validator: (value) => validateName(value || "", "apellido", true),
            required: true,
        },
        numero_telefono: {
            validator: (value) => validatePhone(value || "", false),
            required: false,
        },
        direccion: {
            validator: (value) => validateAddress(value || "", false),
            required: false,
        },
        sexo: {
            validator: (value) => validateSex(value || "", true),
            required: true,
        },
    };
}
