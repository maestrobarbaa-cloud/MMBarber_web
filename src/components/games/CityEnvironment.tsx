"use client";

import { useMemo, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useTexture, TransformControls } from "@react-three/drei";
import * as THREE from "three";

import { TrafficLight } from "./TrafficLight";
import { useEditor, BuildingData, PropData } from "./EditorContext";

function EditableBuilding({ b, bTex }: { b: BuildingData; bTex: THREE.Texture }) {
  const { isEditMode, selectedId, setSelectedId, updateBuilding } = useEditor();
  const groupRef = useRef<THREE.Group>(null!);
  
  const isSelected = isEditMode && selectedId === b.id;

  const content = (
    <group 
      ref={groupRef}
      position={b.position} 
      rotation={[0, b.rotationY || 0, 0]}
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          setSelectedId(b.id);
        }
      }}
    >
      {/* Vykreslení těla budovy na základě typu */}
      {b.type === 'cylinder' ? (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[Math.max(b.args[0], b.args[2]) / 2, Math.max(b.args[0], b.args[2]) / 2, b.args[1], 16]} />
          <meshStandardMaterial map={bTex} color={b.color} roughness={0.6} metalness={0.2} />
        </mesh>
      ) : b.type === 'pyramid' ? (
        <mesh castShadow receiveShadow position={[0, -b.args[1] / 4, 0]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0, Math.max(b.args[0], b.args[2]) / 1.5, b.args[1], 4]} />
          <meshStandardMaterial map={bTex} color={b.color} roughness={0.5} metalness={0.5} />
        </mesh>
      ) : b.type === 'factory' ? (
        <group>
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 4, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[-b.args[0] / 4, b.args[1] / 4, 0]}>
            <cylinderGeometry args={[b.args[0] / 10, b.args[0] / 8, b.args[1] / 1.5, 8]} />
            <meshStandardMaterial color="#333333" roughness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[b.args[0] / 4, b.args[1] / 4, 0]}>
            <cylinderGeometry args={[b.args[0] / 10, b.args[0] / 8, b.args[1] / 1.5, 8]} />
            <meshStandardMaterial color="#333333" roughness={0.9} />
          </mesh>
        </group>
      ) : b.type === 'bridge' ? (
        <group>
          {/* Mostovka (vozovka) */}
          <mesh castShadow receiveShadow position={[0, b.args[1] / 2 - 1, 0]}>
            <boxGeometry args={[b.args[0], 2, b.args[2]]} />
            <meshStandardMaterial color="#555555" roughness={0.8} />
          </mesh>
          {/* Levý oblouk/zábradlí */}
          <mesh castShadow receiveShadow position={[-b.args[0] / 2 + 1, 0, 0]}>
            <boxGeometry args={[2, b.args[1] + 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.8} />
          </mesh>
          {/* Pravý oblouk/zábradlí */}
          <mesh castShadow receiveShadow position={[b.args[0] / 2 - 1, 0, 0]}>
            <boxGeometry args={[2, b.args[1] + 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.8} />
          </mesh>
        </group>
      ) : b.type === 'mosque' ? (
        <group>
          {/* Hlavní budova */}
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 4, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.8} />
          </mesh>
          {/* Kupole */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <sphereGeometry args={[Math.min(b.args[0], b.args[2]) / 3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#d4af37" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Minarety */}
          {[-1, 1].map((x) => 
            [-1, 1].map((z) => (
              <group key={`${x}-${z}`} position={[x * (b.args[0] / 2 - 2), 0, z * (b.args[2] / 2 - 2)]}>
                <mesh castShadow receiveShadow position={[0, b.args[1] / 2, 0]}>
                  <cylinderGeometry args={[b.args[0]/15, b.args[0]/15, b.args[1], 8]} />
                  <meshStandardMaterial map={bTex} color={b.color} roughness={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, b.args[1] + 1, 0]}>
                  <coneGeometry args={[b.args[0]/10, b.args[1]/4, 8]} />
                  <meshStandardMaterial color="#006633" roughness={0.8} />
                </mesh>
              </group>
            ))
          )}
        </group>
      ) : b.type === 'church' ? (
        <group>
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 4, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.7} />
          </mesh>
          {/* Věž */}
          <mesh castShadow receiveShadow position={[0, b.args[1] / 2, b.args[2] / 2 - 2]}>
            <boxGeometry args={[b.args[0] / 2, b.args[1], b.args[2] / 3]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.7} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, b.args[1] + b.args[1] / 4, b.args[2] / 2 - 2]}>
            <coneGeometry args={[b.args[0] / 2, b.args[1] / 2, 4]} />
            <meshStandardMaterial color="#8b0000" roughness={0.9} />
          </mesh>
        </group>
      ) : b.type === 'aqueduct' ? (
        <group>
          {/* Horní koryto */}
          <mesh castShadow receiveShadow position={[0, b.args[1] / 2 - 1, 0]}>
            <boxGeometry args={[b.args[0], 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.9} />
          </mesh>
          {/* Pilíře a oblouky */}
          {Array.from({ length: Math.floor(b.args[0] / 10) }).map((_, i) => {
            const xOffset = -b.args[0] / 2 + 5 + i * 10;
            return (
              <group key={i} position={[xOffset, -b.args[1] / 4, 0]}>
                <mesh castShadow receiveShadow position={[-2, 0, 0]}>
                  <boxGeometry args={[2, b.args[1] / 2, b.args[2]]} />
                  <meshStandardMaterial map={bTex} color={b.color} roughness={0.9} />
                </mesh>
              </group>
            );
          })}
        </group>
      ) : b.type === 'wall' ? (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[b.args[0], b.args[1], b.args[2]]} />
          <meshStandardMaterial map={bTex} color={b.color} roughness={0.9} />
        </mesh>
      ) : b.type === 'fence' ? (
        <group>
          {/* Sloupky */}
          {Array.from({ length: Math.floor(b.args[0] / 5) }).map((_, i) => {
            const xOffset = -b.args[0] / 2 + i * (b.args[0] / (Math.floor(b.args[0] / 5) - 1 || 1));
            return (
              <mesh key={i} castShadow receiveShadow position={[xOffset, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, b.args[1], 8]} />
                <meshStandardMaterial color="#555" roughness={0.7} metalness={0.8} />
              </mesh>
            );
          })}
          {/* Pletivo/Desky */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] - 0.5, 0.1]} />
            <meshStandardMaterial color={b.color} transparent opacity={0.5} wireframe={true} />
          </mesh>
        </group>
      ) : b.type === 'parking_lot' ? (
        <group>
          <mesh receiveShadow position={[0, -b.args[1] / 2 + 0.1, 0]}>
            <boxGeometry args={[b.args[0], 0.2, b.args[2]]} />
            <meshStandardMaterial color="#333333" roughness={0.9} />
          </mesh>
          {/* Čáry parkoviště */}
          {Array.from({ length: Math.floor(b.args[0] / 4) }).map((_, i) => {
            const xOffset = -b.args[0] / 2 + 2 + i * 4;
            return (
              <mesh key={i} position={[xOffset, -b.args[1] / 2 + 0.21, 0]}>
                <planeGeometry args={[0.2, b.args[2] - 4]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            );
          })}
        </group>
      ) : b.type === 'mall' ? (
        <group>
          {/* Hlavní budova nákupního centra */}
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 4, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.5} />
          </mesh>
          {/* Skleněný vstup / Atrium */}
          <mesh castShadow receiveShadow position={[0, b.args[1] / 4, b.args[2] / 2 - 2]}>
            <boxGeometry args={[b.args[0] / 2, b.args[1] / 2, 4]} />
            <meshStandardMaterial color="#88ccff" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, b.args[1] / 2, b.args[2] / 2 - 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[b.args[0] / 4, b.args[0] / 4, 4, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#88ccff" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      ) : b.type === 'flowerbed' ? (
        <group>
          {/* Hlína / obrubník */}
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 2 + 0.2, 0]}>
            <boxGeometry args={[b.args[0], 0.4, b.args[2]]} />
            <meshStandardMaterial color="#4a3b2b" roughness={0.9} />
          </mesh>
          {/* Květiny (náhodně rozeseté) */}
          {Array.from({ length: Math.min(50, Math.floor((b.args[0] * b.args[2]) / 4)) }).map((_, i) => {
            const x = (Math.random() - 0.5) * (b.args[0] - 1);
            const z = (Math.random() - 0.5) * (b.args[2] - 1);
            const colors = ['#ff4444', '#ffff44', '#ff44ff', '#4444ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <mesh key={i} position={[x, -b.args[1] / 2 + 0.5, z]}>
                <sphereGeometry args={[0.3 + Math.random() * 0.2, 8, 8]} />
                <meshStandardMaterial color={color} roughness={0.8} />
              </mesh>
            );
          })}
        </group>
      ) : b.type === 'water' ? (
        <mesh receiveShadow position={[0, -b.args[1] / 4, 0]}>
          <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
          <meshStandardMaterial color="#0055ff" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
        </mesh>
      ) : b.type === 'grass_platform' ? (
        <mesh receiveShadow castShadow position={[0, -b.args[1] / 4, 0]}>
          <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
          <meshStandardMaterial color="#3b7d2f" roughness={1.0} />
        </mesh>
      ) : b.type === 'dirt_platform' ? (
        <mesh receiveShadow castShadow position={[0, -b.args[1] / 4, 0]}>
          <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
          <meshStandardMaterial color="#5e482b" roughness={1.0} />
        </mesh>
      ) : b.type === 'hill_ramp' ? (
        <mesh receiveShadow castShadow position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(b.args[0], b.args[2]) / 1.4, b.args[1], 4]} />
          <meshStandardMaterial color="#3b7d2f" roughness={1.0} />
        </mesh>
      ) : b.type === 'family_house' ? (
        <group>
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 4, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] / 2, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, b.args[1] / 4, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[Math.max(b.args[0], b.args[2]) / 1.5, b.args[1] / 2, 4]} />
            <meshStandardMaterial color="#8b0000" roughness={0.9} />
          </mesh>
        </group>
      ) : b.type === 'house' ? (
        <group>
          <mesh castShadow receiveShadow position={[0, -b.args[1] / 8, 0]}>
            <boxGeometry args={[b.args[0], b.args[1] * 0.75, b.args[2]]} />
            <meshStandardMaterial map={bTex} color={b.color} roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, b.args[1] / 2.5, 0]}>
            <boxGeometry args={[b.args[0] + 1, 1, b.args[2] + 1]} />
            <meshStandardMaterial color="#333333" roughness={0.9} />
          </mesh>
        </group>
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={b.args} />
          <meshStandardMaterial map={bTex} color={b.color} roughness={0.6} metalness={0.2} />
        </mesh>
      )}
      
      {b.hasNeon && !['house', 'family_house', 'bridge', 'mosque', 'church', 'aqueduct', 'wall', 'fence', 'parking_lot', 'mall', 'flowerbed', 'water', 'grass_platform', 'dirt_platform', 'hill_ramp'].includes(b.type) && (
        <mesh position={[b.args[0] / 2 + 0.1, 0, 0]}>
          <boxGeometry args={[0.2, b.neonHeight, 1]} />
          <meshStandardMaterial color={b.neonColor} emissive={b.neonColor} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      )}
    </group>
  );

  // V režimu Editoru vybraný objekt ztrácí fyziku, aby s ním šlo volně hýbat a nebouralo do něj auto
  if (isEditMode && isSelected) {
    return (
      <TransformControls 
        object={groupRef} 
        mode="translate" 
        onMouseUp={(e) => {
          if (groupRef.current) {
             updateBuilding(b.id, { position: groupRef.current.position.toArray() as [number, number, number] });
          }
        }}
      >
        {content}
      </TransformControls>
    );
  }

  const colliderType = ['bridge', 'aqueduct', 'mosque', 'church', 'fence'].includes(b.type) ? 'trimesh' : 'cuboid';

  return (
    <RigidBody type="fixed" colliders={colliderType}>
      {content}
    </RigidBody>
  );
}

function EditableProp({ p }: { p: PropData }) {
  const { isEditMode, selectedId, setSelectedId, updateProp } = useEditor();
  const groupRef = useRef<THREE.Group>(null!);
  
  const isSelected = isEditMode && selectedId === p.id;

  const visuals = (
    <group 
      ref={groupRef}
      position={p.position} 
      rotation={[0, p.rotationY || 0, 0]}
      scale={p.scale}
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          setSelectedId(p.id);
        }
      }}
    >
      {p.type === 'tree' ? (
        <group>
          {/* Kmen jehličnanu */}
          <mesh castShadow receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
            <meshStandardMaterial color="#5c4033" roughness={0.9} />
          </mesh>
          {/* Koruna jehličnanu */}
          <mesh castShadow receiveShadow position={[0, 6, 0]}>
            <coneGeometry args={[3, 6, 8]} />
            <meshStandardMaterial color="#2e8b57" roughness={0.8} />
          </mesh>
        </group>
      ) : p.type === 'tree_oak' ? (
        <group>
          {/* Kmen listnáče */}
          <mesh castShadow receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 4, 8]} />
            <meshStandardMaterial color="#4a3b2b" roughness={0.9} />
          </mesh>
          {/* Koruna listnáče (Koule) */}
          <mesh castShadow receiveShadow position={[0, 5, 0]}>
            <sphereGeometry args={[3, 16, 16]} />
            <meshStandardMaterial color="#3a8e2b" roughness={0.8} />
          </mesh>
        </group>
      ) : p.type === 'bush' ? (
        <group>
          {/* Keř (zploštělá koule u země) */}
          <mesh castShadow receiveShadow position={[0, 1.5, 0]} scale={[1, 0.8, 1]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color="#3a8e2b" roughness={0.9} />
          </mesh>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#3a5f27" roughness={0.9} />
        </mesh>
        </group>
      ) : p.type === 'bench' ? (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[2, 0.1, 0.6]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.8, -0.3]}>
            <boxGeometry args={[2, 0.6, 0.1]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.8, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.6]} />
            <meshStandardMaterial color="#222" roughness={0.6} metalness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.8, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.6]} />
            <meshStandardMaterial color="#222" roughness={0.6} metalness={0.8} />
          </mesh>
        </group>
      ) : p.type === 'streetlamp' ? (
        <group>
          <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 5]} />
            <meshStandardMaterial color="#222" roughness={0.6} metalness={0.8} />
          </mesh>
          <mesh position={[0.4, 4.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.8, 4.7, 0]}>
            <coneGeometry args={[0.2, 0.4, 8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.8, 4.6, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#ffffcc" />
          </mesh>
          <mesh position={[0.8, 4.6, 0]}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color="#ffffcc" emissive="#ffddaa" emissiveIntensity={2} toneMapped={false} transparent opacity={0.6} />
          </mesh>
        </group>
      ) : p.type === 'gazebo' ? (
        <group>
          {/* Base */}
          <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[4, 4, 0.4, 6]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          {/* Pillars */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 6;
            return (
              <mesh key={i} castShadow receiveShadow position={[Math.cos(angle) * 3.5, 2.5, Math.sin(angle) * 3.5]}>
                <cylinderGeometry args={[0.2, 0.2, 5, 8]} />
                <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
              </mesh>
            );
          })}
          {/* Roof */}
          <mesh castShadow receiveShadow position={[0, 6, 0]}>
            <coneGeometry args={[4.5, 3, 6]} />
            <meshStandardMaterial color="#6b4423" roughness={0.8} />
          </mesh>
        </group>
      ) : p.type === 'rock' ? (
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <dodecahedronGeometry args={[2, 1]} />
          <meshStandardMaterial color="#777777" roughness={0.9} />
        </mesh>
      ) : p.type === 'trashbin' ? (
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.35, 1.2, 16]} />
          <meshStandardMaterial color="#2e8b57" roughness={0.7} />
        </mesh>
      ) : p.type === 'billboard' ? (
        <group>
          {/* Sloup */}
          <mesh castShadow receiveShadow position={[0, 4, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 8, 8]} />
            <meshStandardMaterial color="#555555" roughness={0.8} />
          </mesh>
          {/* Deska */}
          <mesh castShadow receiveShadow position={[0, 7, 0.2]}>
            <boxGeometry args={[8, 4, 0.4]} />
            <meshStandardMaterial color="#dddddd" roughness={0.4} />
          </mesh>
        </group>
      ) : (
        <group>
          {/* Fontána - základna */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <cylinderGeometry args={[4, 4, 1, 16]} />
            <meshStandardMaterial color="#aaaaaa" roughness={0.7} />
          </mesh>
          {/* Fontána - voda */}
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[3.8, 3.8, 0.2, 16]} />
            <meshStandardMaterial color="#00aaff" transparent opacity={0.6} roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Fontána - střed */}
          <mesh castShadow receiveShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.8, 1, 3, 8]} />
            <meshStandardMaterial color="#aaaaaa" roughness={0.7} />
          </mesh>
          {/* Vodotrysk */}
          <mesh position={[0, 4.5, 0]}>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#00aaff" transparent opacity={0.4} roughness={0.1} />
          </mesh>
        </group>
      )}
    </group>
  );

  // V režimu Editoru vybraný objekt ztrácí fyziku, aby s ním šlo volně hýbat a nebouralo do něj auto
  if (isEditMode && isSelected) {
    return (
      <TransformControls 
        object={groupRef} 
        mode="translate" 
        onMouseUp={(e) => {
          if (groupRef.current) {
             updateProp(p.id, { position: groupRef.current.position.toArray() as [number, number, number] });
          }
        }}
      >
        {content}
      </TransformControls>
    );
  }

  const colliderType = ['gazebo', 'fountain', 'bench'].includes(p.type) ? 'trimesh' : 'cuboid';

  return (
    <RigidBody type="fixed" colliders={colliderType}>
      {content}
    </RigidBody>
  );
}

export function CityEnvironment() {
  const { buildings, intersections, props, isEditMode, setSelectedId } = useEditor();

  const asphaltTexture = useTexture("/textures/asphalt.jpg");
  const buildingTexture = useTexture("/textures/building.jpg");
  const crosswalkTexture = useTexture("/textures/crosswalk.jpg");

  useMemo(() => {
    asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
    asphaltTexture.repeat.set(25, 25);

    buildingTexture.wrapS = buildingTexture.wrapT = THREE.RepeatWrapping;

    crosswalkTexture.wrapS = crosswalkTexture.wrapT = THREE.RepeatWrapping;
    crosswalkTexture.repeat.set(1, 1);
  }, [asphaltTexture, buildingTexture, crosswalkTexture]);

  // Generujeme silniční pruhy
  const roads = useMemo(() => {
    const lines = [];
    const gridSize = 250;
    const blockSize = 30;

    for (let z = -gridSize; z <= gridSize; z += blockSize) {
      lines.push({ position: [0, -0.48, z] as [number, number, number], args: [gridSize * 2, 0.05, 0.5] as [number, number, number] });
    }
    for (let x = -gridSize; x <= gridSize; x += blockSize) {
      lines.push({ position: [x, -0.48, 0] as [number, number, number], args: [0.5, 0.05, gridSize * 2] as [number, number, number] });
    }
    return lines;
  }, []);

  return (
    <group onPointerMissed={() => isEditMode && setSelectedId(null)}>
      {/* Podlaha */}
      {isEditMode ? (
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[600, 1, 600]} />
          <meshStandardMaterial map={asphaltTexture} roughness={0.9} color="#666666" />
        </mesh>
      ) : (
        <RigidBody type="fixed" friction={1.5}>
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <boxGeometry args={[600, 1, 600]} />
            <meshStandardMaterial map={asphaltTexture} roughness={0.9} color="#666666" />
          </mesh>
        </RigidBody>
      )}

      {/* Silniční čáry */}
      {roads.map((r, i) => (
        <mesh key={`road-${i}`} position={r.position} receiveShadow>
          <boxGeometry args={r.args} />
          <meshStandardMaterial color="#c5a059" roughness={1} opacity={0.5} transparent />
        </mesh>
      ))}

      {/* Semafory a přechody na křižovatkách */}
      {intersections.map((int) => {
        const d = int.lightDistance || 2;
        return (
          <group key={`intersection-${int.id}`}>
            {/* V režimu úprav zobrazíme bod pro možnost výběru křižovatky */}
            {isEditMode && (
              <mesh 
                position={[int.x, 0.1, int.z]} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(int.id);
                }}
              >
                <sphereGeometry args={[1.5, 8, 8]} />
                <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
              </mesh>
            )}
            <mesh position={[int.x, -0.47, int.z]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[14, 14]} />
              <meshStandardMaterial map={crosswalkTexture} transparent opacity={0.8} roughness={0.9} color="#999" />
            </mesh>
            <TrafficLight position={[int.x + d, 0, int.z - d]} rotation={[0, Math.PI, 0]} isEastWest={false} />
            <TrafficLight position={[int.x - d, 0, int.z + d]} rotation={[0, 0, 0]} isEastWest={false} />
            <TrafficLight position={[int.x + d, 0, int.z + d]} rotation={[0, Math.PI / 2, 0]} isEastWest={true} />
            <TrafficLight position={[int.x - d, 0, int.z - d]} rotation={[0, -Math.PI / 2, 0]} isEastWest={true} />
          </group>
        );
      })}

      {/* Budovy řízené z EditorContext */}
      {buildings.map((b) => {
        const bTex = buildingTexture.clone();
        bTex.repeat.set(b.texRepeat[0], b.texRepeat[1]);
        bTex.offset.set(b.texOffset[0], b.texOffset[1]);
        bTex.needsUpdate = true;
        return <EditableBuilding key={b.id} b={b} bTex={bTex} />;
      })}

      {/* Dekorace (Stromy, Fontány) řízené z EditorContext */}
      {props.map((p) => (
        <EditableProp key={p.id} p={p} />
      ))}

      {/* Ohraničení světa (jen Play Mode) */}
      {!isEditMode && (
        <RigidBody type="fixed">
          <mesh position={[0, 20, 300]}><boxGeometry args={[600, 100, 2]} /><meshBasicMaterial visible={false} /></mesh>
          <mesh position={[0, 20, -300]}><boxGeometry args={[600, 100, 2]} /><meshBasicMaterial visible={false} /></mesh>
          <mesh position={[300, 20, 0]}><boxGeometry args={[2, 100, 600]} /><meshBasicMaterial visible={false} /></mesh>
          <mesh position={[-300, 20, 0]}><boxGeometry args={[2, 100, 600]} /><meshBasicMaterial visible={false} /></mesh>
        </RigidBody>
      )}
    </group>
  );
}
