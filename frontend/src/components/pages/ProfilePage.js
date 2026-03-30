import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@components/ui/button";
import { getProfile, updateProfile } from "@services/profile";
import ChangePasswordForm from "./ChangePasswordForm";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { filterPhoneNumbers } from "@utils/validation";
import { useFormValidation, createProfileFormValidationConfig, } from "@hooks/useFormValidation";
const initialProfile = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@email.com",
    numero_telefono: "123456789",
    direccion: "Calle Falsa 123",
    sexo: "M",
};
const ProfilePage = () => {
    const [profile, setProfile] = useState(initialProfile);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(profile);
    // Configuración de validación para perfil
    const validationConfig = useMemo(() => createProfileFormValidationConfig(), []);
    // Hook de validación centralizado
    const { errors, touched, validateField, handleBlur, validateAll, resetValidation } = useFormValidation(validationConfig);
    // Handler para cambios en campos con validación en tiempo real
    const handleFieldChange = (fieldName, value) => {
        const updatedForm = { ...form, [fieldName]: value };
        setForm(updatedForm);
        if (touched[fieldName]) {
            validateField(fieldName, updatedForm[fieldName], updatedForm);
        }
    };
    const handleEdit = (e) => {
        e.preventDefault();
        setForm(profile);
        setEditMode(true);
        resetValidation();
    };
    const handleSave = async () => {
        if (!validateAll(form)) {
            return;
        }
        // Aquí iría la petición a la API para actualizar el perfil
        // await api.updateProfile(form)
        await updateProfile(form);
        setProfile(form);
        setEditMode(false);
        resetValidation();
    };
    // Aquí iría la petición a la API para obtener el perfil del usuario
    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            // Suponiendo que la respuesta tiene la estructura adecuada
            setProfile(response.data);
        }
        catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    return (_jsxs("section", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Mi Perfil" }) }), _jsx("div", { className: "p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl", children: _jsxs(Form, { className: "space-y-4", onSubmit: (e) => {
                        e.preventDefault();
                        handleSave();
                    }, children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(FormField, { id: "nombre", label: "Nombre", type: "text", value: editMode ? form.nombre : profile.nombre, onChange: (e) => {
                                        handleFieldChange("nombre", e.target.value);
                                    }, onBlur: () => {
                                        handleBlur("nombre");
                                        validateField("nombre", form.nombre, form);
                                    }, placeholder: "Ingrese su nombre", disabled: !editMode, className: editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600", error: editMode ? errors.nombre : "" }), _jsx(FormField, { id: "apellido", label: "Apellido", type: "text", value: editMode ? form.apellido : profile.apellido, onChange: (e) => {
                                        handleFieldChange("apellido", e.target.value);
                                    }, onBlur: () => {
                                        handleBlur("apellido");
                                        validateField("apellido", form.apellido, form);
                                    }, placeholder: "Ingrese su apellido", disabled: !editMode, className: editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600", error: editMode ? errors.apellido : "" }), _jsx(FormField, { id: "email", label: "Email", type: "email", value: editMode ? form.email : profile.email, onChange: (e) => {
                                        handleFieldChange("email", e.target.value);
                                    }, onBlur: () => {
                                        handleBlur("email");
                                        validateField("email", form.email, form);
                                    }, placeholder: "ejemplo@correo.com", disabled: !editMode, className: editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600", error: editMode ? errors.email : "" }), _jsx(FormField, { id: "numero_telefono", label: "N\u00FAmero de tel\u00E9fono", type: "text", value: editMode
                                        ? form.numero_telefono || ""
                                        : profile.numero_telefono || "", onChange: (e) => {
                                        const value = filterPhoneNumbers(e.target.value);
                                        handleFieldChange("numero_telefono", value);
                                    }, onBlur: () => {
                                        handleBlur("numero_telefono");
                                        validateField("numero_telefono", form.numero_telefono, form);
                                    }, placeholder: "Ej: 1234567890", disabled: !editMode, className: editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600", error: editMode ? errors.numero_telefono : "" }), editMode ? (_jsx(FormField, { id: "sexo", label: "Sexo", type: "radio", value: form.sexo, onChange: (e) => {
                                        if (e.target.value === "M" || e.target.value === "F") {
                                            handleFieldChange("sexo", e.target.value);
                                        }
                                    }, onBlur: () => {
                                        handleBlur("sexo");
                                        validateField("sexo", form.sexo, form);
                                    }, options: [
                                        { value: "M", label: "Masculino" },
                                        { value: "F", label: "Femenino" },
                                    ], required: true, error: errors.sexo })) : (_jsx(FormField, { id: "sexo", label: "Sexo", type: "text", value: profile.sexo === "M" ? "Masculino" : "Femenino", disabled: true, className: "w-full rounded-lg border px-3 py-2 bg-gray-100 dark:bg-gray-600", onChange: () => { } })), _jsx(FormField, { id: "direccion", label: "Direcci\u00F3n", type: "text", value: editMode ? form.direccion || "" : profile.direccion || "", onChange: (e) => {
                                        const value = e.target.value;
                                        handleFieldChange("direccion", value);
                                    }, onBlur: () => {
                                        handleBlur("direccion");
                                        validateField("direccion", form.direccion, form);
                                    }, placeholder: "Ej: Calle Principal 123, Ciudad", disabled: !editMode, className: editMode ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600", error: editMode ? errors.direccion : "" })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [editMode && (_jsxs(Button, { type: "button", variant: "outline", className: "flex items-center justify-center transition-colors border border-gray-300 dark:border-gray-600 rounded-lg justify-centertext-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500", onClick: (e) => {
                                        e.preventDefault();
                                        setEditMode(false);
                                        setForm(profile);
                                        resetValidation();
                                    }, children: [_jsx(X, { className: "w-4 h-4" }), "Cancelar"] })), editMode ? (_jsxs(Button, { type: "submit", className: "flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", children: [_jsx(Save, { className: "w-4 h-4" }), " Guardar"] })) : (_jsxs(Button, { type: "button", className: "flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", onClick: handleEdit, children: [_jsx(Edit, { className: "w-4 h-4" }), " Editar"] }))] })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Cambiar Contrase\u00F1a" }) }), _jsx(ChangePasswordForm, {})] })] }));
};
export default ProfilePage;
