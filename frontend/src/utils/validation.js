/**
 * Valida que un email tenga formato válido
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const isValidPassword = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(password),
    };
    const passedRequirements = Object.values(requirements).filter(Boolean).length;
    // Determine password strength
    let strength = 'weak';
    if (passedRequirements >= 4 && password.length >= 10) {
        strength = 'strong';
    }
    else if (passedRequirements >= 3 && password.length >= 8) {
        strength = 'medium';
    }
    // Check minimum requirements for validity
    if (!requirements.minLength) {
        return {
            valid: false,
            message: "La contrasena debe tener al menos 8 caracteres",
            strength,
            requirements
        };
    }
    // Require at least one uppercase, one lowercase, and one number for medium security
    if (!requirements.hasUppercase) {
        return {
            valid: false,
            message: "La contrasena debe contener al menos una letra mayuscula",
            strength,
            requirements
        };
    }
    if (!requirements.hasLowercase) {
        return {
            valid: false,
            message: "La contrasena debe contener al menos una letra minuscula",
            strength,
            requirements
        };
    }
    if (!requirements.hasNumber) {
        return {
            valid: false,
            message: "La contrasena debe contener al menos un numero",
            strength,
            requirements
        };
    }
    return { valid: true, strength, requirements };
};
/**
 * Returns a human-readable message for password strength
 */
export const getPasswordStrengthLabel = (strength) => {
    const labels = {
        weak: 'Debil',
        medium: 'Media',
        strong: 'Fuerte'
    };
    return labels[strength];
};
/**
 * Returns CSS classes for password strength indicator
 */
export const getPasswordStrengthColor = (strength) => {
    const colors = {
        weak: 'bg-red-500',
        medium: 'bg-yellow-500',
        strong: 'bg-green-500'
    };
    return colors[strength];
};
/**
 * Valida que un rango de tiempo sea válido (hora fin > hora inicio)
 */
export const isValidTimeRange = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return end > start;
};
/**
 * Valida que un time slot no se superponga con otros existentes
 */
export const hasTimeSlotOverlap = (newSlot, existingSlots, excludeId) => {
    const newStart = new Date(`2000-01-01T${newSlot.start_time}:00`);
    const newEnd = new Date(`2000-01-01T${newSlot.end_time}:00`);
    return existingSlots.some((slot) => {
        // Excluir el slot que se está editando
        if (excludeId && slot.id === excludeId) {
            return false;
        }
        const slotStart = new Date(`2000-01-01T${slot.start_time}:00`);
        const slotEnd = new Date(`2000-01-01T${slot.end_time}:00`);
        // Verificar superposición: el nuevo slot empieza antes de que termine el existente
        // Y el nuevo slot termina después de que empiece el existente
        return newStart < slotEnd && newEnd > slotStart;
    });
};
/**
 * Filtra solo números de un string, removiendo todos los caracteres que no sean dígitos
 */
export const filterPhoneNumbers = (value) => {
    return value.replace(/\D/g, "");
};
/**
 * Valida que un número de teléfono tenga formato válido
 */
export const isValidPhoneNumber = (phone) => {
    // Acepta formatos: +51999999999, 999999999, (01)999999999
    const phoneRegex = /^(\+?51)?[0-9]{9,11}$/;
    return phoneRegex.test(phone.replace(/[\s()-]/g, ""));
};
/**
 * Valida que una fecha no sea del pasado
 */
export const isNotPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
};
/**
 * Valida campos requeridos en un formulario
 */
export const validateRequiredFields = (fields) => {
    const missingFields = Object.entries(fields)
        .filter(([_, value]) => !value || value === "")
        .map(([key, _]) => key);
    if (missingFields.length > 0) {
        return { valid: false, missingFields };
    }
    return { valid: true };
};
/**
 * Formatea mensajes de error de validación
 */
export const formatValidationError = (field, error) => {
    const fieldNames = {
        email: "Email",
        password: "Contraseña",
        nombre: "Nombre",
        apellido: "Apellido",
        numero_telefono: "Número de teléfono",
        direccion: "Dirección",
        fecha_nacimiento: "Fecha de nacimiento",
        especialidad: "Especialidad",
    };
    const fieldName = fieldNames[field] || field;
    return `${fieldName}: ${error}`;
};
/**
 * Valida un campo de email y retorna mensaje de error si existe
 */
export const validateEmail = (email, required = true) => {
    if (!email || email.trim() === "") {
        return required ? "El correo electrónico es obligatorio" : "";
    }
    if (!isValidEmail(email)) {
        return "Ingrese un correo electrónico válido";
    }
    return "";
};
/**
 * Valida un campo de contraseña y retorna mensaje de error si existe
 */
export const validatePassword = (password, required = true) => {
    if (!password || password.trim() === "") {
        return required ? "La contraseña es obligatoria" : "";
    }
    const result = isValidPassword(password);
    return result.message || "";
};
/**
 * Valida un campo de nombre/apellido y retorna mensaje de error si existe
 */
export const validateName = (name, fieldName = "nombre", required = true) => {
    if (!name || name.trim() === "") {
        return required ? `El ${fieldName} es obligatorio` : "";
    }
    if (name.trim().length < 2) {
        return `El ${fieldName} debe tener al menos 2 caracteres`;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
        return `El ${fieldName} solo puede contener letras`;
    }
    return "";
};
/**
 * Valida un campo de teléfono y retorna mensaje de error si existe
 */
export const validatePhone = (phone, required = false) => {
    if (!phone || phone.trim() === "") {
        return required ? "El número de teléfono es obligatorio" : "";
    }
    // Solo validamos si hay valor y tiene al menos 9 dígitos
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
        return "El número de teléfono debe tener al menos 9 dígitos";
    }
    if (phoneDigits.length > 15) {
        return "El número de teléfono no puede tener más de 15 dígitos";
    }
    return "";
};
/**
 * Valida un campo de dirección y retorna mensaje de error si existe
 */
export const validateAddress = (address, required = false) => {
    if (!address || address.trim() === "") {
        return required ? "La dirección es obligatoria" : "";
    }
    if (address.trim().length < 5) {
        return "La dirección debe tener al menos 5 caracteres";
    }
    return "";
};
/**
 * Valida un campo de especialidad y retorna mensaje de error si existe
 */
export const validateSpecialty = (specialty, required = true) => {
    if (!specialty || specialty.trim() === "") {
        return required ? "La especialidad es obligatoria" : "";
    }
    if (specialty.trim().length < 2) {
        return "La especialidad debe tener al menos 2 caracteres";
    }
    return "";
};
/**
 * Valida un campo de fecha de nacimiento y retorna mensaje de error si existe
 */
export const validateBirthDate = (date, required = false) => {
    if (!date || date.trim() === "") {
        return required ? "La fecha de nacimiento es obligatoria" : "";
    }
    const birthDate = new Date(date);
    const today = new Date();
    if (birthDate > today) {
        return "La fecha de nacimiento no puede ser futura";
    }
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age > 120) {
        return "La fecha de nacimiento no es válida";
    }
    return "";
};
/**
 * Valida un campo de sexo y retorna mensaje de error si existe
 */
export const validateSex = (sex, required = true) => {
    if (!sex || sex.trim() === "") {
        return required ? "El sexo es obligatorio" : "";
    }
    if (sex !== "M" && sex !== "F") {
        return "Seleccione un sexo válido";
    }
    return "";
};
/**
 * Valida un campo de rol y retorna mensaje de error si existe
 */
export const validateRole = (roleId, required = true) => {
    if (!roleId) {
        return required ? "El rol es obligatorio" : "";
    }
    const role = typeof roleId === "string" ? parseInt(roleId) : roleId;
    if (isNaN(role) || (role !== 1 && role !== 2 && role !== 3)) {
        return "Seleccione un rol válido";
    }
    return "";
};
