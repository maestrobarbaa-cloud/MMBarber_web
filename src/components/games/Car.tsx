"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { RigidBody, RapierRigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";

export function Car() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const { rapier, world } = useRapier();
  const vehicleController = useRef<any>(null);
  
  // Vizuální reference na kola
  const wheelFL = useRef<THREE.Mesh>(null);
  const wheelFR = useRef<THREE.Mesh>(null);
  const wheelRL = useRef<THREE.Mesh>(null);
  const wheelRR = useRef<THREE.Mesh>(null);
  
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, brake: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": case "arrowup": setKeys((k) => ({ ...k, forward: true })); break;
        case "s": case "arrowdown": setKeys((k) => ({ ...k, backward: true })); break;
        case "a": case "arrowleft": setKeys((k) => ({ ...k, left: true })); break;
        case "d": case "arrowright": setKeys((k) => ({ ...k, right: true })); break;
        case " ": setKeys((k) => ({ ...k, brake: true })); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": case "arrowup": setKeys((k) => ({ ...k, forward: false })); break;
        case "s": case "arrowdown": setKeys((k) => ({ ...k, backward: false })); break;
        case "a": case "arrowleft": setKeys((k) => ({ ...k, left: false })); break;
        case "d": case "arrowright": setKeys((k) => ({ ...k, right: false })); break;
        case " ": setKeys((k) => ({ ...k, brake: false })); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Inicializace Raycast vozidla
  useEffect(() => {
    if (!bodyRef.current) return;
    
    // Vytvoření dynamického kontroléru pro auto
    const controller = world.createVehicleController(bodyRef.current);
    controller.setIndexForwardAxis = 2; // Z axis
    controller.indexUpAxis = 1; // Y axis
    vehicleController.current = controller;
    
    const wheelRadius = 0.3;
    const suspensionRestLength = 0.2;
    const suspensionStiffness = 30;
    const maxSuspensionTravel = 0.3;
    
    // Tlumiče (směr dolů) a Osa kola (směr do strany)
    const suspensionDirection = { x: 0, y: -1, z: 0 };
    const axleDirection = { x: -1, y: 0, z: 0 };

    // Přidání 4 kol (připojené trochu níže pod těžištěm auta, aby karoserie nedrhla o zem)
    // Levá přední (FL)
    controller.addWheel({ x: -1.0, y: -0.3, z: 1.4 }, suspensionDirection, axleDirection, suspensionRestLength, wheelRadius);
    // Pravá přední (FR)
    controller.addWheel({ x: 1.0, y: -0.3, z: 1.4 }, suspensionDirection, axleDirection, suspensionRestLength, wheelRadius);
    // Levá zadní (RL)
    controller.addWheel({ x: -1.0, y: -0.3, z: -1.4 }, suspensionDirection, axleDirection, suspensionRestLength, wheelRadius);
    // Pravá zadní (RR)
    controller.addWheel({ x: 1.0, y: -0.3, z: -1.4 }, suspensionDirection, axleDirection, suspensionRestLength, wheelRadius);

    for (let i = 0; i < 4; i++) {
      controller.setWheelSuspensionStiffness(i, suspensionStiffness);
      controller.setWheelMaxSuspensionTravel(i, maxSuspensionTravel);
      controller.setWheelFrictionSlip(i, 2.5); // Grip pneumatik
    }

    return () => {
      if (vehicleController.current) {
        world.removeVehicleController(vehicleController.current);
        vehicleController.current = null;
      }
    };
  }, [world]);

  const carTexture = useTexture("/textures/vintage_car.jpg");
  const cameraPosition = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!vehicleController.current || !bodyRef.current) return;

    const controller = vehicleController.current;
    
    // Update fyziky vozidla
    controller.updateVehicle(delta);
    
    // Ovládání výkonu motoru
    const engineForce = 40; // Síla motoru (zmenšena, protože váha je 1)
    const maxSteering = 0.5; // Úhel zatáčení
    
    // Pohon na všechna kola (4WD)
    if (keys.forward) {
      controller.setWheelEngineForce(engineForce, 0);
      controller.setWheelEngineForce(engineForce, 1);
      controller.setWheelEngineForce(engineForce, 2);
      controller.setWheelEngineForce(engineForce, 3);
    } else if (keys.backward) {
      controller.setWheelEngineForce(-engineForce / 2, 0);
      controller.setWheelEngineForce(-engineForce / 2, 1);
      controller.setWheelEngineForce(-engineForce / 2, 2);
      controller.setWheelEngineForce(-engineForce / 2, 3);
    } else {
      controller.setWheelEngineForce(0, 0);
      controller.setWheelEngineForce(0, 1);
      controller.setWheelEngineForce(0, 2);
      controller.setWheelEngineForce(0, 3);
    }

    // Brzdy
    const brakeForce = keys.brake ? 300 : (keys.forward || keys.backward ? 0 : 20); // Lehké tření, když nepouštíme plyn
    controller.setWheelBrake(brakeForce, 0);
    controller.setWheelBrake(brakeForce, 1);
    controller.setWheelBrake(brakeForce, 2);
    controller.setWheelBrake(brakeForce, 3);

    // Zatáčení (jen přední kola)
    let steering = 0;
    if (keys.left) steering = maxSteering;
    if (keys.right) steering = -maxSteering;
    
    // Plynulý náběh řízení
    const currentSteering = controller.wheelSteering(0) || 0;
    const newSteering = THREE.MathUtils.lerp(currentSteering, steering, 0.1);
    controller.setWheelSteering(0, newSteering);
    controller.setWheelSteering(1, newSteering);

    // Aktualizace vizuálních pozic kol
    const wheels = [wheelFL, wheelFR, wheelRL, wheelRR];
    for (let i = 0; i < 4; i++) {
      const connection = controller.wheelChassisConnectionPointCs(i);
      const suspension = controller.wheelSuspensionLength(i) || 0;
      const wRot = controller.wheelRotation(i) || 0;
      
      if (wheels[i].current && connection) {
        // Pozice kola lokálně vzhledem k autu (přidáme posun tlumičů)
        wheels[i].current!.position.set(connection.x, connection.y - suspension, connection.z);
        // Rotace kola (kombinace natočení a otáčení kvůli rychlosti)
        wheels[i].current!.rotation.y = i < 2 ? newSteering : 0;
        wheels[i].current!.rotation.x = wRot;
      }
    }

    // --- GUMIČKOVÁ KAMERA (Elastické sledování) ---
    const carPos = bodyRef.current.translation();
    const carRot = bodyRef.current.rotation();
    const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(carRot.x, carRot.y, carRot.z, carRot.w));
    
    // Bod, kam se má kamera ideálně dostat
    const idealOffset = new THREE.Vector3(0, 3, -7).applyEuler(euler);
    const idealPos = new THREE.Vector3(carPos.x, carPos.y, carPos.z).add(idealOffset);
    
    // Pružinová interpolace kamery pro reálnější pocit
    cameraPosition.current.lerp(idealPos, 0.05);
    state.camera.position.copy(cameraPosition.current);
    
    // Kamera kouká kousek před auto
    const lookAtPos = new THREE.Vector3(0, 1, 4).applyEuler(euler).add(new THREE.Vector3(carPos.x, carPos.y, carPos.z));
    state.camera.lookAt(lookAtPos);
  });

  return (
    <RigidBody 
      ref={bodyRef} 
      position={[0, 5, 0]} 
      colliders="cuboid" 
      mass={1} // Standardní fyzikální váha v Rapieru pro správný chod tlumičů
      friction={0} // Karoserie bude po asfaltu klouzat, pokud by se ho dotkla
      linearDamping={0.01} // Téměř žádné tření vzduchu
      angularDamping={0.1} // Stabilita rotace
      canSleep={false}
    >
      <group>
        {/* Vizuální model vozu 1940s Mafia Style */}
        {/* Hlavní podvozek / Spodní část */}
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[1.8, 0.4, 4.4]} />
          <meshStandardMaterial map={carTexture} metalness={0.9} roughness={0.3} color="#222" />
        </mesh>
        
        {/* Dlouhá přední kapota */}
        <mesh castShadow position={[0, 0.5, 1.2]}>
          <boxGeometry args={[1.4, 0.5, 1.8]} />
          <meshStandardMaterial map={carTexture} metalness={0.9} roughness={0.3} color="#222" />
        </mesh>
        
        {/* Oblá kabina (prostředek) */}
        <mesh castShadow position={[0, 0.7, -0.2]}>
          <boxGeometry args={[1.6, 0.7, 1.8]} />
          <meshStandardMaterial map={carTexture} metalness={0.9} roughness={0.3} color="#222" />
        </mesh>

        {/* Zadní kufr */}
        <mesh castShadow position={[0, 0.5, -1.6]}>
          <boxGeometry args={[1.4, 0.4, 1.0]} />
          <meshStandardMaterial map={carTexture} metalness={0.9} roughness={0.3} color="#222" />
        </mesh>

        {/* Mřížka chladiče (vpředu) */}
        <mesh position={[0, 0.4, 2.15]}>
          <boxGeometry args={[1.0, 0.6, 0.1]} />
          <meshStandardMaterial color="#888" metalness={1.0} roughness={0.1} />
        </mesh>
        
        {/* Fyzikální kola (Vizuály řízené skriptem) */}
        <group ref={wheelFL}><mesh castShadow rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2]} /><meshStandardMaterial color="#111" /></mesh></group>
        <group ref={wheelFR}><mesh castShadow rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2]} /><meshStandardMaterial color="#111" /></mesh></group>
        <group ref={wheelRL}><mesh castShadow rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2]} /><meshStandardMaterial color="#111" /></mesh></group>
        <group ref={wheelRR}><mesh castShadow rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2]} /><meshStandardMaterial color="#111" /></mesh></group>

        {/* Přední světla */}
        <mesh position={[-0.6, 0.6, 2.01]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial color="#ffddaa" />
        </mesh>
        <mesh position={[0.6, 0.6, 2.01]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial color="#ffddaa" />
        </mesh>
      </group>
    </RigidBody>
  );
}
