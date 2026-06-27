import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { supabase, isOfflineMode } from './supabaseClient';

// Import 3D Components
import { Lighting } from './components/Lighting';
import { BackgroundParticles } from './components/BackgroundParticles';
import { IdentityCore } from './components/IdentityCore';
import { ExperienceOrbit } from './components/ExperienceOrbit';
import { ProjectCards } from './components/ProjectCards';
import { NeevVideoConsole } from './components/NeevVideoConsole';
import { ContactPortal } from './components/ContactPortal';

// Import 2D Overlays & Admin & Preloader Components
import { InterfaceOverlay } from './components/InterfaceOverlay';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { Preloader } from './components/Preloader';

// Hardcoded Static Fallback Data (resilience state)
const fallbackExperiences = [
  {
    id: 'vrnn',
    company: 'VRNN Technologies',
    title: 'Creative Media & Marketing Executive',
    period: 'Oct 2025 - Mar 2026',
    radius: 4.8,
    speed: 0.08,
    phase: 0,
    color: '#00f0ff',
    details: {
      role: 'Creative Media & Marketing Executive',
      duration: 'October 2025 - March 2026',
      highlights: [
        'Handled the complete content workflow — ideation, shoot planning, editing, and publishing.',
        'Created reels, promotional videos, posters, and AI-based creatives for social media and marketing campaigns.',
        'Managed client websites and digital content including Shopify store operations.',
        'Delivered creative and marketing work for 10+ businesses across fitness, fashion, healthcare, education, real estate, and retail.',
        'Key clients: CREDAI RECON Expo 2026, Huballi and Verbally Learning (marketing campaigns).'
      ]
    }
  },
  {
    id: 'verbally',
    company: 'Verbally Learning',
    title: 'Business Analyst & Growth Associate',
    period: 'Apr 2024 - Jan 2025',
    radius: 4.8,
    speed: 0.08,
    phase: Math.PI,
    color: '#ffd700',
    details: {
      role: 'Business Analyst & Growth Associate',
      duration: 'April 2024 - January 2025',
      highlights: [
        'Built Power BI dashboards for sales performance and lead tracking.',
        'Developed lead generation forms using Python to support marketing and growth efforts.',
        'Supported email marketing campaigns and growth initiatives using data-driven insights.'
      ]
    }
  }
];

const fallbackProjects = [
  {
    id: 'growiq',
    title: 'GrowIQ',
    tagline: 'AI-Powered Growth Engine',
    year: '2026',
    color: '#00f0ff',
    pos: [-1.32, 0, 0],
    demoUrl: 'https://growiq-ai.netlify.app',
    backDetails: {
      desc: 'AI-driven tool designed to help businesses identify growth opportunities, build strategic roadmaps, and track critical KPIs.',
      skills: 'AI Product Management, Strategic Growth, Analytics',
      bullet1: '• Automates market gap analysis',
      bullet2: '• Strategic growth roadmap builder',
      bullet3: '• AI Product Management showcase'
    }
  },
  {
    id: 'dukaaniq',
    title: 'DukaanIQ',
    tagline: 'Smart Retail Ledger & ERP',
    year: '2026',
    color: '#ffd700',
    pos: [1.32, 0, 0],
    demoUrl: 'https://dukaaniq-retail.netlify.app',
    backDetails: {
      desc: 'Full-stack web application for local Indian retail businesses (kiranas, clothing, pharmacies) featuring smart inventory, credit ledger, and AI advisor.',
      skills: 'Inventory Tracking, AI Advisor, Ledger ERP',
      bullet1: '• Smart real-time inventory & stock alerts',
      bullet2: '• AI-powered local business advisor insights',
      bullet3: '• Credit / Udhaar digital ledger book'
    }
  }
];

// Camera Controller for smooth cinematically animated Y-axis vertical glides
function CameraController({ activeZone, resetTrigger, controlsRef, isMobile }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetFov = useRef(45); // Dynamic Field of View target

  // Configure camera positions, look-at targets, and FOV for each of the 5 Zones
  useEffect(() => {
    const zOffset = isMobile ? 1.62 : 1.0;  // Pull camera back on mobile portrait to fit landscape elements
    const fovVal = isMobile ? 64 : 45;      // Wider mobile FOV

    switch (activeZone) {
      case 'identity':
        targetPos.current.set(0, 0, 5.2 * zOffset);
        targetLookAt.current.set(0, 0, 0);
        targetFov.current = fovVal;
        break;
      case 'experience':
        targetPos.current.set(0, isMobile ? 3.2 : 2.8, 7.2 * zOffset);
        targetLookAt.current.set(0, 0, 0);
        targetFov.current = fovVal;
        break;
      case 'projects':
        targetPos.current.set(0, -6, isMobile ? 10.2 : 5.5);
        targetLookAt.current.set(0, -6, 0);
        targetFov.current = isMobile ? 72 : 45;
        break;
      case 'neev':
        targetPos.current.set(0, -12.5, 6.8 * zOffset);
        targetLookAt.current.set(0, -12.5, 0);
        targetFov.current = fovVal;
        break;
      case 'portal':
        targetPos.current.set(0, -20, 7.8 * zOffset);
        targetLookAt.current.set(0, -20, 0);
        targetFov.current = isMobile ? 70 : 62; // Extra wide view for mobile portal dashboard
        break;
      default:
        targetPos.current.set(0, 0, 5.2 * zOffset);
        targetLookAt.current.set(0, 0, 0);
        targetFov.current = fovVal;
    }
  }, [activeZone, resetTrigger, isMobile]);

  // Interpolate camera, look-at, and FOV on every frame
  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLookAt.current);

    if (Math.abs(camera.fov - targetFov.current) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, 0.05);
      camera.updateProjectionMatrix();
    }

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.05);
      controlsRef.current.update();
    }
  });

  return null;
}

export default function App() {
  const [activeZone, setActiveZone] = useState('identity'); // 'identity', 'experience', 'projects', 'neev', 'portal'
  const [activeNode, setActiveNode] = useState(null); // Selected experience node in Zone 2
  const [activeProject, setActiveProject] = useState(null); // Selected project card in Zone 3
  const [resetTrigger, setResetTrigger] = useState(0); // Trigger to reset camera orientation
  const controlsRef = useRef(); // OrbitControls reference for target Y glides

  // Supabase & Routing States
  const [currentPath, setCurrentPath] = useState(window.location.hash || window.location.pathname);
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Dynamic Portfolio States
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Viewport & Preloader States
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isBooted, setIsBooted] = useState(false);

  // 1. Listen for viewport size updates (Mobile detection)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Unify scroll settings: Disable document scrolling on all platforms to lock single-screen interactive HUD
  useEffect(() => {
    const rootDiv = document.getElementById('root');
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    if (rootDiv) {
      rootDiv.style.overflow = 'hidden';
      rootDiv.style.height = '100%';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      if (rootDiv) {
        rootDiv.style.overflow = '';
        rootDiv.style.height = '';
      }
    };
  }, []);

  // 3. Listen for URL path or hash changes (Lightweight Client-Side Router)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.hash || window.location.pathname);
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    if (isOfflineMode) {
      setSession(null);
      setAuthChecked(true);
      return () => {
        window.removeEventListener('hashchange', handleLocationChange);
        window.removeEventListener('popstate', handleLocationChange);
      };
    }

    // Initial check of Auth Session
    let subscription = null;
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setAuthChecked(true);
    }).catch(err => {
      console.warn("Auth check failed:", err);
      setSession(null);
      setAuthChecked(true);
    });

    // Listen to Auth State changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    subscription = data?.subscription;

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 4. Fetch live data from Supabase Core
  useEffect(() => {
    if (isOfflineMode) {
      setExperiences(fallbackExperiences);
      setProjects(fallbackProjects);
      setLoadingDb(false);
      return;
    }

    const loadCoreData = async () => {
      try {
        // Fetch experiences
        const { data: expData, error: expErr } = await supabase
          .from('experiences')
          .select('*')
          .order('created_at', { ascending: true });

        if (expErr) throw expErr;

        // Map database records into front-end node structures
        if (expData && expData.length > 0) {
          const mappedExps = expData.map((exp, idx) => ({
            id: exp.id,
            company: exp.company,
            title: exp.role,
            period: exp.duration,
            radius: exp.radius ? parseFloat(exp.radius) : 4.8,
            speed: exp.speed ? parseFloat(exp.speed) : 0.08,
            phase: (idx / expData.length) * Math.PI * 2, // Symmetrical radial spacing
            color: exp.color || '#00f0ff',
            details: {
              role: exp.role,
              duration: exp.duration,
              highlights: exp.highlights || []
            },
            model_type: exp.model_type || 'lens'
          }));
          setExperiences(mappedExps);
        } else {
          setExperiences(fallbackExperiences);
        }

        // Fetch projects
        const { data: projData, error: projErr } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (projErr) throw projErr;

        if (projData && projData.length > 0) {
          const mappedProjs = projData.map((proj, idx) => ({
            id: proj.id,
            title: proj.title,
            tagline: proj.tagline,
            year: proj.year || '2026',
            color: proj.color || '#00f0ff',
            // Position dynamically on the X-axis: space cards symmetrically on desktop
            pos: [(idx - (projData.length - 1) / 2) * 2.64, 0, 0],
            demoUrl: proj.demo_url,
            image_url: proj.image_url,
            backDetails: {
              desc: proj.description,
              skills: proj.skills,
              bullet1: proj.bullet1,
              bullet2: proj.bullet2,
              bullet3: proj.bullet3
            }
          }));
          setProjects(mappedProjs);
        } else {
          setProjects(fallbackProjects);
        }

      } catch (err) {
        console.warn('Supabase DB offline or unconfigured. Spawning offline fallback data.', err);
        setExperiences(fallbackExperiences);
        setProjects(fallbackProjects);
      } finally {
        setLoadingDb(false);
      }
    };

    loadCoreData();
  }, [session]); // Reload if admin logs in/out to verify fresh data updates

  // Coordinate selections
  const handleSelect = (type, data) => {
    if (type === 'identity') {
      setActiveZone('identity');
      setActiveNode(null);
    } else if (type === 'experience') {
      setActiveZone('experience');
      setActiveNode(data);
    }
  };

  const handleSelectProject = (projectId) => {
    setActiveProject(projectId);
  };

  const resetCamera = () => {
    setResetTrigger(prev => prev + 1);
    setActiveNode(null);
    setActiveProject(null);
    setActiveZone('identity');
  };

  // ================= ROUTER ROUTE CONTROLLER =================
  const isAdminRoute = currentPath === '/command-center' || currentPath === '#/command-center';

  if (isAdminRoute && authChecked) {
    if (!session) {
      // Unauthenticated: Force Airlock Gate Login
      return <AdminLogin onLoginSuccess={() => setSession(true)} />;
    } else {
      // Authenticated: Render Administrative Command Center
      return <AdminPanel onLogout={() => setSession(null)} />;
    }
  }

  // DEFAULT VIEW: Public 3D Portfolio
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. System Boot Preloader */}
      {!isBooted && <Preloader onComplete={() => setIsBooted(true)} />}

      {/* 2. 2D HUD Interface Overlay */}
      <InterfaceOverlay
        activeZone={activeZone}
        setActiveZone={setActiveZone}
        activeNode={activeNode}
        setActiveNode={setActiveNode}
        activeProject={activeProject}
        setActiveProject={handleSelectProject}
        resetCamera={resetCamera}
        isMobile={isMobile}
        projectsData={projects}
      />

      {/* Cinematic Vignette Overlay to blend edges of canvas */}
      <div className="vignette-overlay" />

      {/* 3. 3D Render Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <color attach="background" args={['#030305']} />

        {/* Cinematic Dynamic DSLR Lighting (Zone-Aware) */}
        <Lighting activeZone={activeZone} />

        {/* Starfield & Cosmic Dust Particles */}
        <BackgroundParticles />

        {/* Smooth Vertical Camera Controller (supports camera Z-offset glides on mobile) */}
        <CameraController
          activeZone={activeZone}
          resetTrigger={resetTrigger}
          controlsRef={controlsRef}
          isMobile={isMobile}
        />

        {/* Orbit Controls (Active on mobile/desktop to allow smooth panning around nodes) */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7} 
          minPolarAngle={Math.PI / 3.5}  
          maxDistance={15}
          minDistance={3.5}
        />

        {/* ================= ZONE 1: THE CORE (IDENTITY) ================= */}
        <group position={[0, 0, 0]} visible={activeZone === 'identity' || activeZone === 'experience'}>
          <IdentityCore
            isSelected={activeZone === 'identity'}
            onSelect={handleSelect}
          />
        </group>

        {/* ================= ZONE 2: THE ORBITAL TIMELINE (EXPERIENCE) ================= */}
        <group position={[0, 0, 0]} visible={activeZone === 'identity' || activeZone === 'experience'}>
          <ExperienceOrbit
            activeNode={activeNode}
            onSelect={handleSelect}
            experiencesData={experiences}
            isMobile={isMobile}
          />
        </group>

        {/* ================= ZONE 3: THE PROJECT VAULT (GALLERY) ================= */}
        <Suspense fallback={null}>
          <group position={[0, -6, 0]} visible={activeZone === 'projects'}>
            <ProjectCards
              activeProject={activeProject}
              onSelectProject={handleSelectProject}
              projectsData={projects}
              isMobile={isMobile}
            />
          </group>
        </Suspense>

        {/* ================= ZONE 4: THE NEEV SHOWCASE (THEATER) ================= */}
        <Suspense fallback={null}>
          <group position={[0, 0, 0]} visible={activeZone === 'neev'}>
            <NeevVideoConsole activeZone={activeZone} isMobile={isMobile} />
          </group>
        </Suspense>

        {/* ================= ZONE 5: THE PORTAL (SKILLS & CONTACT) ================= */}
        <group position={[0, 0, 0]} visible={activeZone === 'portal'}>
          <ContactPortal isActive={activeZone === 'portal'} isMobile={isMobile} />
        </group>

      </Canvas>
    </div>
  );
}
