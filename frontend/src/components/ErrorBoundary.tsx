import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ops! Algo deu errado.</h1>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado na aplicação. Tente recarregar a página.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-xs text-left bg-gray-100 p-2 rounded mb-4 overflow-auto max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
