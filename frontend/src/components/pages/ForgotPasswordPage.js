import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import Button from "@components/atoms/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Activity } from "lucide-react";
const ForgotPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post("http://localhost:8000/forgot-password", {
                email: formData.email,
            });
            navigate("/login");
        }
        catch (error) {
            setError("Error al enviar el correo de recuperación de contraseña. Intenta de nuevo.");
            console.error("Error al enviar el correo de recuperación de contraseña:", error.response?.data?.detail || error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100", children: _jsxs("div", { className: "w-full max-w-md p-8 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl", children: _jsx(Activity, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "MedicalApp" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Olvid\u00F3 su contrase\u00F1a" })] }), error && _jsx("p", { className: "mb-4 text-center text-red-500", children: error }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsx(FormField, { id: "email", label: "Correo electr\u00F3nico", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true }), _jsx("div", { className: "mt-6 space-y-3", children: _jsx(Button, { type: "submit", disabled: isLoading, className: "font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", children: isLoading ? "Recuperando..." : "Recuperar Contraseña" }) }), _jsx("div", { className: "mt-6 space-y-3", children: _jsxs("div", { className: "flex items-center justify-center text-sm text-gray-600", children: [_jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Ya tienes una cuenta?" }), _jsx("button", { type: "button", className: "p-0 ml-1 text-sm text-blue-600 bg-transparent border-none cursor-pointer hover:text-blue-700 hover:underline", onClick: () => navigate("/login"), children: "Iniciar Sesi\u00F3n" })] }) })] }), _jsxs("footer", { className: "mt-6 text-sm text-center text-gray-500", children: [_jsx("p", { children: "Soporte: support@medicalapp.com" }), _jsx("p", { children: "\u00A9 2025 Medical App, Inc. Todos los derechos reservados." })] })] }) }));
};
export default ForgotPasswordPage;
