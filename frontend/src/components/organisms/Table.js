import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Table = ({ headers, children }) => (_jsxs("table", { className: "min-w-full bg-white border", children: [_jsx("thead", { children: _jsx("tr", { children: headers.map((header, index) => (_jsx("th", { className: "py-2 px-4 border", children: header }, index))) }) }), _jsx("tbody", { children: children })] }));
export default Table;
