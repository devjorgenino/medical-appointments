import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Switch } from "@components/ui/switch";
export const TimeSlotItem = ({ slot, onEdit, onDelete, onToggleActive }) => {
    return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [slot.start_time, " - ", slot.end_time] }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [!slot.is_active && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Inactivo" })), _jsx(Switch, { checked: slot.is_active, onCheckedChange: onToggleActive, className: "data-[state=checked]:bg-blue-600" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md", onClick: onEdit, children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md", onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete();
                        }, children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }));
};
