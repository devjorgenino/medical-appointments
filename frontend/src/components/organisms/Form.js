import { jsx as _jsx } from "react/jsx-runtime";
const Form = ({ onSubmit, children, className = "" }) => (_jsx("form", { onSubmit: onSubmit, className: `space-y-4 ${className}`, children: children }));
export default Form;
