"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
            
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-xl font-semibold text-gray-900">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="mb-6 text-sm text-gray-500">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>

              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Try Again
              </button>
            </div>

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-xs font-medium text-gray-400">
                  Error Details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs text-red-600">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============= HOOK FOR PROGRAMMATIC ERROR HANDLING =============
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return setError;
}