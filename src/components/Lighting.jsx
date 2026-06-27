import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Lighting({ activeZone }) {
  const ambientRef = useRef();
  const keyLightRef = useRef();
  const goldLightRef = useRef();
  const portalLightRef = useRef();

  // Dynamic light targets based on active zone
  const getLightTargets = (zone) => {
    switch (zone) {
      case 'neev':
        // Zone 4: Darkened, dramatic theater room lighting
        return {
          ambient: 0.05,
          key: 0.2,
          coreGold: 0.2,
          portalGold: 0.0
        };
      case 'portal':
        // Zone 5: Tech-terminal lighting with local golden point light
        return {
          ambient: 0.1,
          key: 1.0,
          coreGold: 0.1,
          portalGold: 1.5
        };
      case 'projects':
        // Zone 3: Balanced gallery lighting
        return {
          ambient: 0.12,
          key: 1.4,
          coreGold: 0.4,
          portalGold: 0.0
        };
      default:
        // Zone 1 & 2: Primary rich DSLR lighting
        return {
          ambient: 0.16,
          key: 1.8,
          coreGold: 1.2,
          portalGold: 0.0
        };
    }
  };

  // Interpolate light intensities for cinematic transitions
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targets = getLightTargets(activeZone);

    // Lerp Ambient Light Intensity
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targets.ambient,
        0.05
      );
    }

    // Lerp Directional Key Light Intensity
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        keyLightRef.current.intensity,
        targets.key,
        0.05
      );
    }

    // Pulse and Lerp Core Gold Point Light (Zone 1 core)
    if (goldLightRef.current) {
      const pulse = 1.0 + Math.sin(time * 2) * 0.25;
      const baseIntensity = THREE.MathUtils.lerp(
        goldLightRef.current.intensity,
        targets.coreGold,
        0.05
      );
      // Only apply pulse when not completely dimmed
      goldLightRef.current.intensity = baseIntensity * (baseIntensity > 0.3 ? pulse : 1.0);
    }

    // Pulse and Lerp Portal Gold Point Light (Zone 5 contact form)
    if (portalLightRef.current) {
      const pulse = 1.0 + Math.cos(time * 1.5) * 0.15;
      const baseIntensity = THREE.MathUtils.lerp(
        portalLightRef.current.intensity,
        targets.portalGold,
        0.05
      );
      portalLightRef.current.intensity = baseIntensity * (baseIntensity > 0.3 ? pulse : 1.0);
    }
  });

  return (
    <group>
      {/* 1. Dynamic Ambient Light */}
      <ambientLight ref={ambientRef} intensity={0.16} />

      {/* 2. Dynamic Cyan Key Light (front-right-top) */}
      <directionalLight
        ref={keyLightRef}
        position={[8, 5, 8]}
        intensity={1.8}
        color="#b0f0ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 3. Static DSLR Spotlights (situated behind for gorgeous edge backlighting) */}
      {/* Electric Cyan DSLR Rim Light (back-right-top) */}
      <spotLight
        position={[-10, 8, -10]}
        target-position={[0, 0, 0]}
        intensity={6.0}
        color="#00f0ff"
        angle={0.6}
        penumbra={0.8}
        distance={35}
      />

      {/* Liquid Gold DSLR Rim Light (back-left-bottom) */}
      <spotLight
        position={[10, -5, -8]}
        target-position={[0, 0, 0]}
        intensity={4.5}
        color="#ffd700"
        angle={0.8}
        penumbra={0.9}
        distance={35}
      />

      {/* 4. Dynamic Pulsing Golden Core Light (Zone 1 core) */}
      <pointLight
        ref={goldLightRef}
        position={[0, 0, 0]}
        intensity={1.2}
        distance={12}
        color="#ffa000"
        decay={2}
      />

      {/* 5. Dynamic Pulsing Golden Portal Light (Zone 5 contact form) */}
      <pointLight
        ref={portalLightRef}
        position={[0, -20, 0]}
        intensity={0.0}
        distance={10}
        color="#ffa000"
        decay={1.8}
      />

      {/* Fill light to soften harsh contrast */}
      <directionalLight
        position={[-5, -2, 5]}
        intensity={0.4}
        color="#406080"
      />
    </group>
  );
}
