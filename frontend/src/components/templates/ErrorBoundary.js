import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
        this.setState({ errorInfo });
        // Here you could send the error to an error tracking service
        // Example: errorTrackingService.log(error, errorInfo);
    }
    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };
    handleGoHome = () => {
        window.location.href = '/';
    };
    render() {
        const { fallbackTitle = 'Algo salio mal', fallbackDescription = 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.', showHomeButton = true } = this.props;
        if (this.state.hasError) {
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] p-8 text-center", role: "alert", "aria-live": "assertive", children: [_jsx("div", { className: "flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-destructive/10 dark:bg-destructive/20", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-destructive", "aria-hidden": "true" }) }), _jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: fallbackTitle }), _jsx("p", { className: "text-muted-foreground mb-6 max-w-md", children: fallbackDescription }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("details", { className: "mb-6 text-left w-full max-w-lg", children: [_jsx("summary", { className: "cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Ver detalles del error (solo en desarrollo)" }), _jsx("div", { className: "mt-2 p-4 bg-muted/50 rounded-lg overflow-auto max-h-48", children: _jsxs("pre", { className: "text-xs text-destructive whitespace-pre-wrap break-words", children: [this.state.error.toString(), this.state.errorInfo?.componentStack] }) })] })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("button", { onClick: this.handleRetry, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors", "aria-label": "Reintentar cargar el contenido", children: [_jsx(RefreshCw, { className: "w-4 h-4", "aria-hidden": "true" }), "Reintentar"] }), showHomeButton && (_jsxs("button", { onClick: this.handleGoHome, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors", "aria-label": "Ir a la pagina principal", children: [_jsx(Home, { className: "w-4 h-4", "aria-hidden": "true" }), "Ir al inicio"] }))] })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
