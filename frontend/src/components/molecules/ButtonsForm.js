import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@components/ui/button"; // ← shadcn Button
import { Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ButtonsForm = ({ edit, path }) => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex justify-end space-x-2", children: [_jsxs(Button, { type: "button", variant: "outline", className: "flex items-center justify-center", onClick: () => navigate(path), children: [_jsx(X, { className: "w-4 h-4" }), "Cancelar"] }), _jsx(Button, { type: "submit" // ← SOLO submit → FormLayout controla la navegación
                , className: "flex items-center justify-center text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", children: edit ? (_jsxs(_Fragment, { children: [_jsx(Edit, { className: "w-4 h-4" }), "Actualizar"] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-4 h-4" }), "Guardar"] })) })] }));
};
export default ButtonsForm;
