import React from 'react';

/**
 * ErrorBoundary - Capture les erreurs React et affiche un message d'erreur
 * En développement, affiche la stack trace complète
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'interface de secours
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur dans la console
    console.error('🔴 ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // En production, tu peux envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, etc.
    if (import.meta.env.VITE_NODE_ENV === 'production') {
      // sendToErrorTracking(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.VITE_NODE_ENV !== 'production';

      return (
        <div style={{
          padding: '2rem',
          maxWidth: '800px',
          margin: '2rem auto',
          backgroundColor: '#fee',
          border: '2px solid #c00',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#c00', marginTop: 0 }}>
            🔴 Oops! Une erreur est survenue
          </h1>
          
          {isDev && this.state.error && (
            <>
              <h2 style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                Erreur :
              </h2>
              <pre style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.9rem',
                color: '#c00'
              }}>
                {this.state.error.toString()}
              </pre>

              {this.state.errorInfo && (
                <>
                  <h2 style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    Stack Trace :
                  </h2>
                  <pre style={{
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.85rem',
                    maxHeight: '400px'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </>
          )}

          {!isDev && (
            <p style={{ fontSize: '1.1rem' }}>
              Une erreur inattendue s'est produite. Veuillez réessayer ou contacter le support.
            </p>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#c00',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
