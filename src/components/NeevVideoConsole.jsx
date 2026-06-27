import React, { useState, useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NeevVideoConsole({ activeZone }) {
  const consoleRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const isSelected = activeZone === 'neev';

  // 1. Create a hidden HTML5 video element
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = "/assets/neev-walkthrough.mp4"; // Walkthrough video file
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true; // Required for autoplay in browsers
    vid.playsInline = true;
    return vid;
  });

  // Create VideoTexture once
  const [videoTexture] = useState(() => new THREE.VideoTexture(video));

  // 2. Play/Pause based on whether Zone 4 is active
  useEffect(() => {
    if (isSelected) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay blocked or failed:", err);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }

    // Cleanup on unmount
    return () => {
      video.pause();
    };
  }, [isSelected, video]);

  // Handle Play/Pause Toggle
  const togglePlay = (e) => {
    e.stopPropagation();
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Play failed:", err);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Handle Mute/Unmute Toggle
  const toggleMute = (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Handle Link Click
  const visitLiveSite = (e) => {
    e.stopPropagation();
    window.open("https://neev-career-guidance.netlify.app", "_blank", 'noopener,noreferrer');
  };

  // Animate the console entry, exit, and drift
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (consoleRef.current) {
      if (isSelected) {
        // FIXED: Slide forward to Y = -12.5 to perfectly align with camera Zone 4 height
        const targetPos = new THREE.Vector3(0, -12.4, 3.2);
        consoleRef.current.position.lerp(targetPos, 0.1);
        
        // FIXED: Zero rotation (completely flat and upright) when active to eliminate all slant issues
        consoleRef.current.rotation.set(0, 0, 0);
      } else {
        // Retreat back and down in the void when inactive
        const targetPos = new THREE.Vector3(0, -13.0, -1.0);
        consoleRef.current.position.lerp(targetPos, 0.1);

        // Slow organic zero-gravity drift rotation when inactive
        consoleRef.current.rotation.y = Math.sin(time * 0.4) * 0.03;
        consoleRef.current.rotation.x = Math.cos(time * 0.3) * 0.02;
      }
    }
  });

  return (
    <group ref={consoleRef} position={[0, -13, 0]}>
      
      {/* 1. Massive Sleek Borderless Glass Display Frame */}
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[6.2, 3.5]} />
        <meshPhysicalMaterial
          color="#00121a"
          roughness={0.08}
          metalness={0.1}
          transmission={0.65}
          thickness={1.5}
          transparent={true}
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Electric Cyan Emissive Glowing Border */}
      <mesh position={[0, 0.5, 0.005]}>
        <planeGeometry args={[6.2, 3.5]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.5}
          wireframe={true}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* 3. Floating 3D Video Plane */}
      <mesh position={[0, 0.5, 0.01]} onClick={(e) => e.stopPropagation()}>
        <planeGeometry args={[6.0, 3.375]} /> {/* 16:9 aspect ratio */}
        <meshStandardMaterial
          emissive={new THREE.Color('#ffffff')}
          emissiveMap={videoTexture}
          toneMapped={false}
          roughness={0.05}
          metalness={0.9}
          transparent={true}
          opacity={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle background dim/bloom backing plane */}
      <mesh position={[0, 0.5, -0.15]}>
        <planeGeometry args={[7.2, 4.5]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent={true}
          opacity={0.04}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ================= CONTROLS: FLOATING 3D BUTTONS ================= */}
      <group position={[0, -1.6, 0.2]}>
        
        {/* Play / Pause Glass Capsule */}
        <group
          position={[-1.8, 0, 0]}
          onClick={togglePlay}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredBtn('play'); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHoveredBtn(null); document.body.style.cursor = 'auto'; }}
        >
          <mesh>
            <boxGeometry args={[1.3, 0.45, 0.1]} />
            <meshPhysicalMaterial
              color={hoveredBtn === 'play' ? '#00f0ff' : '#0a151b'}
              transmission={0.9}
              roughness={0.1}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.3, 0.45, 0.1]} />
            <meshBasicMaterial color="#00f0ff" wireframe={true} transparent={true} opacity={0.3} />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.15}
            color={hoveredBtn === 'play' ? '#030305' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </Text>
        </group>

        {/* Mute / Unmute Glass Capsule */}
        <group
          position={[-0.3, 0, 0]}
          onClick={toggleMute}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredBtn('mute'); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHoveredBtn(null); document.body.style.cursor = 'auto'; }}
        >
          <mesh>
            <boxGeometry args={[1.3, 0.45, 0.1]} />
            <meshPhysicalMaterial
              color={hoveredBtn === 'mute' ? '#00f0ff' : '#0a151b'}
              transmission={0.9}
              roughness={0.1}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.3, 0.45, 0.1]} />
            <meshBasicMaterial color="#00f0ff" wireframe={true} transparent={true} opacity={0.3} />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.15}
            color={hoveredBtn === 'mute' ? '#030305' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
          >
            {isMuted ? 'UNMUTE' : 'MUTE'}
          </Text>
        </group>

        {/* Explore Live Platform Glowing Pill Capsule */}
        <group
          position={[1.6, 0, 0]}
          onClick={visitLiveSite}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredBtn('link'); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHoveredBtn(null); document.body.style.cursor = 'auto'; }}
        >
          <mesh>
            <boxGeometry args={[2.2, 0.45, 0.12]} />
            <meshPhysicalMaterial
              color={hoveredBtn === 'link' ? '#ffd700' : '#221d05'}
              emissive={hoveredBtn === 'link' ? '#ffd700' : '#554400'}
              emissiveIntensity={hoveredBtn === 'link' ? 0.8 : 0.2}
              transmission={0.8}
              roughness={0.05}
              metalness={0.2}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[2.2, 0.45, 0.12]} />
            <meshBasicMaterial color="#ffd700" wireframe={true} transparent={true} opacity={0.4} />
          </mesh>
          <Text
            position={[0, 0, 0.07]}
            fontSize={0.14}
            color={hoveredBtn === 'link' ? '#030305' : '#ffd700'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            [ VISIT LIVE SITE ]
          </Text>
        </group>

      </group>

      {/* ================= PROJECT METADATA SUBTITLE ================= */}
      <group position={[0, -2.5, 0.1]}>
        <Text
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          fontWeight="bold"
        >
          NEEV Career Guidance Platform
        </Text>
        <Text
          position={[0, -0.24, 0]}
          fontSize={0.14}
          color="var(--accent-cyan)"
          anchorX="center"
        >
          Full-stack web platform for post-12th Indian students in Tier 2 cities.
        </Text>
      </group>

    </group>
  );
}
