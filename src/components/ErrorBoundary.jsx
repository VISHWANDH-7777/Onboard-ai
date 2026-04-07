import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Unexpected application error.',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Global error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-surface-high/70 p-8 space-y-4 text-center">
          <h1 className="font-headline font-bold text-2xl">Something went wrong</h1>
          <p className="text-sm text-on-surface-variant">{this.state.message}</p>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-primary text-surface font-headline font-semibold"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
}
