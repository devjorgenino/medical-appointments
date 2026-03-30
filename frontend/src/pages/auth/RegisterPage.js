import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, UserPlus } from "lucide-react";
import { isAxiosError } from "axios";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { Button } from "@components/ui/button";
import { filterPhoneNumbers } from "@utils/validation";
import { useFormValidation, createRegisterFormValidationConfig, } from "@hooks/useFormValidation";
import { register as registerUser } from "@services/auth";
import { toast } from "@lib/toast";
import ThemeToggle from "@components/atoms/ThemeToggle";
const INITIAL_FORM_DATA = {
    nombre: "",
    apellido: "",
    numero_telefono: "",
    direccion: "",
    sexo: "F",
    email: "",
    password: "",
    role_id: 2,
};
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const validationConfig = useMemo(() => createRegisterFormValidationConfig(), []);
    const { errors, touched, validateField, handleBlur, validateAll, resetValidation, } = useFormValidation(validationConfig);
    const handleFieldChange = (fieldName, value) => {
        const updatedForm = {
            ...formData,
            [fieldName]: value,
        };
        setFormData(updatedForm);
        if (touched[fieldName]) {
            validateField(fieldName, updatedForm[fieldName], updatedForm);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll(formData)) {
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            await registerUser(formData);
            toast.success("Registro exitoso. Ahora puedes iniciar sesion.");
            resetValidation();
            setFormData({ ...INITIAL_FORM_DATA });
            setShowPassword(false);
            navigate("/login");
        }
        catch (err) {
            let errorMessage = "Error al registrarse. Intenta de nuevo.";
            if (isAxiosError(err)) {
                const detail = err.response?.data?.detail;
                if (typeof detail === "string") {
                    errorMessage = detail;
                }
                else if (Array.isArray(detail)) {
                    errorMessage = detail.join(", ");
                }
                console.error("Error de registro:", detail || err.message);
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
                console.error("Error de registro:", err.message);
            }
            else {
                console.error("Error de registro:", err);
            }
            setError(errorMessage);
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300", children: [_jsx("div", { className: "fixed top-4 right-4 z-50", children: _jsx(ThemeToggle, {}) }), _jsxs("div", { className: "w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/20 border border-transparent dark:border-gray-700/50 transition-colors duration-300", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg", children: _jsx(Activity, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "MedicalApp" }), _jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Registrarse" })] }), error && _jsx("p", { className: "mb-4 text-center text-red-500 dark:text-red-400", children: error }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(FormField, { id: "nombre", label: "Nombre", value: formData.nombre, onChange: (e) => {
                                            handleFieldChange("nombre", e.target.value);
                                        }, onBlur: () => {
                                            handleBlur("nombre");
                                            validateField("nombre", formData.nombre, formData);
                                        }, placeholder: "Ingrese su nombre", required: true, error: errors.nombre }), _jsx(FormField, { id: "apellido", label: "Apellido", value: formData.apellido, onChange: (e) => {
                                            handleFieldChange("apellido", e.target.value);
                                        }, onBlur: () => {
                                            handleBlur("apellido");
                                            validateField("apellido", formData.apellido, formData);
                                        }, placeholder: "Ingrese su apellido", required: true, error: errors.apellido }), _jsx(FormField, { id: "numero_telefono", label: "Numero de Telefono", type: "tel", value: formData.numero_telefono, onChange: (e) => {
                                            const value = filterPhoneNumbers(e.target.value);
                                            handleFieldChange("numero_telefono", value);
                                        }, onBlur: () => {
                                            handleBlur("numero_telefono");
                                            validateField("numero_telefono", formData.numero_telefono, formData);
                                        }, placeholder: "Ej: 1234567890", required: true, error: errors.numero_telefono }), _jsx(FormField, { id: "direccion", label: "Direccion", value: formData.direccion, onChange: (e) => {
                                            handleFieldChange("direccion", e.target.value);
                                        }, onBlur: () => {
                                            handleBlur("direccion");
                                            validateField("direccion", formData.direccion, formData);
                                        }, placeholder: "Ej: Calle Principal 123, Ciudad", required: true, error: errors.direccion }), _jsx("div", { className: "md:col-span-2", children: _jsx(FormField, { type: "radio", id: "sexo", label: "Sexo", value: formData.sexo, onChange: (e) => {
                                                handleFieldChange("sexo", e.target.value);
                                            }, onBlur: () => {
                                                handleBlur("sexo");
                                                validateField("sexo", formData.sexo, formData);
                                            }, required: true, error: errors.sexo, options: [
                                                { value: "F", label: "Femenino" },
                                                { value: "M", label: "Masculino" },
                                            ] }) }), _jsx(FormField, { id: "email", label: "Correo Electronico", type: "email", value: formData.email, onChange: (e) => {
                                            handleFieldChange("email", e.target.value);
                                        }, onBlur: () => {
                                            handleBlur("email");
                                            validateField("email", formData.email, formData);
                                        }, placeholder: "ejemplo@correo.com", required: true, error: errors.email }), _jsxs("div", { className: "relative mb-4", children: [_jsxs("label", { htmlFor: "password", className: `block mb-1 text-sm font-medium ${errors.password ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`, children: ["Contrasena", _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", id: "password", value: formData.password, onChange: (e) => {
                                                            handleFieldChange("password", e.target.value);
                                                        }, onBlur: () => {
                                                            handleBlur("password");
                                                            validateField("password", formData.password, formData);
                                                        }, placeholder: "Minimo 8 caracteres", required: true, className: `w-full px-3 py-2 pr-12 border rounded-md shadow-sm focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${errors.password
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"}`, autoComplete: "current-password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors", children: !showPassword ? (_jsx(EyeOff, { className: "w-5 h-5" })) : (_jsx(Eye, { className: "w-5 h-5" })) })] }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.password }))] })] }), _jsx("div", { className: "mt-6 space-y-3", children: _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-md", children: [_jsx(UserPlus, { className: "w-4 h-4" }), isLoading ? "Registrando..." : "Registrar"] }) }), _jsx("div", { className: "mt-6 space-y-3", children: _jsxs("div", { className: "flex items-center justify-center text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { className: "ml-2 text-sm", children: "Ya tienes una cuenta?" }), _jsx("button", { type: "button", className: "p-0 ml-1 text-sm text-blue-600 dark:text-blue-400 bg-transparent border-none cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors", onClick: () => navigate("/login"), children: "Iniciar Sesion" })] }) })] }), _jsxs("footer", { className: "mt-6 text-sm text-center text-gray-500 dark:text-gray-500", children: [_jsx("p", { children: "Soporte: support@medicalapp.com" }), _jsx("p", { children: "\u00A9 2025 Medical App, Inc. Todos los derechos reservados." })] })] })] }));
};
export default RegisterPage;
