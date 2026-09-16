import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '@/hooks/useTranslation';

// --- DATA STRUCTURE ---
const NUM_SEGMENTS = 80;
export const dnaFragments = Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
  const seq1 = ['ATCG', 'GCTA', 'CGAT', 'TAGC'][i % 4];
  const seq2 = ['GCTA', 'ATCG', 'TAGC', 'CGAT'][(i + 1) % 4];
  return {
    id: `fragment_${i + 1}`,
    index: i,
    sequence: `${seq1}${seq2}`,
    label: `SEQ ${(i + 1).toString().padStart(2, '0')}`,
    desc: `Genetic information / DNA fragment ${i + 1}`,
  };
});

// --- HELIX LOGIC ---
const radius = 3.5;
const height = 70;
const turns = 5.5;

interface DNAProps {
  isBloodMode: boolean;
  isNoirMode: boolean;
}

// Singular interactive Base Pair component
function BasePair({ 
  fragment, 
  y, 
  angle, 
  isActive, 
  isHovered, 
  onHover, 
  onClick, 
  themeColor,
  hoverThemeColor
}: { 
  fragment: any, 
  y: number, 
  angle: number, 
  isActive: boolean, 
  isHovered: boolean, 
  onHover: (id: string | null) => void,
  onClick: (id: string, yPos: number) => void,
  themeColor: string,
  hoverThemeColor: string
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const diamond1Ref = useRef<THREE.Mesh>(null);
  const diamond2Ref = useRef<THREE.Mesh>(null);
  const { lang } = useTranslation();

  const x1 = Math.cos(angle) * radius;
  const z1 = Math.sin(angle) * radius;
  const x2 = Math.cos(angle + Math.PI) * radius;
  const z2 = Math.sin(angle + Math.PI) * radius;

  // Animation for scale and color
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isActive ? 1.6 : (isHovered ? 1.3 : 1.0);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Default is bright theme color. On hover/active, switch to hoverThemeColor.
      const baseColor = new THREE.Color(themeColor);
      const hoverColor = new THREE.Color(hoverThemeColor);
      const targetColor = (isActive || isHovered) ? hoverColor : baseColor;
      
      const applyMaterial = (mesh: THREE.Mesh | null) => {
        if (!mesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.lerp(targetColor, 0.1);
        mat.emissive.lerp(targetColor, 0.1);
        mat.emissiveIntensity = isActive ? 1.0 : (isHovered ? 0.6 : 0.8);
      };
      
      applyMaterial(meshRef.current);
      applyMaterial(diamond1Ref.current);
      applyMaterial(diamond2Ref.current);
    }
  });

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {/* Rung line */}
      <mesh position={[0, 0, 0]} rotation={[0, -angle, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, radius * 2, 8]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.2} transparent opacity={0.6} />
      </mesh>

      {/* Backbone diamonds */}
      <mesh ref={diamond1Ref} position={[x1, 0, z1]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={diamond2Ref} position={[x2, 0, z2]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} />
      </mesh>

      {/* Central Interactive Node */}
      <mesh 
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(fragment.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { onHover(null); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onClick(fragment.id, y); }}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={themeColor} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* HTML Overlay for UI */}
      {isActive && (
        <Html position={[1.5, 0, 0]} center zIndexRange={[100, 0]}>
          <div className="flex items-center">
            {/* Connecting Line */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-current" style={{ color: themeColor }} />
            
            {/* Detail Panel */}
            <div 
              className="bg-black/90 backdrop-blur-md border p-4 shadow-2xl min-w-[200px]"
              style={{ borderColor: themeColor, boxShadow: `0 0 20px ${themeColor}40` }}
            >
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1 opacity-70" style={{ color: themeColor }}>
                {fragment.label}
              </div>
              <div className="text-lg font-mono font-black text-white mb-2 tracking-[0.2em]">
                {fragment.sequence}
              </div>
              <div className="text-xs font-sans text-white/70">
                {fragment.desc}
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Scene Component containing the Helix and Camera logic
function HelixScene({ isBloodMode, isNoirMode }: DNAProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraControlsRef = useRef<CameraControls>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const themeColor = isBloodMode ? '#C8102E' : isNoirMode ? '#ffffff' : '#C5A059';
  const hoverThemeColor = isBloodMode ? '#6a0919' : isNoirMode ? '#666666' : '#6b542a';

  // Auto-rotation logic
  useFrame((state, delta) => {
    if (groupRef.current && !activeId) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const handleNodeClick = (id: string, yPos: number) => {
    setActiveId(id);
    if (cameraControlsRef.current) {
      // Zoom and center on the clicked node (rotated by -90deg on Z, so local Y becomes global X)
      cameraControlsRef.current.setLookAt(
        yPos, -4, 11, // camera position
        yPos, 0, 0, // target position
        true // animate
      );
    }
  };

  const handleBackgroundClick = () => {
    if (activeId) {
      setActiveId(null);
      if (cameraControlsRef.current) {
        // Reset camera
        cameraControlsRef.current.setLookAt(
          0, 0, 35, 
          0, 0, 0, 
          true
        );
      }
    }
  };

  return (
    <>
      <CameraControls ref={cameraControlsRef} makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={themeColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

      {/* Invisible background plane to detect clicks outside */}
      <mesh visible={false} position={[0,0,0]} onClick={handleBackgroundClick}>
        <sphereGeometry args={[100, 16, 16]} />
        <meshBasicMaterial side={THREE.BackSide} />
      </mesh>

      <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {dnaFragments.map((fragment, i) => {
          const y = (i / NUM_SEGMENTS) * height - (height / 2);
          const angle = (i / NUM_SEGMENTS) * turns * Math.PI * 2;

          return (
            <BasePair 
              key={fragment.id}
              fragment={fragment}
              y={y}
              angle={angle}
              isActive={activeId === fragment.id}
              isHovered={hoveredId === fragment.id}
              onHover={setHoveredId}
              onClick={handleNodeClick}
              themeColor={themeColor}
              hoverThemeColor={hoverThemeColor}
            />
          );
        })}
      </group>
    </>
  );
}

// Main Export Component
export function AnimusDNA3D({ isBloodMode, isNoirMode }: DNAProps) {
  return (
    <div className="w-full h-[500px] relative flex flex-col items-center">
      {/* UI Overlay Headers */}
      <div className="absolute top-16 md:top-24 left-4 z-10 pointer-events-none">
        <h2 className="text-xl font-black tracking-[0.3em] uppercase" style={{ color: isBloodMode ? '#C8102E' : isNoirMode ? '#ffffff' : '#C5A059' }}>
          DNA EXPLORER
        </h2>
        <p className="text-xs font-mono text-white/50 tracking-widest uppercase mt-1">
          Explore the genetic structure
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] md:text-xs font-mono text-white/30 tracking-widest uppercase">
          Hover or click a fragment to explore
        </p>
      </div>

      {/* 3D Canvas */}
      <div 
        className="absolute h-full z-0 pointer-events-auto"
        style={{ width: '160%', left: '-30%', WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
      >
        <Canvas camera={{ position: [0, 0, 35], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <HelixScene isBloodMode={isBloodMode} isNoirMode={isNoirMode} />
        </Canvas>
      </div>
    </div>
  );
}
