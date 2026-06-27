import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Asynchronous Texture Loader Material for dynamic project card illustrations
function CardTextureMesh({ url, projColor }) {
  const [texture, setTexture] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; // Ensure correct color spacing
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn('Failed to load project card texture:', url, err);
        setFailed(true);
      }
    );
  }, [url]);

  if (texture && !failed) {
    return (
      <meshStandardMaterial
        map={texture}
        roughness={0.15}
        metalness={0.7}
        side={THREE.DoubleSide}
      />
    );
  }

  // Neon Placeholder while loading or if download fails
  return (
    <meshStandardMaterial
      color={projColor === '#ffd700' ? '#2c1e02' : '#002535'}
      roughness={0.1}
      metalness={0.8}
      emissive={projColor}
      emissiveIntensity={0.15}
      side={THREE.DoubleSide}
    />
  );
}

// Modular HUD Action Ring for spinning dashed frames around project cards
function CardActionRing({ isVisible, color, points, isFlipped }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current && isVisible) {
      ringRef.current.rotation.z = -state.clock.getElapsedTime() * 0.85;
    }
  });

  return (
    <group visible={isVisible} position={[0, 0, 0.04]}>
      <Line
        ref={ringRef}
        points={points}
        color={color}
        lineWidth={1.2}
        dashed
        dashScale={1.5}
        dashSize={0.12}
        gapSize={0.08}
        transparent
        opacity={0.8}
      />
      
      {/* Tiny elegant prompt floating below the card */}
      <Billboard position={[0, -1.45, 0.02]}>
        <Text
          fontSize={0.072}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {isFlipped ? "> CLICK TO FLIP BACK <" : "> CLICK TO FLIP <"}
        </Text>
      </Billboard>
    </group>
  );
}

export function ProjectCards({ activeProject, onSelectProject, projectsData, isMobile }) {
  // State to track flipped cards
  const [flippedCards, setFlippedCards] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Card Refs
  const cardRefs = useRef({});

  // Precompute circle coordinates for the dashed HUD ring around the cards (on the XY plane)
  const cardCirclePoints = useMemo(() => {
    const points = [];
    const radius = 1.45; // Frames the 1.7 x 2.4 card perfectly
    for (let i = 0; i <= 48; i++) {
      const theta = (i / 48) * Math.PI * 2;
      points.push([Math.cos(theta) * radius, Math.sin(theta) * radius, 0]);
    }
    return points;
  }, []);

  // Filter and load projects (props fallback to default static items)
  const projects = useMemo(() => {
    if (projectsData && projectsData.length > 0) {
      return projectsData;
    }
    return [
      {
        id: 'growiq',
        title: 'GrowIQ',
        tagline: 'AI-Powered Growth Engine',
        year: '2026',
        color: '#00f0ff',
        pos: [-1.32, 0, 0],
        demoUrl: 'https://growiq-ai.netlify.app',
        image_url: './assets/growiq.png',
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
        image_url: './assets/dukaaniq.png',
        backDetails: {
          desc: 'Full-stack web application for local Indian retail businesses (kiranas, clothing, pharmacies) featuring smart inventory, credit ledger, and AI advisor.',
          skills: 'Inventory Tracking, AI Advisor, Ledger ERP',
          bullet1: '• Smart real-time inventory & stock alerts',
          bullet2: '• AI-powered local business advisor insights',
          bullet3: '• Credit / Udhaar digital ledger book'
        }
      }
    ];
  }, [projectsData]);

  // Synchronize default active project selection on mobile mount
  useEffect(() => {
    if (isMobile && !activeProject && projects.length > 0) {
      onSelectProject(projects[0].id);
    }
  }, [isMobile, activeProject, projects, onSelectProject]);

  // Animate the cards floating, flipping, and sliding back
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const activeIndex = projects.findIndex(p => p.id === activeProject);
    const currentActiveIdx = activeIndex === -1 ? 0 : activeIndex;

    projects.forEach((proj, idx) => {
      const ref = cardRefs.current[proj.id];
      if (ref) {
        const isFlipped = flippedCards[proj.id];
        const isHovered = hoveredCard === proj.id;
        
        let targetPos;
        let targetRotY = isFlipped ? Math.PI : 0;
        let targetScale = 1.0;

        if (isMobile) {
          // Mobile Carousel Math: centering active index, receding & slanting neighbors
          const offset = idx - currentActiveIdx;
          
          if (offset === 0) {
            targetPos = new THREE.Vector3(0, 0, isHovered ? 0.22 : 0);
            targetRotY = isFlipped ? Math.PI : 0;
            targetScale = isHovered ? 1.04 : 1.0;
          } else {
            const slantAngle = offset > 0 ? -0.45 : 0.45;
            targetPos = new THREE.Vector3(offset * 1.8, -0.1, -1.2);
            targetRotY = slantAngle;
            targetScale = 0.8;
          }
        } else {
          // Desktop Horizontal Grid
          targetPos = new THREE.Vector3(...proj.pos);
          if (isHovered) {
            targetPos.z += 0.22;
          }
          targetRotY = isFlipped ? Math.PI : 0;
          targetScale = isHovered ? 1.04 : 1.0;
        }

        ref.position.lerp(targetPos, 0.1);
        ref.rotation.y = THREE.MathUtils.lerp(ref.rotation.y, targetRotY, 0.12);
        ref.rotation.x = THREE.MathUtils.lerp(ref.rotation.x, 0, 0.1);
        ref.rotation.z = THREE.MathUtils.lerp(ref.rotation.z, 0, 0.1);
        ref.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    });
  });

  const handleCardClick = (id, idx, e) => {
    e.stopPropagation();
    
    const activeIdx = projects.findIndex(p => p.id === activeProject);
    const currentActiveIdx = activeIdx === -1 ? 0 : activeIdx;

    if (isMobile && idx !== currentActiveIdx) {
      // Tap inactive card to slide it to the center focus
      onSelectProject(id);
    } else {
      // Toggle flip state of centered card
      setFlippedCards(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
      onSelectProject(id);
    }
  };

  const handleLinkClick = (url, e) => {
    e.stopPropagation(); // Prevent re-flipping the card!
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <group position={[0, 0, 0]}>

      {/* ================= THE MONOLITH (BACKGROUND STRUCTURE) ================= */}
      <group position={[0, 0, -0.8]}>
        <mesh>
          <boxGeometry args={[0.7, 2.6, 0.2]} />
          <meshStandardMaterial color="#0b0c10" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <boxGeometry args={[0.71, 2.61, 0.21]} />
          <meshStandardMaterial 
            color="#00f0ff" 
            emissive="#00f0ff" 
            emissiveIntensity={0.6} 
            wireframe={true} 
            transparent 
            opacity={0.35} 
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
          <torusGeometry args={[0.8, 0.025, 16, 100]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} roughness={0.1} />
        </mesh>
      </group>

      {/* Monolith floating label and connection line (Camera-Facing) */}
      <Billboard position={[0, 1.68, -0.5]}>
        <Line
          points={[[0, -0.12, 0], [0, -0.7, 0]]}
          color="#00f0ff"
          lineWidth={1}
          transparent
          opacity={0.5}
        />
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.14}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          [ 03 // THE MONOLITH : PROJECTS ]
        </Text>
      </Billboard>

      {/* ================= PROJECT TRADING CARDS ================= */}
      {projects.map((proj, index) => {
        const isFlipped = !!flippedCards[proj.id];
        const isHovered = hoveredCard === proj.id;

        return (
          <group
            key={proj.id}
            ref={(el) => (cardRefs.current[proj.id] = el)}
          >
            
            {/* FRONT SIDE (Cinematic Artwork, Text-free, Logo-free) */}
            <group>
              {/* Card Face with Asynchronous Texture Loader */}
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1.7, 2.4]} />
                <CardTextureMesh url={proj.image_url} projColor={proj.color} />
              </mesh>

              {/* Front Border (Electric Cyan / Liquid Gold Neon Frame) */}
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[1.71, 2.41]} />
                <meshStandardMaterial
                  color={proj.color}
                  emissive={proj.color}
                  emissiveIntensity={isHovered ? 1.5 : 0.8}
                  wireframe={true}
                  transparent={true}
                  opacity={0.7}
                />
              </mesh>
            </group>

            {/* BACK SIDE (Detailed Information, Flipped 180 deg) */}
            <group rotation={[0, Math.PI, 0]}>
              {/* Back Plate Glass */}
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1.7, 2.4]} />
                <meshPhysicalMaterial
                  color="#05080f"
                  roughness={0.1}
                  metalness={0.9}
                  transmission={0.3}
                  thickness={1.0}
                  transparent={true}
                  opacity={0.95}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Back Border */}
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[1.71, 2.41]} />
                <meshStandardMaterial
                  color={proj.color}
                  emissive={proj.color}
                  emissiveIntensity={0.6}
                  wireframe={true}
                  transparent={true}
                  opacity={0.4}
                />
              </mesh>

              {/* Back Text Layout */}
              <group position={[0, 0, 0.015]}>
                {/* Year tag */}
                <Text
                  position={[0.6, 1.0, 0]}
                  fontSize={0.09}
                  color={proj.color}
                  anchorX="right"
                >
                  {proj.year}
                </Text>

                {/* Title */}
                <Text
                  position={[-0.65, 0.95, 0]}
                  fontSize={0.16}
                  color="#ffffff"
                  anchorX="left"
                  fontWeight="bold"
                >
                  {proj.title}
                </Text>

                {/* Tagline */}
                <Text
                  position={[-0.65, 0.74, 0]}
                  fontSize={0.08}
                  color={proj.color}
                  anchorX="left"
                >
                  {proj.tagline}
                </Text>

                {/* Divider Line */}
                <mesh position={[0, 0.63, 0]}>
                  <planeGeometry args={[1.3, 0.006]} />
                  <meshBasicMaterial color={proj.color} transparent={true} opacity={0.3} />
                </mesh>

                {/* Description */}
                <Text
                  position={[-0.65, 0.52, 0]}
                  fontSize={0.065}
                  color="#d4d4d8"
                  anchorX="left"
                  anchorY="top"
                  maxWidth={1.3}
                  lineHeight={1.4}
                >
                  {proj.backDetails.desc}
                </Text>

                {/* Bullet points */}
                <Text
                  position={[-0.65, 0.06, 0]}
                  fontSize={0.06}
                  color="#a1a1aa"
                  anchorX="left"
                  anchorY="top"
                  maxWidth={1.3}
                  lineHeight={1.45}
                >
                  {`${proj.backDetails.bullet1}\n${proj.backDetails.bullet2}\n${proj.backDetails.bullet3}`}
                </Text>

                {/* Symmetrical, clicking [ VISIT LIVE SITE ] capsule button */}
                <group
                  position={[0, -0.52, 0.02]}
                  onClick={(e) => handleLinkClick(proj.demoUrl, e)}
                  onPointerOver={(e) => { 
                    e.stopPropagation(); 
                    setHoveredLink(proj.id); 
                  }}
                  onPointerOut={() => { 
                    setHoveredLink(null); 
                  }}
                >
                  <mesh>
                    <boxGeometry args={[1.2, 0.22, 0.04]} />
                    <meshPhysicalMaterial
                      color={hoveredLink === proj.id ? proj.color : '#0d1520'}
                      emissive={hoveredLink === proj.id ? proj.color : 'transparent'}
                      emissiveIntensity={0.5}
                      transmission={0.8}
                      roughness={0.1}
                      transparent={true}
                      opacity={0.95}
                    />
                  </mesh>
                  <mesh position={[0, 0, 0.005]}>
                    <boxGeometry args={[1.2, 0.22, 0.04]} />
                    <meshBasicMaterial color={proj.color} wireframe={true} transparent={true} opacity={0.4} />
                  </mesh>
                  <Text
                    position={[0, 0, 0.03]}
                    fontSize={0.07}
                    color={hoveredLink === proj.id ? '#030305' : proj.color}
                    fontWeight="bold"
                    anchorX="center"
                    anchorY="middle"
                  >
                    [ VISIT LIVE SITE ]
                  </Text>
                </group>

                {/* Skills Footer */}
                <mesh position={[0, -0.74, 0]}>
                  <planeGeometry args={[1.3, 0.006]} />
                  <meshBasicMaterial color={proj.color} transparent={true} opacity={0.3} />
                </mesh>

                <Text
                  position={[0, -0.86, 0]}
                  fontSize={0.07}
                  color={proj.color}
                  anchorX="center"
                  maxWidth={1.3}
                  textAlign="center"
                >
                  {proj.backDetails.skills}
                </Text>
              </group>
            </group>

            {/* Dashed Rotating Action Ring on Hover */}
            <CardActionRing
              isVisible={isHovered}
              color={proj.color}
              points={cardCirclePoints}
              isFlipped={isFlipped}
            />

            {/* Subtle card shadow backing glow */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.75, 2.45]} />
              <meshBasicMaterial
                color={proj.color}
                transparent={true}
                opacity={isHovered ? 0.15 : 0.04}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Invisible Raycast Collider Plane for buttery-smooth card hover/click interaction */}
            <mesh
              position={[0, 0, 0.025]}
              onClick={(e) => handleCardClick(proj.id, index, e)}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredCard(proj.id);
              }}
              onPointerOut={(e) => {
                setHoveredCard(null);
              }}
            >
              <planeGeometry args={[1.7, 2.4]} />
              <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
            </mesh>

          </group>
        );
      })}
    </group>
  );
}
