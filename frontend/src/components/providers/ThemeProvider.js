import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ThemeContext } from "@contexts/ThemeContext";
const THEME_STORAGE_KEY = "theme";
export const ThemeProvider = ({ children, }) => {
    const [theme, setThemeState] = useState(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (storedTheme === "light" || storedTheme === "dark") {
                return storedTheme;
            }
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        }
        return "light";
    });
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (!storedTheme) {
                setThemeState(e.matches ? "dark" : "light");
            }
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);
    const toggleTheme = () => {
        setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme, setTheme }, children: children }));
};
