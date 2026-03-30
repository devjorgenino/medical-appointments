import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, EyeOff } from "lucide-react";
import Form from "@components/organisms/Form";
import FormField from "@components/molecules/FormField";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { NotAuthorized } from "@components/organisms/NotAuthorized";
import { ROLE_OPTIONS } from "@src/types/roles";
import { filterPhoneNumbers } from "@utils/validation";
import { useFormValidation, createUserFormValidationConfig, } from "@hooks/useFormValidation";
const FormLayout = ({ user, newData, editData, setNewData, setEditData, handleCreateOrUpdate, redirectPath, children, }) => {
    const location = useLocation();
    const infoUser = location.state?.infoUser;
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    // Detectamos creación vs edición
    const isCreation = !editData?.id;
    // Configuración de validación basada en si es creación o edición
    const validationConfig = useMemo(() => createUserFormValidationConfig(isCreation), [isCreation]);
    // Hook de validación centralizado
    const { errors, touched, validateField, handleBlur, validateAll } = useFormValidation(validationConfig);
    // Cargar datos cuando venimos de edición
    useEffect(() => {
        if (infoUser) {
            setNewData(infoUser);
            setEditData(infoUser);
        }
    }, [infoUser, setNewData, setEditData]);
    // Autorización
    if (![1, 3].includes(Number(user.role_id)) &&
        (editData?.id ?? 0) !== user.id) {
        return _jsx(NotAuthorized, {});
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll(newData)) {
            return;
        }
        const success = await handleCreateOrUpdate(e);
        if (success && redirectPath) {
            navigate(redirectPath);
        }
    };
    // Handler para cambios en campos con validación en tiempo real
    const handleFieldChange = (fieldName, value) => {
        const updatedData = { ...newData, [fieldName]: value };
        setNewData(updatedData);
        if (touched[fieldName]) {
            validateField(fieldName, value, updatedData);
        }
    };
    return (_jsx("div", { className: "space-y-6", children: _jsx("div", { className: "p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl", children: _jsxs(Form, { onSubmit: onSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [_jsx(FormField, { id: "email", label: "Correo electr\u00F3nico", type: "email", value: newData.email || "", onChange: (e) => {
                                    handleFieldChange("email", e.target.value);
                                }, onBlur: () => {
                                    handleBlur("email");
                                    validateField("email", newData.email, newData);
                                }, placeholder: "ejemplo@correo.com", required: true, error: errors.email }), _jsxs("div", { className: "relative", children: [_jsx(FormField, { id: "password", label: "Contrase\u00F1a", type: showPassword ? "text" : "password", value: newData.password || "", onChange: (e) => {
                                            handleFieldChange("password", e.target.value);
                                        }, onBlur: () => {
                                            handleBlur("password");
                                            validateField("password", newData.password, newData);
                                        }, placeholder: isCreation
                                            ? "Mínimo 8 caracteres (obligatorio)"
                                            : "Dejar vacío para mantener la actual", required: isCreation, className: "pr-12", error: errors.password }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300", children: showPassword ? (_jsx(EyeOff, { className: "w-5 h-5" })) : (_jsx(Eye, { className: "w-5 h-5" })) })] }), _jsx(FormField, { id: "nombre", label: "Nombre", value: newData.nombre || "", onChange: (e) => {
                                    handleFieldChange("nombre", e.target.value);
                                }, onBlur: () => {
                                    handleBlur("nombre");
                                    validateField("nombre", newData.nombre, newData);
                                }, required: true, error: errors.nombre }), _jsx(FormField, { id: "apellido", label: "Apellido", value: newData.apellido || "", onChange: (e) => {
                                    handleFieldChange("apellido", e.target.value);
                                }, onBlur: () => {
                                    handleBlur("apellido");
                                    validateField("apellido", newData.apellido, newData);
                                }, required: true, error: errors.apellido }), _jsx(FormField, { id: "numero_telefono", label: "N\u00FAmero de tel\u00E9fono", value: newData.numero_telefono || "", onChange: (e) => {
                                    const value = filterPhoneNumbers(e.target.value) || undefined;
                                    handleFieldChange("numero_telefono", value);
                                }, onBlur: () => {
                                    handleBlur("numero_telefono");
                                    validateField("numero_telefono", newData.numero_telefono, newData);
                                }, error: errors.numero_telefono }), _jsx(FormField, { id: "direccion", label: "Direcci\u00F3n", value: newData.direccion || "", onChange: (e) => {
                                    const value = e.target.value || undefined;
                                    handleFieldChange("direccion", value);
                                }, onBlur: () => {
                                    handleBlur("direccion");
                                    validateField("direccion", newData.direccion, newData);
                                }, error: errors.direccion }), _jsx(FormField, { id: "sexo", label: "Sexo", type: "radio", value: newData.sexo || "", options: [
                                    { value: "M", label: "Masculino" },
                                    { value: "F", label: "Femenino" },
                                ], onChange: (e) => {
                                    handleFieldChange("sexo", e.target.value || undefined);
                                }, onBlur: () => {
                                    handleBlur("sexo");
                                    validateField("sexo", newData.sexo, newData);
                                }, required: true, error: errors.sexo }), user.role_id === 1 && (_jsx(FormField, { id: "role_id", label: "Rol", type: "select", value: newData.role_id?.toString() ?? "3", onChange: (e) => {
                                    handleFieldChange("role_id", Number(e.target.value));
                                }, onBlur: () => {
                                    handleBlur("role_id");
                                    validateField("role_id", newData.role_id, newData);
                                }, options: ROLE_OPTIONS.map((r) => ({
                                    value: r.id.toString(),
                                    label: r.label,
                                })), required: true, error: errors.role_id, disabled: !!editData?.id })), newData.role_id === 3 && (_jsx(FormField, { id: "especialidad", label: "Especialidad", value: newData.especialidad || "", onChange: (e) => {
                                    const value = e.target.value || undefined;
                                    handleFieldChange("especialidad", value);
                                }, onBlur: () => {
                                    handleBlur("especialidad");
                                    validateField("especialidad", newData.especialidad, newData);
                                }, placeholder: "Cardiolog\u00EDa, Pediatr\u00EDa, etc.", required: isCreation, error: errors.especialidad })), newData.role_id === 2 && (_jsx(FormField, { id: "fecha_nacimiento", label: "Fecha de Nacimiento", type: "date", value: newData.fecha_nacimiento || "", onChange: (e) => {
                                    const value = e.target.value || undefined;
                                    handleFieldChange("fecha_nacimiento", value);
                                }, onBlur: () => {
                                    handleBlur("fecha_nacimiento");
                                    validateField("fecha_nacimiento", newData.fecha_nacimiento, newData);
                                }, error: errors.fecha_nacimiento }))] }), children] }) }) }));
};
export default FormLayout;
