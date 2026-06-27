import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// 3D Programmatic Camera Lens Visual Metaphor (Zone 2)
function CameraLensMesh({ isHovered, color }) {
  return (
    <group scale={isHovered ? 1.25 : 1.0}>
      {/* Outer Lens Barrel (Main Casing) */}
      <mesh>
        <cylinderGeometry args={[0.32, 0.32, 0.6, 32]} />
        <meshStandardMaterial color="#0b0c10" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Knurled Focus Ring */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.12, 32]} />
        <meshStandardMaterial color="#1a1c23" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Chrome Accent Rings */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.322, 0.015, 8, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[0.322, 0.015, 8, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Gold Aperture Blades */}
      <group position={[0, 0.24, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.26, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Inner neon glow ring */}
        <mesh position={[0, 0.01, 0]}>
          <torusGeometry args={[0.16, 0.012, 8, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Highly Polished Glass Front Element */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
        <meshPhysicalMaterial
          color="#00443a"
          emissive="#001510"
          roughness={0.02}
          metalness={0.1}
          transmission={0.9}
          thickness={0.2}
          transparent={true}
          opacity={0.85}
          clearcoat={1.0}
        />
      </mesh>

      {/* Back Lens Mount */}
      <mesh position={[0, -0.31, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.03, 32]} />
        <meshStandardMaterial color="#cca43b" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 3D Programmatic Glass Data-Prism Visual Metaphor (Zone 2)
function DataPrismMesh({ isHovered, color }) {
  const prismCoreRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (prismCoreRef.current) {
      prismCoreRef.current.rotation.y = -time * 1.5;
      prismCoreRef.current.rotation.z = time * 0.8;
    }
  });

  return (
    <group scale={isHovered ? 1.25 : 1.0}>
      {/* Pristine Glass Triangular Prism */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.7, 3]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.02}
          metalness={0.1}
          transmission={0.98}
          ior={1.65}
          thickness={0.8}
          transparent={true}
          opacity={0.9}
          clearcoat={1.0}
        />
      </mesh>

      {/* Emissive Prism Outlines */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.385, 0.385, 0.71, 3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 1.2 : 0.3}
          wireframe={true}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Glowing Golden Internal Data Core */}
      <group ref={prismCoreRef} position={[0, 0, 0]}>
        <mesh>
          <octahedronGeometry args={[0.14]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Orbiting data satellites */}
        <mesh position={[0.2, 0.1, -0.1]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[-0.15, -0.15, 0.2]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

// Modular Action Ring for spinning dashed planetary HUD rings around orbiting nodes
function NodeActionRing({ isVisible, color, points, hovered }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current && isVisible) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 1.1;
    }
  });

  return (
    <group visible={isVisible}>
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
        opacity={0.75}
      />
      
      {/* Tiny elegant prompt floating below the node casing */}
      <Billboard position={[0, -0.8, 0]}>
        <Text
          fontSize={0.072}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {hovered ? "> EXPAND CHRONICLE <" : "> CLICK TO VIEW <"}
        </Text>
      </Billboard>
    </group>
  );
}

export function ExperienceOrbit({ activeNode, onSelect, experiencesData }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Precompute circle coordinates for the dashed HUD ring around the orbiting nodes
  const nodeCirclePoints = useMemo(() => {
    const points = [];
    const radius = 0.72;
    for (let i = 0; i <= 32; i++) {
      const theta = (i / 32) * Math.PI * 2;
      points.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
    }
    return points;
  }, []);

  // Nodes data - use props if loaded from Supabase, fallback to hardcoded defaults
  const nodesData = useMemo(() => {
    if (experiencesData && experiencesData.length > 0) {
      return experiencesData;
    }
    return [
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
        },
        model_type: 'lens'
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
        },
        model_type: 'prism'
      }
    ];
  }, [experiencesData]);

  // Dynamic references for node animations and angle accumulation
  const nodeRefs = useRef({});
  const angleRefs = useRef({});

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    nodesData.forEach((node) => {
      const ref = nodeRefs.current[node.id];
      if (ref) {
        const currentSpeed = hoveredNode === node.id ? 0.005 : node.speed;
        
        // Dynamically initialize the orbital angle accumulator if not already set
        if (angleRefs.current[node.id] === undefined) {
          angleRefs.current[node.id] = node.phase || 0;
        }

        angleRefs.current[node.id] += delta * currentSpeed;
        const angle = angleRefs.current[node.id];

        // Position on a flat 2D plane ring (X-Z)
        const x = Math.cos(angle) * node.radius;
        const z = Math.sin(angle) * node.radius;
        ref.position.set(x, 0, z);

        // Slow organic rotation of the node itself
        ref.rotation.y = time * 0.3;
      }
    });
  });

  return (
    <group>
      
      {/* 1. Flat Saturn-like Timeline Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[4.74, 4.86, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbit glow rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[4.79, 4.81, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent={true}
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Interactive Metaphor Nodes */}
      {nodesData.map((node) => {
        const isCurrentActive = activeNode?.id === node.id;
        const isHovered = hoveredNode === node.id;

        return (
          <group
            key={node.id}
            ref={(el) => (nodeRefs.current[node.id] = el)}
          >
            {/* Visual Metaphor Meshes based on Model Type */}
            {node.model_type === 'prism' ? (
              <DataPrismMesh isHovered={isHovered} color={node.color} />
            ) : (
              <CameraLensMesh isHovered={isHovered} color={node.color} />
            )}

            {/* CRITICAL FIX: Invisible Solid Sphere Raycast Target (Collider) */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelect('experience', node);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(node.id);
              }}
              onPointerOut={(e) => {
                setHoveredNode(null);
              }}
            >
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
            </mesh>

            {/* Floating HUD Label & Connecting Line (Camera-Facing) */}
            <Billboard position={[0, 0, 0]}>
              <Line
                points={[[0, 0.35, 0], [0, 0.72, 0]]}
                color={node.color}
                lineWidth={1}
                transparent
                opacity={0.5}
              />
              <Text
                position={[0, 0.88, 0]}
                fontSize={0.115}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.12}
              >
                {node.model_type === 'prism' ? '[ 02 // DATA PRISM : EXPERIENCE ]' : '[ 02 // CAMERA LENS : EXPERIENCE ]'}
              </Text>
            </Billboard>

            {/* Dashed Rotating Action Ring & Prompt */}
            <NodeActionRing
              isVisible={isHovered || isCurrentActive}
              color={node.color}
              points={nodeCirclePoints}
              hovered={isHovered}
            />

            {/* Glowing active/hover halo beneath the mesh on the ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
              <ringGeometry args={[0.45, 0.52, 32]} />
              <meshBasicMaterial
                color={node.color}
                transparent={true}
                opacity={isCurrentActive || isHovered ? 0.8 : 0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
              <ringGeometry args={[0, 0.5, 32]} />
              <meshBasicMaterial
                color={node.color}
                transparent={true}
                opacity={isCurrentActive || isHovered ? 0.15 : 0.0}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing spot beacon */}
            <pointLight
              position={[0, 0, 0]}
              intensity={isCurrentActive || isHovered ? 1.5 : 0.2}
              distance={2.5}
              color={node.color}
            />

          </group>
        );
      })}

    </group>
  );
}
