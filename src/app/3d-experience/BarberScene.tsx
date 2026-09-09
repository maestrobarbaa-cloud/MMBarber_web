"use client";

import { useRef, useState, useMemo } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Stars,
  Sparkles,
  ContactShadows,
} from "@react-three/drei";

import * as THREE from "three";
import "./experience.css";

// ─── Holografický glitch text ─────────────────────────────────────────────────
function HoloText({ text, position, fontSize = 0.5, color = "#c8a96e" }: {
  text: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    const s = hovered ? 1.1 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[2.4, 0.55, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.5 : 0.6} transparent opacity={0.85} />
      </mesh>
    </Float>
  );
}

// ─── Nůžky — 2 válce jako čepele ─────────────────────────────────────────────
function ScissorsBlade({ angle }: { angle: number }) {
  return (
    <group rotation={[0, 0, angle]}>
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.04, 1.1, 8, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[0.13, 0.04, 8, 16]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Scissors({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [open, setOpen] = useState(false);
  const angleRef = useRef(0.25);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
    groupRef.current.rotation.y += 0.005;
    const target = open ? 0.55 : 0.15;
    angleRef.current += (target - angleRef.current) * 0.08;
  });

  return (
    <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.1}>
      <group ref={groupRef} position={position}
        onClick={() => setOpen(o => !o)}
        onPointerEnter={() => document.body.style.cursor = "pointer"}
        onPointerLeave={() => document.body.style.cursor = "default"}
      >
        <ScissorsBlade angle={-angleRef.current} />
        <ScissorsBlade angle={angleRef.current} />
        {/* Svítivý glow kolem nůžek */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#c8a96e" emissive="#c8a96e" emissiveIntensity={0.3} transparent opacity={0.08} />
        </mesh>
        <pointLight color="#c8a96e" intensity={1.5} distance={2.5} />
      </group>
    </Float>
  );
}

// ─── Holící strojek ───────────────────────────────────────────────────────────
function Trimmer({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);
  const vibeRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    vibeRef.current += 0.2;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 - 0.5;
    groupRef.current.position.x = position[0] + Math.sin(vibeRef.current) * 0.004;
  });

  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.05}>
      <group ref={groupRef} position={position}>
        {/* Tělo strojku */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.22, 1.2, 12, 24]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Logo pruh */}
        <mesh position={[0, 0.1, 0.225]}>
          <boxGeometry args={[0.3, 0.6, 0.01]} />
          <meshStandardMaterial color="#c8a96e" emissive="#c8a96e" emissiveIntensity={0.8} />
        </mesh>
        {/* Čepel */}
        <mesh position={[0, 0.78, 0]}>
          <boxGeometry args={[0.44, 0.12, 0.3]} />
          <meshStandardMaterial color="#888" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Zuby čepele */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[-0.18 + i * 0.06, 0.86, 0.12]}>
            <boxGeometry args={[0.025, 0.07, 0.025]} />
            <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.0} />
          </mesh>
        ))}
        <pointLight color="#c8a96e" intensity={2} distance={2} />
      </group>
    </Float>
  );
}

// ─── Barber křeslo ────────────────────────────────────────────────────────────
function BarberChair({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <Float speed={0.8} floatIntensity={0.3} rotationIntensity={0.05}>
      <group ref={groupRef} position={position} scale={0.55}>
        {/* Základna */}
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.15, 32]} />
          <meshStandardMaterial color="#c8a96e" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Sloup */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
          <meshStandardMaterial color="#888" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Sedák */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.9, 0.15, 0.85]} />
          <meshStandardMaterial color="#8B0000" roughness={0.6} />
        </mesh>
        {/* Opěradlo */}
        <mesh position={[0, 0.55, -0.36]}>
          <boxGeometry args={[0.9, 1.3, 0.12]} />
          <meshStandardMaterial color="#8B0000" roughness={0.6} />
        </mesh>
        {/* Opěrka hlavy */}
        <mesh position={[0, 1.28, -0.3]}>
          <boxGeometry args={[0.5, 0.3, 0.15]} />
          <meshStandardMaterial color="#8B0000" roughness={0.6} />
        </mesh>
        {/* Područky */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.52, 0.18, 0]}>
              <boxGeometry args={[0.1, 0.08, 0.7]} />
              <meshStandardMaterial color="#c8a96e" metalness={0.85} roughness={0.1} />
            </mesh>
          </group>
        ))}
        {/* Nožní opěrka */}
        <mesh position={[0, -0.6, 0.55]}>
          <boxGeometry args={[0.6, 0.08, 0.25]} />
          <meshStandardMaterial color="#c8a96e" metalness={0.85} roughness={0.1} />
        </mesh>
        <pointLight color="#c8a96e" intensity={1.5} distance={3} />
      </group>
    </Float>
  );
}

// ─── Holicí brush ─────────────────────────────────────────────────────────────
function ShavingBrush({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    meshRef.current.rotation.y += 0.008;
  });

  return (
    <Float speed={2} floatIntensity={0.8} rotationIntensity={0.2}>
      <group ref={meshRef} position={position}>
        {/* Rukojeť */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.11, 0.7, 16]} />
          <meshStandardMaterial color="#c8a96e" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Vlákna štětce */}
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const r = 0.08 + Math.random() * 0.06;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * r, 0.15 + Math.random() * 0.25, Math.sin(angle) * r]}
              rotation={[Math.random() * 0.3 - 0.15, 0, Math.random() * 0.3 - 0.15]}
            >
              <cylinderGeometry args={[0.005, 0.002, 0.3 + Math.random() * 0.15, 4]} />
              <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
            </mesh>
          );
        })}
        <pointLight color="#ffffff" intensity={0.8} distance={1.5} />
      </group>
    </Float>
  );
}

// ─── Barber Pole (točící se sloup) ────────────────────────────────────────────
function BarberPole({ position }: { position: [number, number, number] }) {
  const stripeRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (stripeRef.current) {
      stripeRef.current.rotation.y += 0.015;
    }
  });

  return (
    <group position={position}>
      {/* Sloup */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 2.5, 24]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* Točící se spirála */}
      <mesh ref={stripeRef}>
        <torusGeometry args={[0.13, 0.03, 8, 3, Math.PI * 6]} />
        <meshStandardMaterial color="#cc2200" emissive="#cc2200" emissiveIntensity={0.5} />
      </mesh>
      {/* Víčka */}
      {[-1.25, 1.25].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 24]} />
          <meshStandardMaterial color="#c8a96e" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      <pointLight color="#cc2200" intensity={1} distance={2} />
      <pointLight color="#ffffff" intensity={0.5} distance={2} />
    </group>
  );
}

// ─── Plovoucí zlomky / iskry ──────────────────────────────────────────────────
function FloatingParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const geo = useRef<THREE.BufferGeometry>(null!);
  useFrame((state) => {
    if (!geo.current) return;
    const pos = geo.current.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.003;
    }
    geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#c8a96e" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ─── Podlaha (hexagonální vzor přes shader) ───────────────────────────────────
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[30, 30, 1, 1]} />
      <meshStandardMaterial color="#0a0a14" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

// ─── Ambient neonový prstenec ─────────────────────────────────────────────────
function NeonRing({ position, color, radius = 1.5 }: {
  position: [number, number, number];
  color: string;
  radius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.4;
      ref.current.rotation.z = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, 0.025, 8, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

// ─── Kamera intro animace ─────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const t = useRef(0);

  useFrame((state) => {
    t.current += 0.005;
    // Jemný orbit + mírný záblesk při načtení
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 1.5;
    camera.position.y = 3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── UI Overlay ───────────────────────────────────────────────────────────────
function UIOverlay() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: "scissors", label: "Nůžky → Klikni na nůžky" },
    { id: "trimmer", label: "Strojek" },
    { id: "chair", label: "Křeslo" },
  ];

  return (
    <div className="experience-ui">
      <div className="experience-ui__header">
        <div className="experience-ui__logo">MM</div>
        <div className="experience-ui__title">
          <span>BARBER</span>
          <span className="experience-ui__title-accent">STUDIO</span>
        </div>
      </div>

      <div className="experience-ui__hint">
        <span className="experience-ui__hint-icon">🖱️</span>
        Táhni pro rotaci · Scroll pro zoom · Klikni na předměty
      </div>

      <div className="experience-ui__badges">
        <div className="experience-ui__badge">
          <span>✂️</span>
          <span>Premium střihy</span>
        </div>
        <div className="experience-ui__badge">
          <span>💈</span>
          <span>Klasické holení</span>
        </div>
        <div className="experience-ui__badge">
          <span>🏆</span>
          <span>10+ let zkušeností</span>
        </div>
      </div>
    </div>
  );
}

// ─── Hlavní scéna ─────────────────────────────────────────────────────────────
export default function BarberScene() {
  return (
    <div className="experience-container">
      <Canvas
        camera={{ position: [0, 3, 9], fov: 55 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#05050f"]} />
        <fog attach="fog" args={["#05050f", 12, 25]} />

        {/* Světla */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffe4b0" />
        <directionalLight position={[-5, 4, 2]} intensity={0.8} color="#c8a96e" />
        <pointLight position={[-5, 3, -3]} intensity={4} color="#c8a96e" distance={12} />
        <pointLight position={[5, 2, 3]} intensity={3} color="#cc2200" distance={10} />
        <pointLight position={[0, 5, 0]} intensity={2.5} color="#6666ff" distance={15} />
        <pointLight position={[0, 1, 5]} intensity={2} color="#ffffff" distance={8} />

        {/* Environment */}
        <Stars radius={60} depth={50} count={3000} factor={3} fade speed={0.5} />
        <FloatingParticles />

        {/* Sparkles po scéně */}
        <Sparkles count={80} scale={10} size={1.5} speed={0.4} color="#c8a96e" opacity={0.7} />
        <Sparkles count={40} scale={6} size={2} speed={0.2} color="#ffffff" opacity={0.3} />

        {/* Předměty */}
        <Scissors position={[-3.2, 0.5, 0]} />
        <Trimmer position={[0, 0.2, 0]} />
        <BarberChair position={[3.2, 0.3, -0.5]} />
        <ShavingBrush position={[-1.3, -0.5, 2]} />
        <BarberPole position={[1.5, -1, 2.5]} />

        {/* Dekorativní prstence */}
        <NeonRing position={[0, 0.5, 0]} color="#c8a96e" radius={2.5} />
        <NeonRing position={[-3.2, 0.5, 0]} color="#cc2200" radius={0.9} />
        <NeonRing position={[3.2, 0.3, -0.5]} color="#4444ff" radius={1.2} />

        {/* Podlaha */}
        <Floor />
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.6}
          scale={15}
          blur={2.5}
          far={4}
          color="#c8a96e"
        />

        {/* Kamera */}
        <CameraRig />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.4}
          makeDefault
        />
      </Canvas>

      <UIOverlay />
    </div>
  );
}
