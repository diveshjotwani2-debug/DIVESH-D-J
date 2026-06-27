import React, { useEffect, useRef } from 'react';
import { 
  User, 
  Briefcase, 
  Database, 
  RefreshCw, 
  Mail, 
  MapPin, 
  Globe, 
  Compass, 
  Info, 
  Cpu, 
  MonitorPlay, 
  GraduationCap, 
  Award, 
  Phone, 
  FileDown 
} from 'lucide-react';

export function InterfaceOverlay({
  activeZone,
  setActiveZone,
  activeNode,
  setActiveNode,
  resetCamera
}) {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  // Synchronized, hardware-accelerated custom cursor script
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    // Enable custom cursor styles on body
    document.body.classList.add('custom-cursor-active');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    // Lightweight listener: only records coordinates, avoiding DOM writes or layout calculations
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Synchronize both dot and ring style updates to the browser's repaint cycle (60fps+)
    let animationFrameId;
    const updateCursorPositions = () => {
      dotX = mouseX;
      dotY = mouseY;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      // Ring lags smoothly behind using linear interpolation (lerp)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      animationFrameId = requestAnimationFrame(updateCursorPositions);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(updateCursorPositions);

    // Hover state managers for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.classList.contains('nav-item') || 
        target.closest('.nav-item') ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button';

      if (isInteractive) {
        dot.classList.add('hover-active');
        ring.classList.add('hover-active');
        
        // Determine hover accent color (cyan vs gold) based on active state or node class
        const isGold = 
          target.classList.contains('active-gold') || 
          target.classList.contains('btn-gold') || 
          target.closest('.glass-panel-gold') ||
          target.closest('.btn-gold');

        if (isGold) {
          ring.classList.add('hover-gold');
          dot.classList.add('hover-gold');
        } else {
          ring.classList.add('hover-cyan');
          dot.classList.add('hover-cyan');
        }
      }
    };

    const handleMouseOut = (e) => {
      // Reset classes
      dot.className = 'custom-cursor-dot';
      ring.className = 'custom-cursor-ring';
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hud-container">

      {/* ================= TOP BAR: STATUS & CONTROLS ================= */}
      <div className="hud-interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Compass className="text-cyan pulse-text" size={18} />
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'var(--font-heading)' }}>
              THE ZERO-GRAVITY ARCHIVE
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              SYSTEM STATUS: ONLINE // AGENT: DIVESH DHIRAJ JOTWANI
            </p>
          </div>
        </div>

        {/* Quick Reset Controls */}
        <button
          onClick={resetCamera}
          className="glass-panel glow-hover-cyan"
          style={{
            padding: '12px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            borderRadius: '50%'
          }}
          title="Reset System State"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* ================= MIDDLE SECTION: INTERACTIVE SLIDE PANELS ================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flex: 1, margin: '24px 0', pointerEvents: 'none' }}>
        
        {/* LEFT PANEL: COMPREHENSIVE DIGITAL CV (Zone 1) */}
        <div
          className="hud-interactive glass-panel-cyan"
          style={{
            width: '420px',
            maxHeight: '85vh',
            padding: '24px',
            display: activeZone === 'identity' ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '16px',
            pointerEvents: 'auto',
            transform: activeZone === 'identity' ? 'translateX(0)' : 'translateX(-440px)',
            transition: 'var(--transition-smooth)',
            boxShadow: '0 20px 40px rgba(0, 240, 255, 0.12)'
          }}
          onWheel={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* FIXED HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--glass-border-cyan)', paddingBottom: '14px', flexShrink: 0 }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <User className="text-cyan" size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Divesh Dhiraj Jotwani</h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Creative Media Professional & AI Product Strategist</p>
            </div>
          </div>

          {/* FIXED ABOUT ME & DOWNLOAD BUTTON */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              <p>
                Creative media and marketing professional with a strong inclination towards product management and AI-driven growth. Blending creativity with real business impact.
              </p>
            </div>

            <a
              href="/assets/DIVESH_DHIRAJ_JOTWANI_RESUME.pdf"
              download="Divesh_Dhiraj_Jotwani_Resume.pdf"
              className="btn-capsule btn-cyan glow-hover-cyan"
              style={{
                justifyContent: 'center',
                textDecoration: 'none',
                padding: '10px 16px',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                width: '100%'
              }}
            >
              <FileDown size={14} />
              <span>DOWNLOAD FULL RESUME (PDF)</span>
            </a>
          </div>

          <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0', flexShrink: 0 }} />

          {/* SCROLLABLE BODY */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              paddingRight: '6px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Education Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <GraduationCap className="text-cyan" size={16} />
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  EDUCATION
                </h3>
              </div>
              <div style={{ paddingLeft: '24px' }}>
                <h4 style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>Bachelor of Computer Applications (BCA)</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>KLE RLS College, Belgaum</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>Tenure: 2022 - 2025</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Certifications Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <Award className="text-cyan" size={16} />
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  CERTIFICATIONS & SIMULATIONS
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '24px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div>
                  <strong style={{ color: '#fff' }}>AI Product Management: Strategy & Roadmaps</strong>
                  <div>Udemy • May 2026</div>
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Product Management Job Simulation</strong>
                  <div>Electronic Arts (EA) via Forage • Feb 2026</div>
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Project Manager Job Simulation</strong>
                  <div>Siemens via Forage • Feb 2026</div>
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>AI and ML Certification Course (42 hrs)</strong>
                  <div>Seminarroom Education / KLE BCA Belagavi • Mar-Apr 2025</div>
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>AI using Python Certification Course (42 hrs)</strong>
                  <div>Seminarroom Education / KLE BCA Belagavi • Nov-Dec 2024</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Skills & Tools Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <Cpu className="text-cyan" size={16} />
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  SKILLS & TOOLS
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '24px' }}>
                {/* Creative Category */}
                <div>
                  <h4 style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    CREATIVE MEDIA & MARKETING
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Video Editing', 'Content Creation', 'AI-based Posters', 'Brand Shoots', 'Shopify Management', 'Digital Marketing & SEO'].map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.66rem',
                        background: 'rgba(0, 240, 255, 0.04)',
                        color: '#ffffff',
                        border: '1px solid rgba(0, 240, 255, 0.12)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Tools Category */}
                <div>
                  <h4 style={{ fontSize: '0.72rem', color: '#ffd700', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    AI & PRODUCTIVITY PLATFORMS
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Claude AI', 'ChatGPT', 'Gemini', 'Perplexity', 'Grok AI'].map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.66rem',
                        background: 'rgba(255, 215, 0, 0.04)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 215, 0, 0.15)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical Category */}
                <div>
                  <h4 style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    TECHNICAL & PRODUCT MANAGEMENT
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Python', 'Power BI', 'HTML/CSS', 'JavaScript', 'AWS', 'MongoDB', 'Advanced Excel', 'AI Product Strategy', 'KPI Development'].map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.66rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Languages Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <Globe className="text-cyan" size={16} />
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  LANGUAGES
                </h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                English • Hindi • Sindhi • Marathi • Kannada
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <MapPin size={13} className="text-cyan" />
                <span>Belgaum, Karnataka, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <Phone size={13} className="text-cyan" />
                <span>+91 6360321605</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <Mail size={13} className="text-cyan" />
                <a href="mailto:diveshjotwani2@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>
                  diveshjotwani2@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <a 
                  href="https://linkedin.com/in/diveshjotwani" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none' }}
                  className="text-cyan-hover"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#00f0ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <span style={{ borderBottom: '1px solid transparent' }}>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/diveshjotwani2-debug" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none' }}
                  className="text-cyan-hover"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#00f0ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: EXPERIENCE DETAIL (Zone 2) */}
        <div
          className="hud-interactive glass-panel-gold"
          style={{
            width: '420px',
            maxHeight: '90%',
            padding: '24px',
            display: activeZone === 'experience' && activeNode ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
            pointerEvents: 'auto',
            marginLeft: 'auto',
            transform: activeZone === 'experience' && activeNode ? 'translateX(0)' : 'translateX(440px)',
            transition: 'var(--transition-smooth)'
          }}
        >
          {activeNode && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--glass-border-gold)', paddingBottom: '16px' }}>
                <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Briefcase className="text-gold" size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{activeNode.company}</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{activeNode.details.role}</p>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>DURATION: {activeNode.details.duration}</span>
                <span className="text-gold" style={{ fontWeight: 600 }}>Interactive Node</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem', lineHeight: '1.5' }}>
                {activeNode.details.highlights.map((highlight, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)', marginTop: '6px', flexShrink: 0 }} />
                    <p style={{ color: 'var(--text-secondary)' }}>{highlight}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setActiveNode(null); }}
                className="btn-capsule btn-gold"
                style={{ marginTop: 'auto', alignSelf: 'stretch', justifyContent: 'center', fontSize: '0.75rem' }}
              >
                Return to Timeline
              </button>
            </>
          )}
        </div>

        {/* BOTTOM RIGHT CORNER HINTS */}
        {activeZone === 'projects' && (
          <div
            className="hud-interactive glass-panel-cyan"
            style={{
              padding: '16px 24px',
              pointerEvents: 'auto',
              marginLeft: 'auto',
              marginTop: 'auto',
              maxWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info className="text-cyan pulse-text" size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                ZONE 3: THE PROJECT VAULT
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Inspect standalone software applications. Click a trading card to flip it and reveal the technical specs.
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 500, lineHeight: '1.4' }}>
              Click the glowing <strong>[ VISIT LIVE SITE ]</strong> button on the back of any card to open its live demo.
            </p>
            
            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '6px 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                DIRECT PROJECT LINKS:
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* GrowIQ Link */}
                <a 
                  href="https://growiq-ai.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.15)';
                  }}
                >
                  <span>GrowIQ - AI Growth Tool</span>
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem' }}>VISIT SITE →</span>
                </a>

                {/* DukaanIQ Link */}
                <a 
                  href="https://dukaaniq-retail.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 215, 0, 0.04)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 215, 0, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                  }}
                >
                  <span>DukaanIQ - ERP Retail Ledger</span>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.65rem' }}>VISIT SITE →</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeZone === 'neev' && (
          <div
            className="hud-interactive glass-panel-cyan"
            style={{
              padding: '16px 24px',
              pointerEvents: 'auto',
              marginLeft: 'auto',
              marginTop: 'auto',
              maxWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info className="text-cyan pulse-text" size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                ZONE 4: THE NEEV SHOWCASE
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Massive, borderless interactive theater console. 
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              The video walkthrough is perfectly centered and flat. Use the drift controls below the console to Play, Pause, or Unmute, and click <strong>[ VISIT LIVE SITE ]</strong> to explore the live application.
            </p>
          </div>
        )}

        {activeZone === 'portal' && (
          <div
            className="hud-interactive glass-panel-cyan"
            style={{
              padding: '16px 24px',
              pointerEvents: 'auto',
              marginLeft: 'auto',
              marginTop: 'auto',
              maxWidth: '350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info className="text-cyan pulse-text" size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                ZONE 5: THE PORTAL
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Secure communication terminal and skills index. 
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Your technical skills are organized in a neat flat frame, and AI platforms orbit in a halo ring behind. Fill out the console fields to transmit a secure message directly to Divesh.
            </p>
          </div>
        )}

      </div>

      {/* ================= BOTTOM BAR: NAVIGATION ================= */}
      <div 
        className="hud-interactive" 
        style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto', zIndex: 100 }}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div 
          className="glass-panel nav-bar" 
          style={{ 
            gap: '8px', 
            padding: '8px 16px',
            background: 'rgba(8, 12, 22, 0.85)',
            borderColor: 'rgba(0, 240, 255, 0.3)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
            borderWidth: '1.5px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          
          {/* TAB 1: NEXUS */}
          <button
            onClick={() => {
              setActiveZone('identity');
              setActiveNode(null);
            }}
            className={`nav-item ${activeZone === 'identity' ? 'active-cyan' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'identity' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600
            }}
          >
            <User size={13} />
            <span>[01 NEXUS]</span>
          </button>

          {/* Separator */}
          <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>

          {/* TAB 2: EXPERIENCE */}
          <button
            onClick={() => {
              setActiveZone('experience');
            }}
            className={`nav-item ${activeZone === 'experience' ? 'active-gold' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'experience' ? 'var(--accent-gold)' : '#a0a0ab',
              fontWeight: 600
            }}
          >
            <Briefcase size={13} />
            <span>[02 EXPERIENCE]</span>
          </button>

          {/* Separator */}
          <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>

          {/* TAB 3: VAULT */}
          <button
            onClick={() => {
              setActiveZone('projects');
              setActiveNode(null);
            }}
            className={`nav-item ${activeZone === 'projects' ? 'active-cyan' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'projects' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600
            }}
          >
            <Database size={13} />
            <span>[03 VAULT]</span>
          </button>

          {/* Separator */}
          <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>

          {/* TAB 4: SHOWCASE */}
          <button
            onClick={() => {
              setActiveZone('neev');
              setActiveNode(null);
            }}
            className={`nav-item ${activeZone === 'neev' ? 'active-cyan' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'neev' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600
            }}
          >
            <MonitorPlay size={13} />
            <span>[04 SHOWCASE]</span>
          </button>

          {/* Separator */}
          <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>

          {/* TAB 5: TRANSMISSION */}
          <button
            onClick={() => {
              setActiveZone('portal');
              setActiveNode(null);
            }}
            className={`nav-item ${activeZone === 'portal' ? 'active-cyan' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'portal' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600
            }}
          >
            <Cpu size={13} />
            <span>[05 TRANSMISSION]</span>
          </button>

        </div>
      </div>

      {/* Hardware-Accelerated Immersive Custom Cursor */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <div ref={cursorRingRef} className="custom-cursor-ring" />

    </div>
  );
}
