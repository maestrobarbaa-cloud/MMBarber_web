"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TrafficLightProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isEastWest?: boolean; // Determines the phase offset for the intersection
}

  export function TrafficLight({ position, rotation = [0, 0, 0], isEastWest = false }: TrafficLightProps) {
    const redRef = useRef<THREE.MeshStandardMaterial>(null);
    const yellowRef = useRef<THREE.MeshStandardMaterial>(null);
    const greenRef = useRef<THREE.MeshStandardMaterial>(null);
  
    // Vypočítáme offset tak, aby zelená vlna postupovala městem
    // Zpoždění je odvozeno od X/Z souřadnic, abyste "chytali zelenou"
    const waveOffset = useMemo(() => {
      return (Math.abs(position[0]) + Math.abs(position[2])) / 10;
    }, [position]);
  
    useFrame(({ clock }) => {
      if (!redRef.current || !yellowRef.current || !greenRef.current) return;
  
      const t = clock.getElapsedTime();
      // Cyklus trvá 20 vteřin.
      // Pro křižovatky (Sever-Jih vs Východ-Západ) otočíme fázi o 10 vteřin (polovina cyklu).
      const cycleDuration = 20;
      const phaseOffset = isEastWest ? cycleDuration / 2 : 0;
      
      // Globální čas posunutý o zelenou vlnu a fázi křižovatky
      const timeInCycle = (t + waveOffset + phaseOffset) % cycleDuration;
  
      let r = 0.1, y = 0.1, g = 0.1;
  
      // Fáze (0-9: Červená, 9-10: Červená+Oranžová, 10-18: Zelená, 18-20: Oranžová)
      if (timeInCycle < 9) {
        r = 3; // Červená svítí
      } else if (timeInCycle < 10) {
        r = 3; y = 3; // Červená + Oranžová
      } else if (timeInCycle < 18) {
        g = 3; // Zelená svítí
      } else {
        y = 3; // Oranžová (příprava na červenou)
      }
  
      // Aplikace emisivity
      redRef.current.emissiveIntensity = r;
      yellowRef.current.emissiveIntensity = y;
      greenRef.current.emissiveIntensity = g;
    });
  
    return (
      <group position={position} rotation={rotation}>
        {/* Sloup */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 5]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.4} />
        </mesh>
        
        {/* Box na světla */}
        <mesh position={[0.5, 4.5, 0]} castShadow>
          <boxGeometry args={[1, 1.5, 0.4]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.5, 4.5, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#222" />
        </mesh>

      {/* Světla */}
      {/* Červená */}
      <mesh position={[0.5, 5.0, 0.21]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial ref={redRef} color="#ff0000" emissive="#ff0000" emissiveIntensity={0.1} toneMapped={false} />
      </mesh>
      {/* Oranžová */}
      <mesh position={[0.5, 4.5, 0.21]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial ref={yellowRef} color="#ff9900" emissive="#ff9900" emissiveIntensity={0.1} toneMapped={false} />
      </mesh>
      {/* Zelená */}
      <mesh position={[0.5, 4.0, 0.21]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial ref={greenRef} color="#00ff00" emissive="#00ff00" emissiveIntensity={0.1} toneMapped={false} />
      </mesh>
    </group>
  );
}
