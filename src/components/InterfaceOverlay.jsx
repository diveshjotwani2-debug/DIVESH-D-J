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
  activeProject,
  setActiveProject,
  resetCamera,
  isMobile,
  projectsData
}) {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  // Synchronized, hardware-accelerated custom cursor script (Desktop Only)
  useEffect(() => {
    if (isMobile) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    let animationFrameId;
    const updateCursorPositions = () => {
      dotX = mouseX;
      dotY = mouseY;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      animationFrameId = requestAnimationFrame(updateCursorPositions);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(updateCursorPositions);

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
  }, [isMobile]);

  return (
    <div className="hud-container" style={{ padding: isMobile ? '16px' : '24px' }}>

      {/* ================= TOP BAR: STATUS & CONTROLS ================= */}
      <div className="hud-interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div className="glass-panel" style={{ padding: isMobile ? '8px 16px' : '12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass className="text-cyan pulse-text" size={16} />
          <div>
            <h1 style={{ fontSize: isMobile ? '0.78rem' : '1rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'var(--font-heading)' }}>
              THE ZERO-GRAVITY ARCHIVE
            </h1>
            <p style={{ fontSize: isMobile ? '0.52rem' : '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              SYSTEM STATUS: ONLINE // AGENT: DIVESH D J
            </p>
          </div>
        </div>

        {/* Quick Reset Controls */}
        <button
          onClick={resetCamera}
          className="glass-panel glow-hover-cyan"
          style={{
            padding: isMobile ? '8px' : '12px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            borderRadius: '50%'
          }}
          title="Reset System State"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ================= MIDDLE SECTION: INTERACTIVE SLIDE PANELS ================= */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', width: '100%', flex: 1, margin: isMobile ? '12px 0' : '24px 0', pointerEvents: 'none', overflow: 'hidden' }}>
        
        {/* LEFT PANEL: COMPREHENSIVE DIGITAL CV (Zone 1) */}
        <div
          className="hud-interactive glass-panel-cyan"
          style={{
            width: isMobile ? '100%' : '420px',
            maxHeight: isMobile ? '62vh' : '85vh',
            padding: isMobile ? '16px' : '24px',
            display: activeZone === 'identity' ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '14px',
            pointerEvents: 'auto',
            transform: activeZone === 'identity' ? 'translateX(0)' : 'translateX(-440px)',
            transition: 'var(--transition-smooth)',
            boxShadow: '0 20px 40px rgba(0, 240, 255, 0.12)'
          }}
          onWheel={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* CV HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border-cyan)', paddingBottom: '10px', flexShrink: 0 }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '8px', borderRadius: '10px' }}>
              <User className="text-cyan" size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Divesh Dhiraj Jotwani</h2>
              <p style={{ fontSize: isMobile ? '0.62rem' : '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Creative Media & AI Product Strategist</p>
            </div>
          </div>

          {/* BIO & DOWNLOAD BUTTON */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
            <div style={{ fontSize: isMobile ? '0.72rem' : '0.8rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
              <p>
                Creative media and marketing professional with a strong inclination towards product management and AI-driven growth. Blending creativity with real business impact.
              </p>
            </div>

            <a
              href="./assets/DIVESH_DHIRAJ_JOTWANI_RESUME.pdf"
              download="Divesh_Dhiraj_Jotwani_Resume.pdf"
              className="btn-capsule btn-cyan glow-hover-cyan"
              style={{
                justifyContent: 'center',
                textDecoration: 'none',
                padding: isMobile ? '8px 12px' : '10px 16px',
                fontSize: isMobile ? '0.68rem' : '0.75rem',
                letterSpacing: '0.05em',
                width: '100%'
              }}
            >
              <FileDown size={13} />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>
          </div>

          <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0', flexShrink: 0 }} />

          {/* SCROLLABLE BODY */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              paddingRight: '4px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '14px',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Education Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <GraduationCap className="text-cyan" size={14} />
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  EDUCATION
                </h3>
              </div>
              <div style={{ paddingLeft: '22px' }}>
                <h4 style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>Bachelor of Computer Applications (BCA)</h4>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>KLE RLS College, Belgaum</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>Tenure: 2022 - 2025</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Certifications Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <Award className="text-cyan" size={14} />
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  CERTIFICATIONS & SIMULATIONS
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '22px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
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
                  <div>Seminarroom Education / KLE BCA Belagavi • 2025</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Skills & Tools Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <Cpu className="text-cyan" size={14} />
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  SKILLS & TOOLS
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '22px' }}>
                {/* Creative Category */}
                <div>
                  <h4 style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
                    CREATIVE MEDIA & MARKETING
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {['Video Editing', 'Content Creation', 'AI-based Posters', 'Shopify Management', 'Digital Marketing'].map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.62rem',
                        background: 'rgba(0, 240, 255, 0.04)',
                        color: '#ffffff',
                        border: '1px solid rgba(0, 240, 255, 0.12)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Tools Category */}
                <div>
                  <h4 style={{ fontSize: '0.68rem', color: '#ffd700', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
                    AI & PRODUCTIVITY PLATFORMS
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {['Claude AI', 'ChatGPT', 'Gemini', 'Perplexity', 'Grok AI'].map((s, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.62rem',
                        background: 'rgba(255, 215, 0, 0.04)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 215, 0, 0.15)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '2px 0' }} />

            {/* Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <MapPin size={12} className="text-cyan" />
                <span>Belgaum, Karnataka, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Phone size={12} className="text-cyan" />
                <span>+91 6360321605</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Mail size={12} className="text-cyan" />
                <a href="mailto:diveshjotwani2@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>
                  diveshjotwani2@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: EXPERIENCE DETAIL (Zone 2) */}
        {/* Slides up from the bottom (translateY) on mobile rather than from the side */}
        <div
          className="hud-interactive glass-panel-gold"
          style={{
            width: isMobile ? '100%' : '420px',
            maxHeight: isMobile ? '60vh' : '90%',
            padding: isMobile ? '16px' : '24px',
            display: activeZone === 'experience' && activeNode ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
            pointerEvents: 'auto',
            marginLeft: 'auto',
            transform: activeZone === 'experience' && activeNode ? 'translateX(0)' : 'translateX(440px)',
            transition: 'var(--transition-smooth)',
            boxShadow: '0 20px 40px rgba(255, 215, 0, 0.08)'
          }}
        >
          {activeNode && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border-gold)', paddingBottom: '12px' }}>
                <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '8px', borderRadius: '10px' }}>
                  <Briefcase className="text-gold" size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: isMobile ? '1.0rem' : '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{activeNode.company}</h2>
                  <p style={{ fontSize: isMobile ? '0.72rem' : '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{activeNode.details.role}</p>
                </div>
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>DURATION: {activeNode.details.duration}</span>
                <span className="text-gold" style={{ fontWeight: 600 }}>Active Node</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: isMobile ? '0.72rem' : '0.78rem', lineHeight: '1.4' }}>
                {activeNode.details.highlights.map((highlight, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-gold)', marginTop: '5px', flexShrink: 0 }} />
                    <p style={{ color: 'var(--text-secondary)' }}>{highlight}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setActiveNode(null); }}
                className="btn-capsule btn-gold"
                style={{ marginTop: 'auto', alignSelf: 'stretch', justifyContent: 'center', fontSize: '0.72rem', padding: '8px' }}
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
              padding: isMobile ? '16px' : '16px 24px',
              pointerEvents: 'auto',
              marginLeft: isMobile ? '0' : 'auto',
              marginTop: 'auto',
              width: isMobile ? '100%' : '350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info className="text-cyan pulse-text" size={14} />
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                ZONE 3: THE PROJECT VAULT
              </span>
            </div>
            
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Click card to flip. Click [ VISIT LIVE SITE ] to open demo.
            </p>
            
            <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.1)', margin: '4px 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                DIRECT LINKS:
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a 
                  href="https://growiq-ai.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.12)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.68rem',
                    fontWeight: 600
                  }}
                >
                  <span>GrowIQ Platform</span>
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '0.62rem' }}>VISIT →</span>
                </a>

                <a 
                  href="https://dukaaniq-retail.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 215, 0, 0.04)',
                    border: '1px solid rgba(255, 215, 0, 0.12)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.68rem',
                    fontWeight: 600
                  }}
                >
                  <span>DukaanIQ Retail ERP</span>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '0.62rem' }}>VISIT →</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Zone 4 Info Overlay */}
        {activeZone === 'neev' && (
          <div
            className="hud-interactive glass-panel-cyan"
            style={{
              padding: isMobile ? '12px 16px' : '16px 24px',
              pointerEvents: 'auto',
              marginLeft: isMobile ? '0' : 'auto',
              marginTop: 'auto',
              width: isMobile ? '100%' : '350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info className="text-cyan pulse-text" size={14} />
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                ZONE 4: THE NEEV SHOWCASE
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Theater console. Use Play/Pause/Mute below the screen mesh or click [ VISIT LIVE SITE ].
            </p>
          </div>
        )}

        {/* Zone 5 Info Overlay */}
        {activeZone === 'portal' && (
          <div
            className="hud-interactive glass-panel-cyan"
            style={{
              padding: isMobile ? '12px 16px' : '16px 24px',
              pointerEvents: 'auto',
              marginLeft: isMobile ? '0' : 'auto',
              marginTop: 'auto',
              width: isMobile ? '100%' : '350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info className="text-cyan pulse-text" size={14} />
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                ZONE 5: THE PORTAL
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Secure transmission terminal and technical skills matrix. Fill out the holographic console to send a secure message.
            </p>
          </div>
        )}

      </div>

      {/* ================= BOTTOM BAR: NAVIGATION ================= */}
      {/* Shortens names on mobile to [01], [02], etc. to prevent overflow */}
      <div 
        className="hud-interactive" 
        style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto', zIndex: 100 }}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div 
          className="glass-panel nav-bar" 
          style={{ 
            gap: isMobile ? '6px' : '8px', 
            padding: isMobile ? '6px 12px' : '8px 16px',
            background: 'rgba(8, 12, 22, 0.85)',
            borderColor: 'rgba(0, 240, 255, 0.3)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
            borderWidth: '1.5px',
            display: 'flex',
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'space-around'
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
              gap: '6px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'identity' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600,
              fontSize: isMobile ? '0.72rem' : '0.8rem'
            }}
          >
            <User size={12} />
            <span>{isMobile ? '[01]' : '[01 NEXUS]'}</span>
          </button>

          {/* Separator */}
          {!isMobile && <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>}

          {/* TAB 2: EXPERIENCE */}
          <button
            onClick={() => {
              setActiveZone('experience');
            }}
            className={`nav-item ${activeZone === 'experience' ? 'active-gold' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'experience' ? 'var(--accent-gold)' : '#a0a0ab',
              fontWeight: 600,
              fontSize: isMobile ? '0.72rem' : '0.8rem'
            }}
          >
            <Briefcase size={12} />
            <span>{isMobile ? '[02]' : '[02 EXPERIENCE]'}</span>
          </button>

          {/* Separator */}
          {!isMobile && <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>}

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
              gap: '6px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'projects' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600,
              fontSize: isMobile ? '0.72rem' : '0.8rem'
            }}
          >
            <Database size={12} />
            <span>{isMobile ? '[03]' : '[03 VAULT]'}</span>
          </button>

          {/* Separator */}
          {!isMobile && <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>}

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
              gap: '6px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'neev' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600,
              fontSize: isMobile ? '0.72rem' : '0.8rem'
            }}
          >
            <MonitorPlay size={12} />
            <span>{isMobile ? '[04]' : '[04 SHOWCASE]'}</span>
          </button>

          {/* Separator */}
          {!isMobile && <span style={{ color: 'rgba(255, 255, 255, 0.12)', margin: '0 4px', userSelect: 'none' }}>-----</span>}

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
              gap: '6px', 
              border: 'none', 
              background: 'none',
              color: activeZone === 'portal' ? 'var(--accent-cyan)' : '#a0a0ab',
              fontWeight: 600,
              fontSize: isMobile ? '0.72rem' : '0.8rem'
            }}
          >
            <Cpu size={12} />
            <span>{isMobile ? '[05]' : '[05 TRANSMISSION]'}</span>
          </button>

        </div>
      </div>

      {/* Hardware-Accelerated Immersive Custom Cursor (Only renders on Desktop) */}
      {!isMobile && (
        <>
          <div ref={cursorDotRef} className="custom-cursor-dot" />
          <div ref={cursorRingRef} className="custom-cursor-ring" />
        </>
      )}

    </div>
  );
}
