import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, LogIn } from "lucide-react";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { Button } from "@components/ui/button";
import ThemeToggle from "@components/atoms/ThemeToggle";
const LoginPage = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onLogin(credentials);
            navigate("/dashboard");
        }
        catch (error) {
            console.error(error);
            setError(`Credenciales invalidas. Por favor, intenta de nuevo.`);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300", children: [_jsx("div", { className: "fixed top-4 right-4 z-50", children: _jsx(ThemeToggle, {}) }), _jsxs("div", { className: "w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl dark:shadow-black/20 rounded-2xl border border-transparent dark:border-gray-700/50 transition-colors duration-300", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg", children: _jsx(Activity, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "MedicalApp" }), _jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Inicia sesion" })] }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { id: "email", label: "Correo Electronico", type: "email", value: credentials.email, onChange: (e) => setCredentials({
                                            ...credentials,
                                            email: e.target.value,
                                        }), placeholder: "ejemplo@correo.com", required: true }), _jsxs("div", { className: "relative", children: [_jsx(FormField, { id: "password", label: "Contrasena", type: showPassword ? "text" : "password", value: credentials.password, onChange: (e) => setCredentials({ ...credentials, password: e.target.value }), placeholder: "Ingrese su contrasena", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute text-gray-400 dark:text-gray-500 right-3 top-9 hover:text-gray-600 dark:hover:text-gray-300 transition-colors", children: !showPassword ? (_jsx(EyeOff, { className: "w-5 h-5" })) : (_jsx(Eye, { className: "w-5 h-5" })) })] })] }), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors" }), _jsx("span", { className: "ml-2 text-sm text-gray-600 dark:text-gray-400", children: "Recordarme" })] }), _jsx("button", { type: "button", className: "p-0 text-sm text-blue-600 dark:text-blue-400 bg-transparent border-none cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors", onClick: () => navigate("/forgot-password"), children: "Olvidaste tu contrasena?" })] }), error && (_jsx("div", { className: "p-4 mt-4 border border-red-200 dark:border-red-800/50 rounded-lg bg-red-50 dark:bg-red-900/20", children: _jsx("p", { className: "text-sm text-center text-red-600 dark:text-red-400", children: error }) })), _jsx("div", { className: "mt-6 space-y-3", children: _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-md", children: [_jsx(LogIn, { className: "w-4 h-4" }), isLoading ? "Iniciando sesion..." : "Iniciar Sesion"] }) }), _jsx("div", { className: "mt-6 space-y-3", children: _jsxs("div", { className: "flex items-center justify-center text-sm text-gray-600 dark:text-gray-400", children: [_jsx("p", { className: "ml-2 text-sm", children: "No tienes una cuenta?" }), _jsx("button", { type: "button", className: "p-0 ml-1 text-sm text-blue-600 dark:text-blue-400 bg-transparent border-none cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors", onClick: () => navigate("/register"), children: "Registrate" })] }) })] }), _jsxs("footer", { className: "mt-8 space-y-1 text-sm text-center text-gray-500 dark:text-gray-500", children: [_jsx("p", { children: "Soporte: support@medicalapp.com" }), _jsx("p", { children: "\u00A9 2025 MedicalApp. Todos los derechos reservados." })] })] })] }));
};
export default LoginPage;
