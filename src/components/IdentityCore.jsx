import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export function IdentityCore({ isSelected, onSelect }) {
  const coreRef = useRef();
  const innerCoreRef = useRef();
  const outerShellRef = useRef();
  const ringRef = useRef();
  
  const [hovered, setHovered] = useState(false);

  // Precompute circle coordinates for the dashed HUD ring on the X-Z plane
  const circlePoints = useMemo(() => {
    const points = [];
    const radius = 1.8;
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      points.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
    }
    return points;
  }, []);

  // Animate the core rotation and floating
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.12;
      coreRef.current.rotation.x = time * 0.06;
      coreRef.current.position.y = 0;
      
      // Pulse scale if selected or hovered
      const targetScale = isSelected ? 1.15 : hovered ? 1.08 : 1.0;
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.z = -time * 0.25;
      // Pulse glow
      innerCoreRef.current.scale.setScalar(0.7 + Math.sin(time * 2.5) * 0.05);
    }

    if (outerShellRef.current) {
      outerShellRef.current.rotation.y = -time * 0.04;
    }

    // Spin the dashed HUD action ring
    if (ringRef.current) {
      ringRef.current.rotation.y = time * 0.35;
    }
  });

  // Handler for core clicking
  const handleCoreClick = (e) => {
    e.stopPropagation();
    onSelect('identity');
  };

  // 1. Geodesic Crystalline Core Materials (Refraction & Chrome)
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: '#00f0ff',
    emissive: '#002030',
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.95, // Deep glass refraction
    thickness: 2.0, // Refraction depth
    ior: 1.55, // Index of refraction
    transparent: true,
    opacity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const wireframeMaterial = new THREE.MeshStandardMaterial({
    color: '#00f0ff',
    emissive: '#00f0ff',
    emissiveIntensity: hovered ? 1.2 : 0.4,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: '#ffd700',
    roughness: 0.08,
    metalness: 0.95,
  });

  const neonCyanMaterial = new THREE.MeshStandardMaterial({
    color: '#00f0ff',
    emissive: '#00f0ff',
    emissiveIntensity: 1.5,
    roughness: 0.1,
  });

  return (
    <group position={[0, 0, 0]}>
      
      {/* Crystalline Avatar Core (Zone 1) - Visual Geometry */}
      <group ref={coreRef}>
        {/* Inner Liquid Gold Sphere (Core Center) */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[0.7, 2]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#b8860b"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Middle Chrome Gyroscope Rings */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.04, 16, 100]} />
            <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.95, 0.04, 16, 100]} />
            <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* Outer Crystalline Geodesic Glass Shell */}
        <mesh ref={outerShellRef}>
          <icosahedronGeometry args={[1.35, 2]} />
          <primitive object={coreMaterial} attach="material" />
        </mesh>

        {/* Outer Emissive Wireframe for Neon Edge-Lighting */}
        <mesh>
          <icosahedronGeometry args={[1.36, 2]} />
          <primitive object={wireframeMaterial} attach="material" />
        </mesh>

        {/* Tiny floating satellite nodes close to the core */}
        <mesh position={[1.5, 0.5, -0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
        <mesh position={[-1.2, -0.8, 0.8]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <primitive object={neonCyanMaterial} attach="material" />
        </mesh>
      </group>

      {/* Invisible Raycast Collider Sphere for buttery-smooth, high-performance mouse interactions */}
      <mesh
        onClick={handleCoreClick}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHovered(true); 
        }}
        onPointerOut={() => { 
          setHovered(false); 
        }}
      >
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
      </mesh>

      {/* Floating HUD Label & Connective Line */}
      <Billboard position={[0, 0, 0]}>
        <Line
          points={[[0, 1.35, 0], [0, 1.65, 0]]}
          color="#00f0ff"
          lineWidth={1}
          transparent
          opacity={0.5}
        />
        <Text
          position={[0, 1.82, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          [ 01 // THE NEXUS : IDENTITY ]
        </Text>
      </Billboard>

      {/* Dashed Rotating Action Ring & Prompt */}
      <group position={[0, 0, 0]} visible={hovered || isSelected}>
        <Line
          ref={ringRef}
          points={circlePoints}
          color={hovered ? "#ffd700" : "#00f0ff"} // Liquid Gold on hover, Cyan on select/close
          lineWidth={1.2}
          dashed
          dashScale={1.5}
          dashSize={0.12}
          gapSize={0.08}
          transparent
          opacity={0.8}
        />
        
        <Billboard position={[0, -2.1, 0]}>
          <Text
            fontSize={0.085}
            color={hovered ? "#ffd700" : "#00f0ff"}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            {isSelected ? "> CLICK TO EXPAND <" : "> INITIALIZE SEQUENCE <"}
          </Text>
        </Billboard>
      </group>

    </group>
  );
}
