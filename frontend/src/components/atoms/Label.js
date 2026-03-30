import { jsx as _jsx } from "react/jsx-runtime";
const Label = ({ htmlFor, children, className = '' }) => (_jsx("label", { htmlFor: htmlFor, className: `block text-gray-700 mb-2 ${className}`, children: children }));
export default Label;
