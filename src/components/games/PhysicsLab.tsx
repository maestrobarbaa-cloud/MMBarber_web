"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PhysicsLab() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Návratové tlačítko */}
      <Link 
        href="/3d-lab" 
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          fontFamily: "sans-serif"
        }}
      >
        <ArrowLeft size={18} />
        Zpět do 3D Labu
      </Link>

      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <directionalLight castShadow position={[10, 10, 10]} intensity={1.5} shadow-mapSize={[1024, 1024]} />
          
          <Physics debug>
            {/* Padající kostka */}
            <RigidBody position={[0, 5, 0]} colliders="cuboid">
              <mesh castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </RigidBody>

            {/* Padající koule */}
            <RigidBody position={[0.5, 8, 0.2]} colliders="ball">
              <mesh castShadow>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="yellow" />
              </mesh>
            </RigidBody>

            {/* Podlaha (statická) */}
            <RigidBody type="fixed">
              <mesh receiveShadow position={[0, -1, 0]}>
                <boxGeometry args={[20, 1, 20]} />
                <meshStandardMaterial color="#4ade80" />
              </mesh>
            </RigidBody>
          </Physics>

          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}
