import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function ContactPortal({ isActive, isMobile }) {
  const portalRef = useRef();

  // Form states
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'TRANSMITTING', 'SUCCESS'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setStatus('TRANSMITTING');
    
    // Simulate secure backend data transmission
    setTimeout(() => {
      setStatus('SUCCESS');
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('IDLE'), 4000);
    }, 1500);
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (portalRef.current && isActive) {
      // Mild, extremely subtle floating drift
      portalRef.current.position.y = -20.0 + Math.sin(time * 0.4) * 0.03;
    }
  });

  return (
    <group ref={portalRef} position={[0, -20.0, 0]} scale={1.0}>
      {/* Dynamic Ambient Point Light locally lighting the portal zone */}
      <pointLight position={[0, 1.5, 2]} intensity={1.2} distance={8} color="#00f0ff" />
      <pointLight position={[0, -1.5, 2]} intensity={0.8} distance={8} color="#ffd700" />

      {/* Unified Holographic Control Dashboard Console */}
      {isActive && (
        <Html
          transform
          distanceFactor={10.0}
          position={[0, 0, 0]}
          style={{ pointerEvents: 'auto' }}
          onWheel={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
        <div 
          className="dashboard-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'stretch',
            width: '830px',
            maxWidth: '100vw',
            boxSizing: 'border-box',
            justifyContent: 'center',
            fontFamily: 'var(--font-body)',
            color: '#ffffff'
          }}
        >
          {/* Style Injection for Responsiveness and Animations */}
          <style>{`
            .dashboard-container {
              transition: var(--transition-smooth);
            }
            .glass-panel-portal {
              background: rgba(5, 7, 12, 0.48);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.07);
              border-radius: 20px;
              padding: 22px;
              display: flex;
              flex-direction: column;
              transition: var(--transition-smooth);
            }
            .glow-border-cyan-portal {
              border-color: rgba(0, 240, 255, 0.15) !important;
              box-shadow: 0 10px 30px rgba(0, 240, 255, 0.04);
            }
            .glow-border-cyan-portal:hover {
              border-color: var(--accent-cyan) !important;
              box-shadow: 0 0 25px rgba(0, 240, 255, 0.12);
            }
            .glow-border-gold-portal {
              border-color: rgba(255, 215, 0, 0.15) !important;
              box-shadow: 0 10px 30px rgba(255, 215, 0, 0.04);
            }
            .glow-border-gold-portal:hover {
              border-color: var(--accent-gold) !important;
              box-shadow: 0 0 25px rgba(255, 215, 0, 0.12);
            }
            .glow-border-form-portal {
              border-color: rgba(0, 240, 255, 0.25) !important;
              box-shadow: 0 15px 40px rgba(0, 240, 255, 0.08);
            }
            .glow-border-form-portal:hover {
              border-color: var(--accent-cyan) !important;
              box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
            }
            .skill-tag-portal {
              font-size: 0.68rem;
              background: rgba(255, 255, 255, 0.02);
              color: #e4e4e7;
              border: 1px solid rgba(255, 255, 255, 0.06);
              padding: 4px 8px;
              border-radius: 6px;
              display: inline-block;
              transition: all 0.2s ease;
            }
            .skill-tag-portal:hover {
              background: rgba(255, 255, 255, 0.06);
              color: #ffffff;
              border-color: rgba(255, 255, 255, 0.15);
              transform: translateY(-1px);
            }
            .skill-tag-cyan-portal {
              font-size: 0.68rem;
              background: rgba(0, 240, 255, 0.03);
              color: #e4e4e7;
              border: 1px solid rgba(0, 240, 255, 0.12);
              padding: 4px 8px;
              border-radius: 6px;
              display: inline-block;
              transition: all 0.2s ease;
            }
            .skill-tag-cyan-portal:hover {
              background: rgba(0, 240, 255, 0.08);
              color: var(--accent-cyan);
              border-color: var(--accent-cyan);
              transform: translateY(-1px);
            }
            .skill-tag-gold-portal {
              font-size: 0.68rem;
              background: rgba(255, 215, 0, 0.02);
              color: #e4e4e7;
              border: 1px solid rgba(255, 215, 0, 0.12);
              padding: 4px 8px;
              border-radius: 6px;
              display: inline-block;
              transition: all 0.2s ease;
            }
            .skill-tag-gold-portal:hover {
              background: rgba(255, 215, 0, 0.08);
              color: var(--accent-gold);
              border-color: var(--accent-gold);
              transform: translateY(-1px);
            }
            @media (max-width: 900px) {
              .dashboard-container {
                flex-direction: column !important;
                width: 340px !important;
                gap: 16px !important;
              }
              .glass-panel-portal {
                width: 100% !important;
              }
            }
          `}</style>

          {/* ================= LEFT COLUMN: TECHNICAL SKILLS ================= */}
          <div 
            className="glass-panel-portal glow-border-cyan-portal" 
            style={{ width: '240px', gap: '16px' }}
          >
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                INDEX: SKILLS
              </h3>
              <p style={{ fontSize: '0.58rem', color: 'var(--accent-cyan)', letterSpacing: '0.05em', marginTop: '4px' }}>
                DEVELOPMENT & CREATIVE INDEX
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Development Group */}
              <div>
                <h4 style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  CORE DEVELOPMENT
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Python', 'JavaScript', 'HTML/CSS', 'MongoDB', 'AWS'].map((s, idx) => (
                    <span key={idx} className="skill-tag-cyan-portal">{s}</span>
                  ))}
                </div>
              </div>

              {/* Creative Group */}
              <div>
                <h4 style={{ fontSize: '0.65rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  CREATIVE MEDIA & SEO
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Video Editing', 'Content Creation', 'AI Posters', 'Brand Shoots', 'Shopify', 'Digital Marketing'].map((s, idx) => (
                    <span key={idx} className="skill-tag-portal">{s}</span>
                  ))}
                </div>
              </div>

              {/* Analytics Group */}
              <div>
                <h4 style={{ fontSize: '0.65rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  ANALYTICS & SYSTEMS
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Power BI', 'Advanced Excel'].map((s, idx) => (
                    <span key={idx} className="skill-tag-portal">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= CENTER COLUMN: THE CONTACT FORM ================= */}
          <div 
            className="glass-panel-portal glow-border-form-portal" 
            style={{ width: '330px', gap: '16px' }}
          >
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.15em', color: '#ffffff' }}>
                THE PORTAL
              </h2>
              <p style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', letterSpacing: '0.05em', marginTop: '4px' }}>
                SECURE TRANSMISSION // DIGITAL TERMINAL
              </p>
            </div>

            {status === 'SUCCESS' ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '30px 0', 
                textAlign: 'center',
                gap: '12px',
                flex: 1
              }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  border: '2px solid var(--accent-cyan)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  boxShadow: '0 0 15px var(--accent-cyan-glow)'
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', letterSpacing: '0.05em' }}>
                  TRANSMISSION SUCCESSFUL
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '260px' }}>
                  Data packet securely dispatched. Digital connection established with Divesh Jotwani.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {/* Name Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>
                    IDENTIFIER (NAME)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    disabled={status === 'TRANSMITTING'}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontSize: '0.78rem',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'var(--transition-smooth)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                  />
                </div>

                {/* Email Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>
                    RETURN ROUTE (EMAIL)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    disabled={status === 'TRANSMITTING'}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontSize: '0.78rem',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'var(--transition-smooth)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                  />
                </div>

                {/* Message Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>
                    SECURE MESSAGE PAYLOAD
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    disabled={status === 'TRANSMITTING'}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontSize: '0.78rem',
                      color: '#ffffff',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      transition: 'var(--transition-smooth)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'TRANSMITTING'}
                  style={{
                    background: 'rgba(0, 240, 255, 0.08)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid var(--accent-cyan)',
                    borderRadius: '9999px',
                    padding: '11px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    marginTop: 'auto',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'var(--accent-cyan)';
                    e.target.style.color = '#030305';
                    e.target.style.boxShadow = '0 0 15px var(--accent-cyan-glow)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(0, 240, 255, 0.08)';
                    e.target.style.color = 'var(--accent-cyan)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {status === 'TRANSMITTING' ? 'TRANSMITTING DATA...' : 'TRANSMIT MESSAGE'}
                </button>
              </form>
            )}
          </div>

          {/* ================= RIGHT COLUMN: AI TOOLS & STRATEGY ================= */}
          <div 
            className="glass-panel-portal glow-border-gold-portal" 
            style={{ width: '240px', gap: '16px' }}
          >
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                AI DECK: TOOLS
              </h3>
              <p style={{ fontSize: '0.58rem', color: 'var(--accent-gold)', letterSpacing: '0.05em', marginTop: '4px' }}>
                INTEGRATION & STRATEGY WORKFLOW
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* AI Platforms Group */}
              <div>
                <h4 style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  COGNITIVE PLATFORMS
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Claude AI', 'ChatGPT', 'Gemini', 'Perplexity', 'Grok AI'].map((s, idx) => (
                    <span key={idx} className="skill-tag-gold-portal">{s}</span>
                  ))}
                </div>
              </div>

              {/* AI Product Strategy & KPIs Group */}
              <div>
                <h4 style={{ fontSize: '0.65rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  AI PRODUCT STRATEGY
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['AI Product Strategy', 'KPI Development', 'Roadmapping', 'Analytics & Insights'].map((s, idx) => (
                    <span key={idx} className="skill-tag-portal">{s}</span>
                  ))}
                </div>
              </div>

              {/* Subtle Info Label */}
              <div style={{ 
                marginTop: 'auto', 
                padding: '10px', 
                background: 'rgba(255, 215, 0, 0.03)', 
                border: '1px solid rgba(255, 215, 0, 0.08)', 
                borderRadius: '8px',
                fontSize: '0.62rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                Utilizing state-of-the-art AI systems to architect product roadmaps, optimize content engines, and drive growth.
              </div>
            </div>
          </div>
        </div>
        </Html>
      )}
    </group>
  );
}
