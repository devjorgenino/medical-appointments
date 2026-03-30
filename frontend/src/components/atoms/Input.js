import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
const Input = forwardRef(({ id, type = 'text', value, onChange, required, className = '', error, errorId, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    // Combine aria-describedby if there's an error
    const describedBy = error && errorId
        ? `${errorId}${ariaDescribedBy ? ` ${ariaDescribedBy}` : ''}`
        : ariaDescribedBy;
    return (_jsx("input", { ref: ref, id: id, type: type, value: value, onChange: onChange, required: required, "aria-required": required, "aria-invalid": ariaInvalid ?? !!error, "aria-describedby": describedBy, className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors ${error
            ? 'border-destructive focus:ring-destructive/50'
            : 'border-gray-300 dark:border-gray-600'} ${className}`, ...props }));
});
Input.displayName = 'Input';
export default Input;
