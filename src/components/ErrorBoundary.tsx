import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import i18n from '../i18n';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center min-h-[50vh] p-8">
          <div className="fabric-grain bg-[#1B1814] border border-[#E0795A]/30 rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className="w-14 h-14 bg-[#E0795A]/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-[#E0795A]" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#F7F3EC] mb-2">{i18n.t('errorBoundary.title')}</h2>
            <p className="font-sans text-sm text-[#A89B8C] mb-6">
              {i18n.t('errorBoundary.message')}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="animate-press px-5 py-2.5 bg-[#C76B3F] text-[#0B0A08] rounded-lg font-sans text-sm font-semibold shadow-md flex items-center gap-2 mx-auto hover:bg-[#b36138] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{i18n.t('errorBoundary.reload')}</span>
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="font-mono text-xs text-[#6B6358] cursor-pointer">{i18n.t('errorBoundary.details')}</summary>
                <pre className="mt-2 font-mono text-xs text-[#A89B8C] bg-[#0E0C0A] p-3 rounded border border-[#2A2622] overflow-auto max-h-40">
                  {this.state.error.message}
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
