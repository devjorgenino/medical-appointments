import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Shield } from "lucide-react";
export const NotAuthorized = () => {
    return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsxs("div", { className: "text-center", children: [_jsx(Shield, { className: "w-16 h-16 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "Acceso Restringido" }), _jsx("p", { className: "text-gray-600", children: "Se requiere rol de administrador para acceder a esta secci\u00F3n." })] }) }));
};
