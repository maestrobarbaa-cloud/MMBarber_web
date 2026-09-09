"use client";

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

interface CollectibleItem {
  id: number;
  position: [number, number, number];
}

export function Collectibles({ onCollect }: { onCollect: () => void }) {
  const [items, setItems] = useState<CollectibleItem[]>(() => {
    const initialItems: CollectibleItem[] = [];
    for (let i = 0; i < 20; i++) {
      initialItems.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 100,
          1,
          (Math.random() - 0.5) * 100
        ]
      });
    }
    return initialItems;
  });

  const meshRef = useRef<THREE.InstancedMesh>(null);

  const handleIntersect = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onCollect();
  };

  return (
    <>
      {items.map((item) => (
        <CollectibleCoin key={item.id} position={item.position} onCollect={() => handleIntersect(item.id)} />
      ))}
    </>
  );
}

function CollectibleCoin({ position, onCollect }: { position: [number, number, number], onCollect: () => void }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.05;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <RigidBody 
      type="fixed" 
      colliders="ball" 
      sensor 
      onIntersectionEnter={() => onCollect()}
      position={position}
    >
      <mesh ref={ref} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="gold" metalness={1} roughness={0.1} />
      </mesh>
    </RigidBody>
  );
}
