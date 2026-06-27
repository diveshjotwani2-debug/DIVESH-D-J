import React, { useState, useEffect } from 'react';
import { Compass, Cpu, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

export function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isFading, setIsFading] = useState(false);
  const [visible, setVisible] = useState(true);

  // organic terminal booting log sequence
  const bootSequences = [
    { threshold: 10, text: '>> INITIALIZING COGNITIVE INTERFACE CORE... [OK]' },
    { threshold: 30, text: '>> CALIBRATING ZERO-GRAVITY CAMERAS... [OK]' },
    { threshold: 50, text: '>> LOADING DYNAMIC SUPABASE DATA CORE... [OK]' },
    { threshold: 75, text: '>> STABILIZING WEBGL COLLIDER MATRIX... [OK]' },
    { threshold: 90, text: '>> SECURING TRANSMISSION AIRLOCKS... [OK]' },
    { threshold: 100, text: '>> OVERRIDE SUCCESSFUL // COCKPIT SECURED' }
  ];

  useEffect(() => {
    let currentProgress = 0;
    let timer;

    const runLoading = () => {
      // organic progress increments (simulate loading data bursts)
      const increment = Math.floor(Math.random() * 8) + 3; // 3% to 10%
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      // check which boot logs should be printed
      const currentLogs = bootSequences
        .filter(seq => currentProgress >= seq.threshold)
        .map(seq => seq.text);
      
      setLogs(currentLogs);

      if (currentProgress < 100) {
        // schedule next load tick
        const delay = Math.floor(Math.random() * 150) + 50; // 50ms to 200ms
        timer = setTimeout(runLoading, delay);
      } else {
        // Enforce extra 600ms pause at 100% for readability before starting fade out
        setTimeout(() => {
          setIsFading(true);
          // Wait for CSS opacity fade-out transition (800ms) to unmount
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 800);
        }, 600);
      }
    };

    // start the loading sequence
    timer = setTimeout(runLoading, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030305',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999, // Ensure it is above all overlays and canvas
        fontFamily: 'var(--font-body)',
        color: '#ffffff',
        transition: 'opacity 0.8s ease-in-out',
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'all'
      }}
    >
      {/* Cosmic grid backing */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: 0.3,
          pointerEvents: 'none'
        }}
      />

      <div 
        className="glass-panel-cyan"
        style={{
          width: '90%',
          maxWidth: '540px',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 0 50px rgba(0, 240, 255, 0.08)',
          zIndex: 10
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '10px', borderRadius: '50%' }}>
            <Cpu className="text-cyan pulse-text" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.15em', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              System Initialization
            </h2>
            <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              COCKPIT SECURITY PROTOCOL // BOOT SEQUENCE
            </p>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <span>PREPARING COGNITIVE MATRIX</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{progress}%</span>
          </div>
          
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progress}%`, 
                background: 'var(--accent-cyan)', 
                boxShadow: '0 0 8px var(--accent-cyan)',
                transition: 'width 0.15s ease-out' 
              }} 
            />
          </div>
        </div>

        {/* Terminal Log Output */}
        <div 
          style={{ 
            background: 'rgba(5, 5, 10, 0.65)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px', 
            padding: '16px', 
            minHeight: '130px',
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            color: '#a1a1aa',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', marginBottom: '4px' }}>
            <Terminal size={12} className="text-cyan" />
            <span style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>CONSOLE OUTPUT</span>
          </div>

          {logs.map((log, idx) => (
            <div 
              key={idx} 
              style={{ 
                color: idx === logs.length - 1 && progress === 100 ? 'var(--accent-cyan)' : '#a1a1aa',
                opacity: idx === logs.length - 1 ? 1 : 0.65,
                transition: 'opacity 0.2s ease'
              }}
            >
              {log}
            </div>
          ))}

          {progress < 100 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <RefreshCw size={10} className="pulse-text" style={{ animation: 'spin 1.5s linear infinite' }} />
              <span className="pulse-text" style={{ color: 'var(--text-muted)' }}>Working...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
