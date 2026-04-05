import React from 'react';
import mixpanel from 'mixpanel-browser';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Report to Sentry
    Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } });

    // Report to Mixpanel
    try {
      mixpanel.track('app_error', {
        error: error.message,
        componentStack: info.componentStack?.slice(0, 500),
      });
    } catch {
      // Mixpanel may not be initialized
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            backgroundColor: '#FAFAFA',
            color: '#111111',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦋</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#6E6E73', marginBottom: '1.5rem', maxWidth: '400px' }}>
            We hit an unexpected error. Please reload the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#00b18d',
              color: '#fff',
              border: 'none',
              borderRadius: '100px',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
