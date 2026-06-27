import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BackgroundParticles() {
  const starsRef = useRef();
  const dustRef = useRef();

  // 1. Distant static/slow stars (1500 points)
  const [starPositions] = useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      // Distribute randomly in a large sphere shell
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return [positions];
  }, []);

  // 2. Closer drifting cosmic dust (300 points)
  const [dustPositions, dustSpeeds, dustColors] = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const cyan = new THREE.Color('#00f0ff');
    const gold = new THREE.Color('#ffd700');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Box volume around the scene
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Random drift speed vector
      speeds[i * 3] = (Math.random() - 0.5) * 0.02;
      speeds[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Color distribution: 40% cyan, 45% gold, 15% white
      const r = Math.random();
      let color = white;
      if (r < 0.4) {
        color = cyan;
      } else if (r < 0.85) {
        color = gold;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, speeds, colors];
  }, []);

  // Animate particles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow rotation of distant stars
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = time * 0.005;
    }

    // Drift and wrap-around of cosmic dust
    if (dustRef.current && dustRef.current.geometry && dustRef.current.geometry.attributes && dustRef.current.geometry.attributes.position) {
      const posAttr = dustRef.current.geometry.attributes.position;
      const positions = posAttr.array;
      if (positions) {
        for (let i = 0; i < 300; i++) {
          // Apply drift speed
          positions[i * 3] += dustSpeeds[i * 3] * 0.1;
          positions[i * 3 + 1] += dustSpeeds[i * 3 + 1] * 0.1;
          positions[i * 3 + 2] += dustSpeeds[i * 3 + 2] * 0.1;

          // Wrap around boundaries
          const limit = 15;
          if (positions[i * 3] > limit) positions[i * 3] = -limit;
          if (positions[i * 3] < -limit) positions[i * 3] = limit;
          if (positions[i * 3 + 1] > limit) positions[i * 3 + 1] = -limit;
          if (positions[i * 3 + 1] < -limit) positions[i * 3 + 1] = limit;
          if (positions[i * 3 + 2] > limit) positions[i * 3 + 2] = -limit;
          if (positions[i * 3 + 2] < -limit) positions[i * 3 + 2] = limit;
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.08}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>

      {/* Cosmic Dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[dustColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
