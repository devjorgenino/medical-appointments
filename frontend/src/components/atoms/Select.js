import { jsx as _jsx } from "react/jsx-runtime";
const Select = ({ id, value, onChange, children, required, className = '' }) => (_jsx("select", { id: id, value: value, onChange: onChange, required: required, className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`, children: children }));
export default Select;
