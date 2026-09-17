import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '@/hooks/useTranslation';

// --- DATA STRUCTURE ---
const NUM_SEGMENTS = 80;

// Zafixovaný seed pro konzistentní sekce (aby se neměnily při každém re-renderu)
const pseudoRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const dnaSections: { id: string, startIndex: number, endIndex: number, label: string }[] = [];
let currentIdx = 0;
let sectionNum = 1;
let seed = 42;

while (currentIdx < NUM_SEGMENTS) {
  const size = Math.floor(pseudoRandom(seed++) * (10 - 5 + 1)) + 5;
  const endIndex = Math.min(currentIdx + size - 1, NUM_SEGMENTS - 1);
  dnaSections.push({
    id: `section_${sectionNum}`,
    startIndex: currentIdx,
    endIndex,
    label: `SEKCE ${sectionNum.toString().padStart(2, '0')}`
  });
  currentIdx = endIndex + 1;
  sectionNum++;
}

export const dnaFragments = Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
  const seq1 = ['ATCG', 'GCTA', 'CGAT', 'TAGC'][i % 4];
  const seq2 = ['GCTA', 'ATCG', 'TAGC', 'CGAT'][(i + 1) % 4];
  
  const section = dnaSections.find(s => i >= s.startIndex && i <= s.endIndex)!;

  return {
    id: `fragment_${i + 1}`,
    index: i,
    sectionId: section.id,
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
  onClick: (id: string) => void,
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
  useFrame((state, delta) => {
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
    <group 
      ref={groupRef} 
      position={[0, y, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(fragment.sectionId); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { onHover(null); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick(fragment.sectionId); }}
    >
      {/* Neviditelný Hitbox, aby bylo snazší na článek kliknout */}
      <mesh visible={false} position={[0, 0, 0]}>
        <boxGeometry args={[radius * 2.5, 1.5, 2]} />
      </mesh>

      {/* Rung line */}
      <mesh position={[0, 0, 0]} rotation={[0, -angle, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, radius * 2, 8]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.2} transparent opacity={0.6} />
      </mesh>

      {/* Backbone diamonds (Icosahedrons) */}
      <mesh ref={diamond1Ref} position={[x1, 0, z1]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={diamond2Ref} position={[x2, 0, z2]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} />
      </mesh>

      {/* Central Interactive Node (Octahedron) */}
      <mesh 
        ref={meshRef}
        position={[0, 0, 0]}
      >
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={themeColor} roughness={0.2} metalness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// Scene Component containing the Helix and Camera logic
function HelixScene({ isBloodMode, isNoirMode, activeSectionId, setActiveSectionId }: DNAProps & { activeSectionId: string | null, setActiveSectionId: (id: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraControlsRef = useRef<CameraControls>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const themeColor = isBloodMode ? '#C8102E' : isNoirMode ? '#ffffff' : '#C5A059';
  const hoverThemeColor = isBloodMode ? '#6a0919' : isNoirMode ? '#666666' : '#6b542a';

  // Auto-rotation logic
  useFrame((state, delta) => {
    if (groupRef.current && !activeSectionId) {
      // rotateY spins the group around its local Y axis (which is the longitudinal axis of the DNA)
      groupRef.current.rotateY(delta * 0.5);
    }
  });

  const handleNodeClick = (sectionId: string) => {
    setActiveSectionId(sectionId);
    if (cameraControlsRef.current && groupRef.current) {
      // Nalezení sekce a jejích hranic
      const section = dnaSections.find(s => s.id === sectionId);
      if (!section) return;
      
      const midIndex = Math.floor((section.startIndex + section.endIndex) / 2);
      const midY = (midIndex / NUM_SEGMENTS) * height - (height / 2);
      const midAngle = (midIndex / NUM_SEGMENTS) * turns * Math.PI * 2;
      
      // Výpočet lokální pozice středního uzlu
      const localPos = new THREE.Vector3(0, midY, 0);
      
      // Převod na globální pozici vzhledem k groupRef
      const worldPos = localPos.clone().applyMatrix4(groupRef.current.matrixWorld);
      
      // Zůstaneme ve stejné vzdálenosti (35) jako při spuštění, aby kamera zbytečně nezoomovala moc blízko.
      const camX = worldPos.x;
      const camY = 0;
      const camZ = 35; 

      cameraControlsRef.current.setLookAt(
        camX, camY, camZ,       // Pozice kamery
        worldPos.x, 0, 0,       // Kam se kamera dívá (na střed osy v daném X)
        true
      );
    }
  };

  const handleBackgroundClick = () => {
    if (activeSectionId) {
      setActiveSectionId(null);
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
              isActive={activeSectionId === fragment.sectionId}
              isHovered={hoveredSectionId === fragment.sectionId}
              onHover={setHoveredSectionId}
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
  const { lang } = useTranslation();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    const section = dnaSections.find(s => s.id === activeSectionId);
    if (!section) return null;
    return {
      ...section,
      fragments: dnaFragments.slice(section.startIndex, section.endIndex + 1)
    };
  }, [activeSectionId]);

  return (
    <div className="w-full h-[500px] relative flex flex-col items-center">
      {/* UI Overlay Headers */}
      <div className="absolute top-16 md:top-24 left-4 z-10 pointer-events-none">
        <h2 className="text-xl font-black tracking-[0.3em] uppercase" style={{ color: isBloodMode ? '#C8102E' : isNoirMode ? '#ffffff' : '#C5A059' }}>
          {lang === 'cs' ? 'PRŮZKUMNÍK DNA' : 'DNA EXPLORER'}
        </h2>
        <p className="text-xs font-mono text-white/50 tracking-widest uppercase mt-1">
          {lang === 'cs' ? 'Prozkoumat genetickou strukturu' : 'Explore the genetic structure'}
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] md:text-xs font-mono text-white/30 tracking-widest uppercase">
          {lang === 'cs' ? 'Najeďte myší nebo klikněte na fragment' : 'Hover or click a fragment to explore'}
        </p>
      </div>

      <div 
        className="absolute h-full z-0 pointer-events-auto"
        style={{ 
          width: '160%', 
          left: '-30%', 
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)", 
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect"
        }}
      >
        <Canvas camera={{ position: [0, 0, 35], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <HelixScene 
            isBloodMode={isBloodMode} 
            isNoirMode={isNoirMode} 
            activeSectionId={activeSectionId} 
            setActiveSectionId={setActiveSectionId} 
          />
        </Canvas>
      </div>

      {/* Right Side UI Panel for Active Section */}
      {activeSection && (
        <div className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-64 max-h-[80%] overflow-y-auto z-[100] pointer-events-auto p-4 bg-black/80 backdrop-blur-md border rounded shadow-2xl animate-in fade-in slide-in-from-right-8" style={{ borderColor: isBloodMode ? '#C8102E50' : isNoirMode ? '#ffffff50' : '#C5A05950' }}>
          <div className="sticky top-0 bg-black/90 pb-2 mb-4 border-b" style={{ borderColor: isBloodMode ? '#C8102E' : isNoirMode ? '#ffffff' : '#C5A059' }}>
            <h3 className="font-heading font-black tracking-widest uppercase text-sm" style={{ color: isBloodMode ? '#C8102E' : isNoirMode ? '#ffffff' : '#C5A059' }}>
              {activeSection.label.replace('SEKCE', lang === 'cs' ? 'SEKCE' : 'SECTION')}
            </h3>
            <p className="text-[10px] font-mono text-white/50 uppercase mt-1">
              {activeSection.fragments.length} {lang === 'cs' ? 'FRAGMENTŮ' : 'FRAGMENTS'}
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            {activeSection.fragments.map((frag, idx) => (
              <div key={frag.id} className="border-l-2 pl-3" style={{ borderColor: isBloodMode ? '#C8102E30' : isNoirMode ? '#ffffff30' : '#C5A05930' }}>
                <div className="text-[10px] font-mono tracking-widest text-white/40 mb-1">{frag.label}</div>
                <div className="font-mono text-white text-sm tracking-widest">{frag.sequence}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
