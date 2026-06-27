import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("The Zero-Gravity Archive Error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#07070a',
          color: '#ff4444',
          padding: '40px',
          fontFamily: "'Space Grotesk', monospace",
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ marginBottom: '16px', fontSize: '2rem', letterSpacing: '0.05em' }}>SYSTEM DIAGNOSTIC ANOMALY</h1>
          <p style={{ color: '#8e8e93', marginBottom: '24px', maxWidth: '600px', fontSize: '0.9rem', lineHeight: '1.5' }}>
            The Zero-Gravity Archive encountered a runtime exception. The diagnostic details are captured below:
          </p>
          
          <div style={{
            background: 'rgba(255, 68, 68, 0.05)',
            border: '1px solid rgba(255, 68, 68, 0.2)',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '800px',
            textAlign: 'left',
            overflowX: 'auto',
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: '24px'
          }}>
            <strong style={{ color: '#ff6666' }}>Error Details:</strong>
            <div style={{ margin: '8px 0', fontSize: '0.95rem', color: '#ffffff' }}>
              {this.state.error?.toString()}
            </div>
            <pre style={{
              marginTop: '12px',
              color: '#ffa0a0',
              whiteSpace: 'pre-wrap',
              fontSize: '0.8rem',
              lineHeight: '1.4',
              fontFamily: 'monospace',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {this.state.error?.stack}
            </pre>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              background: '#00f0ff',
              color: '#030305',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
