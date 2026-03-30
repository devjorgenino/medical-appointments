import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";
export function ConfirmModal({ isOpen, onClose, onConfirm, title = "Confirmar acción", message, confirmText = "Confirmar", cancelText = "Cancelar", variant = "destructive", }) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", showCloseButton: false, children: [_jsxs(DialogHeader, { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-full ${variant === "destructive"
                                        ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}`, children: _jsx(AlertTriangle, { className: "h-5 w-5" }) }), _jsx(DialogTitle, { className: "text-left", children: title })] }), _jsx(DialogDescription, { className: "pt-2 text-left text-base", children: message })] }), _jsxs(DialogFooter, { className: "gap-2 space-x-2 sm:gap-0", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: onClose, className: "sm:min-w-[100px]", children: [_jsx(X, { className: "h-4 w-4" }), cancelText] }), _jsxs(Button, { type: "button", variant: variant === "destructive" ? "destructive" : "default", onClick: handleConfirm, className: "sm:min-w-[100px]", children: [_jsx(Trash2, { className: "h-4 w-4" }), confirmText] })] })] }) }));
}
