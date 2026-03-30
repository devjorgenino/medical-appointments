import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ type = "button", className = "", onClick, disabled = false, // Agregar esta línea
children, style, }) => (_jsx("button", { type: type, className: `${type === "submit" ? "w-full" : "w-auto"}  px-4 py-2 rounded-md font-medium text-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled
        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
        : className}`, onClick: disabled ? undefined : onClick, disabled: disabled, style: style, children: children }));
export default Button;
