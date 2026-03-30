import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FormField = ({ id, label, type = "text", value, disabled = false, onChange, onBlur, required = false, options, className = "", placeholder = "", error = "", }) => {
    const hasError = Boolean(error);
    const borderColorClass = hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400";
    const baseInputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${borderColorClass} ${className}`;
    let inputElement;
    if (type === "select") {
        inputElement = (_jsxs("select", { id: id, value: value, disabled: disabled, onChange: onChange, onBlur: onBlur, required: required, className: baseInputClasses, children: [_jsx("option", { value: "", disabled: true, children: "Seleccione una opcion..." }), options?.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }));
    }
    else if (type === "radio") {
        inputElement = (_jsx("div", { className: "flex items-center mb-5 text-center", children: options?.map((option) => (_jsxs("label", { className: "mr-4 text-gray-700 dark:text-gray-300 cursor-pointer", children: [_jsx("input", { type: "radio", id: `${id}-${option.value}`, name: id, value: option.value, checked: value === option.value, onChange: onChange, onBlur: onBlur, required: required, disabled: disabled, className: `w-auto mr-3 px-3 py-2 border rounded-md shadow-sm focus:outline-none accent-blue-500 ${borderColorClass} ${className}` }), option.label] }, option.value))) }));
    }
    else {
        inputElement = (_jsx("input", { type: type, id: id, value: value, disabled: disabled, onChange: onChange, onBlur: onBlur, required: required, placeholder: placeholder, className: baseInputClasses, autoComplete: type === "password" ? "current-password" : "on" }));
    }
    return (_jsxs("div", { className: "mb-4", children: [_jsxs("label", { htmlFor: id, className: `block mb-1 text-sm font-medium ${hasError ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`, children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), inputElement, hasError && (_jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error }))] }));
};
export default FormField;
