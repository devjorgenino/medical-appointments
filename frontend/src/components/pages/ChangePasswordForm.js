import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@components/ui/button";
import FormField from "@components/molecules/FormField";
import Form from "@components/organisms/Form";
import { Save } from "lucide-react";
import { changePassword } from "@services/profile";
import { extractErrorMessage } from "@utils/error-handler";
const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (newPassword.length < 8 || newPassword.length > 16) {
            setError("La nueva contrasena debe tener entre 8 y 16 caracteres.");
            return;
        }
        setLoading(true);
        try {
            await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            setSuccess("Contrasena cambiada exitosamente.");
            setCurrentPassword("");
            setNewPassword("");
        }
        catch (error) {
            const errorMessage = extractErrorMessage(error, "Error al cambiar la contrasena. Intenta nuevamente.");
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl", children: _jsxs(Form, { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(FormField, { id: "currentPassword", label: "Contrasena actual", type: "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), placeholder: "Ingrese su contrasena actual", required: true }), _jsx(FormField, { id: "newPassword", label: "Nueva contrasena", type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "Minimo 8 caracteres, maximo 16", required: true })] }), error && _jsx("div", { className: "text-red-600 dark:text-red-400 text-sm", children: error }), success && _jsx("div", { className: "text-green-600 dark:text-green-400 text-sm", children: success }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { type: "submit", className: "flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", disabled: loading, children: [_jsx(Save, { className: "w-4 h-4" }), "Guardar"] }) })] }) }));
};
export default ChangePasswordForm;
