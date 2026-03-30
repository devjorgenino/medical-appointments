import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";
createRoot(document.getElementById("root")).render(_jsxs(_Fragment, { children: [_jsx(App, {}), _jsx(Toaster, { position: "bottom-right", duration: 4000, richColors: true, closeButton: true })] }));
