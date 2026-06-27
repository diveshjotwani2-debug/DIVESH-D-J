import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Compass, Cpu, Mail, Lock, RefreshCw, AlertTriangle } from 'lucide-react';

export function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      if (data?.user) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Authentication override failed:', err);
      setError(err.message || 'Access denied. Security clearance mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030305',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* Background Subtle Grid Pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: 0.35,
          pointerEvents: 'none'
        }}
      />

      {/* Login Box */}
      <div 
        className="glass-panel-cyan"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.12)',
          zIndex: 10
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu className="text-cyan pulse-text" size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.15em', fontFamily: 'var(--font-heading)', color: '#ffffff', textTransform: 'uppercase' }}>
            Airlock Authorization
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            System Override Terminal // Command Center
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.15)', margin: '4px 0' }} />

        {/* Error Message */}
        {error && (
          <div 
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '12px',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Admin Identifier (Email)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail 
                size={14} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity-verification@system.io"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  background: 'rgba(5, 5, 10, 0.6)',
                  border: '1px solid var(--glass-border-cyan)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-cyan)'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Security Clearance Key (Password)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock 
                size={14} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  background: 'rgba(5, 5, 10, 0.6)',
                  border: '1px solid var(--glass-border-cyan)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-cyan)'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-capsule btn-cyan glow-hover-cyan"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '12px',
              padding: '12px',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: loading ? 0.7 : 1,
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="pulse-text" style={{ animation: 'spin 1.5s linear infinite' }} />
                <span>Decrypting Clearance...</span>
              </>
            ) : (
              <span>Authorize Override</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
          <Compass size={10} />
          <span>SECURE SYSTEM PROTOCOL ENABLED</span>
        </div>
      </div>
    </div>
  );
}
