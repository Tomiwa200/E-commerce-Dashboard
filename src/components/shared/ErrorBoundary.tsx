"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log telemetry tracers to analytical endpoints here in real production builds
    console.error("Uncaught isolated React view crash trace:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 text-center shadow-sm">
          <h4 className="text-sm font-bold text-rose-800">Operational Interface Glitch</h4>
          <p className="text-xs text-rose-600 mt-1">
            {this.props.fallbackMessage || "This UI node failed to execute parameters correctly."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-lg bg-rose-600 px-3 py-1.5 text-2xs font-bold text-white hover:bg-rose-500 transition-colors"
          >
            Attempt Fragment Re-render
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
