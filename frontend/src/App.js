import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContent } from "@utils/routes";
import { ThemeProvider } from "@components/providers/ThemeProvider";
import { QueryProvider } from "@components/providers/QueryProvider";
import "./index.css";
const App = () => {
    return (_jsx(QueryProvider, { children: _jsx(ThemeProvider, { children: _jsx(Router, { children: _jsx(AppContent, {}) }) }) }));
};
export default App;
