import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  showHomeButton?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { 
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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
    const { 
      fallbackTitle = 'Algo salio mal',
      fallbackDescription = 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
      showHomeButton = true
    } = this.props;

    if (this.state.hasError) {
      return (
        <div 
          className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-destructive/10 dark:bg-destructive/20">
            <AlertTriangle 
              className="w-8 h-8 text-destructive" 
              aria-hidden="true"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {fallbackTitle}
          </h2>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            {fallbackDescription}
          </p>

          {/* Error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 text-left w-full max-w-lg">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ver detalles del error (solo en desarrollo)
              </summary>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg overflow-auto max-h-48">
                <pre className="text-xs text-destructive whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              aria-label="Reintentar cargar el contenido"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Reintentar
            </button>
            
            {showHomeButton && (
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                aria-label="Ir a la pagina principal"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Ir al inicio
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
