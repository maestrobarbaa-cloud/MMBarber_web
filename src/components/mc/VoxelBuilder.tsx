"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, OrbitControls, PointerLockControls, Edges, Html, Cloud, Stars, Float, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Plus, X, Layers, Paintbrush2, Save, FolderOpen, Hammer, Gamepad2, Sun, Trash2, Scissors } from "lucide-react";
import { HexColorPicker } from "react-colorful";

// ─── BLOCK REGISTRY ────────────────────────────────────────────────────────
export type BlockCategory = 'basics' | 'nature' | 'stone' | 'wood' | 'glass' | 'metals' | 'fluids' | 'special';
export interface BlockDef {
  id: string; label: string; category: BlockCategory;
  color: string; colors?: string[];
  emissive?: string; emissiveIntensity?: number;
  transparent?: boolean; opacity?: number;
  isSign?: boolean; isSlab?: boolean; isFluid?: boolean; hasGravity?: boolean;
  roughness?: number; metalness?: number;
}

const BLOCK_REGISTRY: BlockDef[] = [
  { id:'grass',        label:'Tráva',          category:'basics',  color:'#4ade80', colors:['#4ade80','#4ade80','#4ade80','#78350f','#4ade80','#4ade80'] },
  { id:'dirt',         label:'Hlína',           category:'basics',  color:'#78350f' },
  { id:'grass_slab',   label:'Tráva - deska',   category:'basics',  color:'#4ade80', isSlab:true },
  { id:'dirt_slab',    label:'Hlína - deska',   category:'basics',  color:'#78350f', isSlab:true },
  { id:'gravel',       label:'Štěrk',           category:'basics',  color:'#a8a29e', roughness:1 },
  { id:'path',         label:'Cesta',           category:'basics',  color:'#d4b483', roughness:0.9 },
  { id:'bedrock',      label:'Bedrock',         category:'basics',  color:'#111111', roughness:1 },
  { id:'sign',         label:'Cedulka',         category:'basics',  color:'#fcd34d', isSign:true },
  { id:'sand',         label:'Písek',           category:'nature',  color:'#fde68a', hasGravity:true, roughness:0.95 },
  { id:'snow',         label:'Sníh',            category:'nature',  color:'#e0f2fe', roughness:0.8 },
  { id:'snow_slab',    label:'Sníh - deska',    category:'nature',  color:'#e0f2fe', isSlab:true },
  { id:'leaves',       label:'Listí',           category:'nature',  color:'#16a34a', transparent:true, opacity:0.85 },
  { id:'pumpkin',      label:'Dýně',            category:'nature',  color:'#fb923c', colors:['#fb923c','#fb923c','#fbbf24','#f97316','#fb923c','#fb923c'] },
  { id:'melon',        label:'Meloun',          category:'nature',  color:'#4ade80', colors:['#86efac','#86efac','#4ade80','#4ade80','#86efac','#86efac'] },
  { id:'clay',         label:'Jíl',             category:'nature',  color:'#9ca3af', roughness:0.8 },
  { id:'mud',          label:'Bláto',           category:'nature',  color:'#44312a', roughness:1 },
  { id:'ice',          label:'Led',             category:'nature',  color:'#7dd3fc', transparent:true, opacity:0.7, roughness:0.1 },
  { id:'stone',        label:'Kámen',           category:'stone',   color:'#9ca3af' },
  { id:'stone_slab',   label:'Kámen - deska',   category:'stone',   color:'#9ca3af', isSlab:true },
  { id:'cobblestone',  label:'Bulvár',          category:'stone',   color:'#6b7280', roughness:0.9 },
  { id:'smooth_stone', label:'Hladký kámen',    category:'stone',   color:'#d1d5db', roughness:0.3 },
  { id:'andesite',     label:'Andezit',         category:'stone',   color:'#9ca3af', roughness:0.8 },
  { id:'diorite',      label:'Diorit',          category:'stone',   color:'#f3f4f6', roughness:0.7 },
  { id:'granite',      label:'Žula',            category:'stone',   color:'#d97706', roughness:0.8 },
  { id:'obsidian',     label:'Obsidián',        category:'stone',   color:'#1e1b4b', metalness:0.2 },
  { id:'brick',        label:'Cihly',           category:'stone',   color:'#b91c1c', roughness:0.9 },
  { id:'stone_brick',  label:'Kamenné cihly',   category:'stone',   color:'#6b7280', roughness:0.8 },
  { id:'sandstone',    label:'Pískovec',        category:'stone',   color:'#fde68a', roughness:0.9, colors:['#fde68a','#fde68a','#fef3c7','#fbbf24','#fde68a','#fde68a'] },
  { id:'quartz',       label:'Křemen',          category:'stone',   color:'#fafafa', roughness:0.3, metalness:0.1 },
  { id:'end_stone',    label:'End kámen',       category:'stone',   color:'#fef3c7', roughness:0.7 },
  { id:'oak',          label:'Dub',             category:'wood',    color:'#854d0e', colors:['#854d0e','#854d0e','#92400e','#92400e','#854d0e','#854d0e'] },
  { id:'oak_slab',     label:'Dub - deska',     category:'wood',    color:'#854d0e', isSlab:true },
  { id:'spruce',       label:'Smrk',            category:'wood',    color:'#451a03', colors:['#451a03','#451a03','#57534e','#57534e','#451a03','#451a03'] },
  { id:'birch',        label:'Bříza',           category:'wood',    color:'#f5f0e8', colors:['#f5f0e8','#f5f0e8','#d6d3d1','#d6d3d1','#f5f0e8','#f5f0e8'] },
  { id:'jungle',       label:'Džungle',         category:'wood',    color:'#7c5227', colors:['#7c5227','#7c5227','#78350f','#78350f','#7c5227','#7c5227'] },
  { id:'acacia',       label:'Akácie',          category:'wood',    color:'#c2440e', colors:['#c2440e','#c2440e','#9a3412','#9a3412','#c2440e','#c2440e'] },
  { id:'dark_oak',     label:'Tmavý dub',       category:'wood',    color:'#2d1606', colors:['#2d1606','#2d1606','#1c1008','#1c1008','#2d1606','#2d1606'] },
  { id:'bamboo',       label:'Bambus',          category:'wood',    color:'#65a30d', roughness:0.6 },
  { id:'glass',        label:'Sklo',            category:'glass',   color:'#bae6fd', transparent:true, opacity:0.3, roughness:0, metalness:0.1 },
  { id:'glass_slab',   label:'Sklo - deska',    category:'glass',   color:'#bae6fd', transparent:true, opacity:0.3, isSlab:true },
  { id:'red_glass',    label:'Červené sklo',    category:'glass',   color:'#ef4444', transparent:true, opacity:0.4 },
  { id:'blue_glass',   label:'Modré sklo',      category:'glass',   color:'#3b82f6', transparent:true, opacity:0.4 },
  { id:'green_glass',  label:'Zelené sklo',     category:'glass',   color:'#22c55e', transparent:true, opacity:0.4 },
  { id:'yellow_glass', label:'Žluté sklo',      category:'glass',   color:'#fbbf24', transparent:true, opacity:0.4 },
  { id:'purple_glass', label:'Fialové sklo',    category:'glass',   color:'#a855f7', transparent:true, opacity:0.4 },
  { id:'iron',         label:'Železo',          category:'metals',  color:'#d1d5db', metalness:0.9, roughness:0.2 },
  { id:'gold',         label:'Zlato',           category:'metals',  color:'#d4af37', metalness:0.9, roughness:0.15, emissive:'#b8860b', emissiveIntensity:0.05 },
  { id:'diamond',      label:'Diamant',         category:'metals',  color:'#5eead4', metalness:0.5, roughness:0, transparent:true, opacity:0.85, emissive:'#00ffff', emissiveIntensity:0.08 },
  { id:'emerald',      label:'Smaragd',         category:'metals',  color:'#10b981', metalness:0.4, roughness:0.1, transparent:true, opacity:0.9, emissive:'#00ff66', emissiveIntensity:0.06 },
  { id:'redstone',     label:'Redstone',        category:'metals',  color:'#ef4444', emissive:'#ff0000', emissiveIntensity:0.3, metalness:0.2 },
  { id:'lapis',        label:'Lapis Lazuli',    category:'metals',  color:'#1d4ed8', metalness:0.3, roughness:0.3 },
  { id:'copper',       label:'Měď',             category:'metals',  color:'#c87941', metalness:0.8, roughness:0.3 },
  { id:'netherite',    label:'Netherite',       category:'metals',  color:'#292524', metalness:0.9, roughness:0.05, emissive:'#450a0a', emissiveIntensity:0.1 },
  { id:'water',        label:'Voda',            category:'fluids',  color:'#1d4ed8', transparent:true, opacity:0.6, isFluid:true, roughness:0, metalness:0.1 },
  { id:'water_slab',   label:'Voda (plytká)',   category:'fluids',  color:'#3b82f6', transparent:true, opacity:0.5, isFluid:true, isSlab:true },
  { id:'lava',         label:'Láva',            category:'fluids',  color:'#ea580c', isFluid:true, emissive:'#ff4400', emissiveIntensity:0.6, roughness:0.5 },
  { id:'nether_brick', label:'Nether cihly',    category:'special', color:'#450a0a', roughness:0.9, emissive:'#7f1d1d', emissiveIntensity:0.05 },
  { id:'soulsand',     label:'Soul Sand',       category:'special', color:'#292524', roughness:1 },
  { id:'glowstone',    label:'Glowstone',       category:'special', color:'#fef08a', emissive:'#fde047', emissiveIntensity:0.8, roughness:0.5 },
  { id:'sea_lantern',  label:'Mořská lampa',    category:'special', color:'#bae6fd', emissive:'#7dd3fc', emissiveIntensity:0.5, transparent:true, opacity:0.85 },
  { id:'tnt',          label:'TNT',             category:'special', color:'#ef4444', colors:['#ef4444','#ef4444','#fde047','#fde047','#ef4444','#ef4444'] },
  { id:'bookshelf',    label:'Knihovna',        category:'special', color:'#854d0e', colors:['#6b4226','#6b4226','#854d0e','#854d0e','#6b4226','#6b4226'] },
  { id:'crafting',     label:'Pracovní stůl',   category:'special', color:'#854d0e', colors:['#4ade80','#4ade80','#854d0e','#6b4226','#854d0e','#854d0e'] },
  { id:'furnace',      label:'Pec',             category:'special', color:'#6b7280', colors:['#6b7280','#6b7280','#6b7280','#6b7280','#dc2626','#6b7280'], emissive:'#dc2626', emissiveIntensity:0.1 },
];

const BLOCK_MAP = Object.fromEntries(BLOCK_REGISTRY.map(b => [b.id, b]));
const CATEGORIES: { key: BlockCategory; label: string; icon: string }[] = [
  { key:'basics',  label:'Základy',   icon:'🧱' },
  { key:'nature',  label:'Příroda',   icon:'🌿' },
  { key:'stone',   label:'Kámen',     icon:'⛏️' },
  { key:'wood',    label:'Dřevo',     icon:'🪵' },
  { key:'glass',   label:'Sklo',      icon:'🪟' },
  { key:'metals',  label:'Kovy',      icon:'💎' },
  { key:'fluids',  label:'Tekutiny',  icon:'💧' },
  { key:'special', label:'Speciální', icon:'✨' },
];

export type BlockType = string;
interface PlacedBlock { key: string; pos: [number, number, number]; type: BlockType; text?: string; customColors?: string[]; }
type HotbarItem = { id: string; blockId: string; customColors?: string[]; label?: string; };
type GameMode = 'build' | 'play';
interface PlayerState { x: number; y: number; z: number; ry: number; vy: number; onGround: boolean; lookTarget?: THREE.Vector3; }

// ─── TERRAIN GENERATOR ────────────────────────────────────────────────────────
function noise2D(x: number, z: number): number {
  return (
    Math.sin(x * 0.3) * Math.cos(z * 0.2) * 2 +
    Math.sin(x * 0.7 + 1.5) * Math.cos(z * 0.5 + 0.8) * 1.5 +
    Math.sin(x * 0.15 + 2.1) * Math.cos(z * 0.18 + 1.2) * 3
  );
}

function generateWorld(): PlacedBlock[] {
  const blocks: PlacedBlock[] = [];
  const placed = new Set<string>();
  const add = (x: number, y: number, z: number, type: string, text?: string) => {
    const k = `${x}-${y}-${z}`;
    if (!placed.has(k)) { placed.add(k); blocks.push({ key: k, pos: [x, y, z], type, text }); }
  };

  // Terrain
  const W = 120, D = 120;
  
  const getHeight = (x: number, z: number) => {
    const dist = Math.sqrt(x*x + z*z);
    const lake1 = Math.sqrt((x - -15) ** 2 + (z - 10) ** 2) < 12;
    const lake2 = Math.sqrt((x - -5) ** 2 + (z - 20) ** 2) < 9;
    const lake3 = Math.sqrt((x - 12) ** 2 + (z - -15) ** 2) < 11;
    const lake4 = Math.sqrt((x - 25) ** 2 + (z - 5) ** 2) < 8;
    const isPond = lake1 || lake2 || lake3 || lake4;

    if (isPond) return { h: -1, isPond: true, isSpawnHill: false };

    const rawH = noise2D(x, z);
    let h = Math.max(0, Math.round(rawH));

    if (dist > 40) {
      const mountainFactor = (dist - 40) / 80;
      if (rawH > 0) h += Math.floor(Math.pow(rawH, 1.4) * 6 * mountainFactor);
    }
    
    // Zjemnění okrajů ostrova do vody (od dist 95 do 110)
    if (dist > 95) {
      const edgeFactor = Math.min(1, (dist - 95) / 15);
      h = Math.floor(h * (1 - edgeFactor) + (-1) * edgeFactor);
    }
    
    // Pokud je výška menší než 0, stane se z toho vodní plocha
    if (h < 0) {
      return { h: -1, isPond: true, isSpawnHill: false };
    }
    
    let isSpawnHill = false;
    const distToSpawn = Math.sqrt((x - 0)**2 + (z - 5)**2);
    if (distToSpawn < 12) {
      isSpawnHill = true;
      const spawnFactor = Math.cos((distToSpawn / 12) * (Math.PI / 2));
      h += Math.floor(spawnFactor * 8); // Výška kopce 8 bloků
    }

    return { h, isPond, isSpawnHill };
  };

  for (let x = -W; x <= W; x++) {
    for (let z = -D; z <= D; z++) {
      const dist = Math.sqrt(x*x + z*z);
      if (dist > 120) continue; // Circular island

      const { h, isPond } = getHeight(x, z);

      // Surface
      if (isPond) {
        add(x, 0, z, 'water');
        add(x, -1, z, 'sand');
        add(x, -2, z, 'sand');
      } else {
        add(x, h, z, 'grass');
        // Vyplnění hory až k zemi, aby z boku nebyly průhledné díry na strmých útesech
        const shellBottom = dist < 60 ? -3 : (h > 4 ? 0 : Math.max(0, h - 4));
        for (let y = h - 1; y >= shellBottom; y--) {
          add(x, y, z, (y < h - 2 && (dist < 60 || h > 6)) ? 'stone' : 'dirt');
        }
      }
    }
  }

  // Trees
  const addTree = (bx: number, bz: number) => {
    if (Math.sqrt(bx*bx + bz*bz) > 230) return; // keep trees away from walls
    
    // Nestavět stromy ve vodě
    const l1 = Math.sqrt((bx - -15) ** 2 + (bz - 10) ** 2) < 13;
    const l2 = Math.sqrt((bx - -5) ** 2 + (bz - 20) ** 2) < 10;
    const l3 = Math.sqrt((bx - 12) ** 2 + (bz - -15) ** 2) < 12;
    const l4 = Math.sqrt((bx - 25) ** 2 + (bz - 5) ** 2) < 9;
    if (l1 || l2 || l3 || l4) return;

    // Nestavět stromy přímo na spawnu, aby se tam hráč nezasekl, a ne na kopec
    const { isSpawnHill } = getHeight(bx, bz);
    if (isSpawnHill || Math.sqrt(bx*bx + bz*bz) < 6) return;

    // Nestavět stromy na pláži nebo ve vodě (kraje ostrova)
    if (Math.sqrt(bx*bx + bz*bz) > 95) return;

    const baseH = getHeight(bx, bz).h;
    const trunkH = 4 + Math.round(Math.abs(Math.sin(bx * 0.7)) * 2);
    
    // Trunk
    for (let i = 0; i < trunkH; i++) add(bx, baseH + i, bz, 'oak');
    
    // 10% šance na "prémiový" strom se zlatými listy pro MMBarber styl
    const isGold = Math.abs(Math.sin(bx * bz)) > 0.9;
    const leafBlock = isGold ? 'gold' : 'leaves';

    // Leaves
    const leafTop = baseH + trunkH;
    for (let lx = -2; lx <= 2; lx++) {
      for (let lz = -2; lz <= 2; lz++) {
        for (let ly = -1; ly <= 1; ly++) {
          if (Math.abs(lx) === 2 && Math.abs(lz) === 2) continue;
          if (lx === 0 && lz === 0 && ly < 1) continue;
          add(bx + lx, leafTop + ly, bz + lz, leafBlock);
        }
      }
    }
  };

  // Zlatá spirála pro přirozené rozprostření lesa
  for (let i = 0; i < 700; i++) {
    const angle = (i * 137.5) * (Math.PI / 180);
    const r = 8 + (i * 0.2); // Hustější a dálší spirála
    if (r > 150) continue;
    const tx = Math.round(Math.cos(angle) * r);
    const tz = Math.round(Math.sin(angle) * r);
    addTree(tx, tz);
  }

  // Sand path
  const pathPoints: [number, number][] = [[-20,0],[-15,0],[-10,0],[-5,0],[0,0],[5,0],[0,0],[0,-5],[0,-10],[0,-15]];
  for (const [px, pz] of pathPoints) {
    const ph = getHeight(px, pz).h;
    add(px, ph, pz, 'path');
    add(px + 1, ph, pz, 'path');
    if (pz === 0) add(px, ph, pz + 1, 'path');
  }

  // Small stone ruins / structure
  for (let i = 0; i < 5; i++) add(-18 + i, 1, -15, 'stone_brick');
  for (let i = 0; i < 5; i++) add(-18 + i, 2, -15, 'stone_brick');
  add(-18, 3, -15, 'stone_brick'); add(-22, 3, -15, 'stone_brick');
  add(-18, 1, -20, 'cobblestone'); add(-18, 2, -20, 'cobblestone');
  add(-18, 3, -20, 'cobblestone');

  // Welcome sign
  add(0, getHeight(0, -3).h + 1, -3, 'sign', 'Vítej ve světě!');
  add(3, getHeight(3, -3).h + 1, -3, 'sign', 'Stav svůj svět!');

  // Glowstone lanterns along path
  add(-10, getHeight(-10, 2).h + 1, 2, 'glowstone');
  add(-5, getHeight(-5, 2).h + 1, 2, 'glowstone');
  add(5, getHeight(5, 2).h + 1, 2, 'glowstone');

  return blocks;
}

// ─── FLUID MESH ──────────────────────────────────────────────────────────────
function FluidMesh({ def, isSlab, baseOpacity }: { def: BlockDef; isSlab: boolean; baseOpacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    if (def.emissiveIntensity) m.emissiveIntensity = def.emissiveIntensity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={isSlab ? [1, 0.5, 1] : [1, 0.875, 1]} />
      <meshStandardMaterial color={def.color} emissive={def.emissive||'#000'} emissiveIntensity={def.emissiveIntensity||0} transparent opacity={baseOpacity} roughness={def.roughness??0} metalness={def.metalness??0} />
    </mesh>
  );
}

// ─── PLAYER SIGN ─────────────────────────────────────────────────────────────
function PlayerSign({ position, text, onRemove }: { position:[number,number,number]; text:string; onRemove?:()=>void }) {
  const fontSize = text.length < 10 ? '14px' : text.length < 30 ? '11px' : '8px';
  return (
    <group position={position} onContextMenu={(e) => { e.stopPropagation(); onRemove?.(); }}>
      <mesh position={[0,-0.25,0]}><boxGeometry args={[0.1,0.5,0.1]} /><meshStandardMaterial color="#854d0e" /></mesh>
      <mesh position={[0,0.1,0]}><boxGeometry args={[0.8,0.5,0.1]} /><meshStandardMaterial color="#9a6b3a" /></mesh>
      <Html transform position={[0,0.1,0.06]}>
        <div style={{width:'120px',height:'70px',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',pointerEvents:'none',userSelect:'none',overflow:'hidden'}}>
          <p style={{color:'white',fontWeight:'bold',lineHeight:'1.2',wordBreak:'break-word',width:'100%',fontSize,textShadow:'0 1px 3px #000'}}>{text}</p>
        </div>
      </Html>
    </group>
  );
}

// ─── INSTANCED BLOCKS ─────────────────────────────────────────────────────────
function InstancedBlockGroup({ type, blocks, addBlock, removeBlock, onEdit, mode }: {
  type: string; blocks: PlacedBlock[]; addBlock?: any; removeBlock?: any; onEdit?: any; mode: GameMode;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const def = BLOCK_MAP[type];
  
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    blocks.forEach((b, i) => {
      const yOff = def.isSlab ? -0.25 : 0;
      dummy.position.set(b.pos[0], b.pos[1] + yOff, b.pos[2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [blocks, def]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId === undefined) return;
    const b = blocks[instanceId];
    if (!b) return;
    if (e.altKey || e.shiftKey) { removeBlock?.(b.key); return; }
    const fi = Math.floor(e.faceIndex! / 2);
    const offsets = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    const [dx,dy,dz] = offsets[fi] || [0,1,0];
    addBlock?.(b.pos[0]+dx, b.pos[1]+dy, b.pos[2]+dz);
  };

  const handleContextMenu = (e: any) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId === undefined) return;
    const b = blocks[instanceId];
    if (b) removeBlock?.(b.key);
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId === undefined) return;
    const b = blocks[instanceId];
    if (b) onEdit?.(b);
  };

  if (!def) return null;
  const opacity = def.opacity ?? 1;

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, blocks.length]} 
      onClick={handleClick} onContextMenu={handleContextMenu} onDoubleClick={handleDoubleClick}
    >
      <boxGeometry args={[1, def.isSlab ? 0.5 : 1, 1]} />
      {def.colors ? def.colors.map((c,i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} color={c} transparent={def.transparent} opacity={opacity}
          emissive={def.emissive ? new THREE.Color(def.emissive) : undefined} emissiveIntensity={def.emissiveIntensity||0}
          roughness={def.roughness??0.8} metalness={def.metalness??0} />
      )) : (
        <meshStandardMaterial color={def.color} transparent={def.transparent} opacity={opacity}
          emissive={def.emissive ? new THREE.Color(def.emissive) : undefined} emissiveIntensity={def.emissiveIntensity||0}
          roughness={def.roughness??0.8} metalness={def.metalness??0} />
      )}
    </instancedMesh>
  );
}

function BlocksRenderer({ blocks, addBlock, removeBlock, onEdit, mode }: any) {
  const { instanced, special } = useMemo(() => {
    const instanced = new Map<string, PlacedBlock[]>();
    const special: PlacedBlock[] = [];
    for (const b of blocks) {
      const def = BLOCK_MAP[b.type];
      if (!def || def.isFluid || def.isSign || b.customColors) {
        special.push(b);
      } else {
        if (!instanced.has(b.type)) instanced.set(b.type, []);
        instanced.get(b.type)!.push(b);
      }
    }
    return { instanced, special };
  }, [blocks]);

  return (
    <group>
      {Array.from(instanced.entries()).map(([type, bArr]) => (
        <InstancedBlockGroup key={type} type={type} blocks={bArr} addBlock={addBlock} removeBlock={removeBlock} onEdit={onEdit} mode={mode} />
      ))}
      {special.map((block: PlacedBlock) => (
        <Cube key={block.key} block={block} addBlock={addBlock} removeBlock={removeBlock} onEdit={onEdit} mode={mode} />
      ))}
    </group>
  );
}

// ─── CUBE ────────────────────────────────────────────────────────────────     
function Cube({ block, addBlock, removeBlock, onEdit, mode }: {
  block: PlacedBlock; addBlock?:(x:number,y:number,z:number)=>void; removeBlock?:(key:string)=>void; onEdit?:(b:PlacedBlock)=>void; mode?: GameMode;
}) {
  const [hover, setHover] = useState(false);
  const def = BLOCK_MAP[block.type];
  if (!def) return null;
  const isSlab = !!def.isSlab;
  const yOff = isSlab ? -0.25 : 0;
  const resolvedColors = block.customColors || def.colors;
  const baseOpacity = def.opacity ?? 1;
  const opacity = hover && mode === 'build' ? Math.max(baseOpacity * 0.75, 0.12) : baseOpacity;

  if (def.isSign) return <PlayerSign position={block.pos} text={block.text||''} onRemove={() => removeBlock?.(block.key)} />;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (e.altKey || e.shiftKey) { removeBlock?.(block.key); return; }
    const fi = Math.floor(e.faceIndex! / 2);
    const [x,y,z] = block.pos;
    const offsets: [number,number,number][] = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    const [dx,dy,dz] = offsets[fi];
    addBlock?.(x+dx, y+dy, z+dz);
  };

  if (def.isFluid) return (
    <group position={[block.pos[0], block.pos[1]+yOff, block.pos[2]]}>
      <FluidMesh def={def} isSlab={isSlab} baseOpacity={opacity} />
    </group>
  );

  return (
    <mesh
      position={[block.pos[0], block.pos[1]+yOff, block.pos[2]]}
      onPointerMove={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
      onDoubleClick={(e) => { e.stopPropagation(); onEdit?.(block); }}
      onClick={handleClick}
      onContextMenu={(e) => { e.stopPropagation(); removeBlock?.(block.key); }}
    >
      <boxGeometry args={[1, isSlab ? 0.5 : 1, 1]} />
      {resolvedColors ? resolvedColors.map((c,i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} color={c} transparent={def.transparent||hover} opacity={opacity}
          emissive={def.emissive ? new THREE.Color(def.emissive) : undefined} emissiveIntensity={def.emissiveIntensity||0}
          roughness={def.roughness??0.8} metalness={def.metalness??0} />
      )) : (
        <meshStandardMaterial color={def.color} transparent={def.transparent||hover} opacity={opacity}
          emissive={def.emissive ? new THREE.Color(def.emissive) : undefined} emissiveIntensity={def.emissiveIntensity||0}
          roughness={def.roughness??0.8} metalness={def.metalness??0} />
      )}
      {hover && mode === 'build' && <Edges scale={1.01} threshold={15} color="#ffffff" />}
    </mesh>
  );
}

// ─── PLAYER CHARACTER ─────────────────────────────────────────────────────────
interface PlayerState { x: number; y: number; z: number; ry: number; vy: number; onGround: boolean; }

function PlayerMesh({ playerRef, mode }: { playerRef: React.MutableRefObject<THREE.Group | null>, mode: GameMode }) {
  return (
    <group ref={playerRef} visible={mode === 'build'}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.5,0.5,0.5]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.13, 1.65, 0.26]}>
        <boxGeometry args={[0.1,0.08,0.02]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      <mesh position={[-0.13, 1.65, 0.26]}>
        <boxGeometry args={[0.1,0.08,0.02]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.6,0.75,0.3]} />
        <meshStandardMaterial color="#2563eb" roughness={0.8} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.62,0.1,0.32]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.42, 1.0, 0]}>
        <boxGeometry args={[0.25,0.7,0.25]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.8} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.42, 1.0, 0]}>
        <boxGeometry args={[0.25,0.7,0.25]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.8} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.17, 0.3, 0]}>
        <boxGeometry args={[0.26,0.65,0.27]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.8} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.17, 0.3, 0]}>
        <boxGeometry args={[0.26,0.65,0.27]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PlayerController({ blocks, mode, controlsRef }: {
  blocks: PlacedBlock[]; mode: GameMode; controlsRef: any;
}) {
  const playerState = useRef<PlayerState>({x:0,y:10,z:5,ry:0,vy:0,onGround:false});
  const keysRef = useRef<Record<string,boolean>>({});
  const playerRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const timeRef = useRef(0);

  useEffect(() => {
    const d = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const u = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', d); window.addEventListener('keyup', u);
    return () => { window.removeEventListener('keydown', d); window.removeEventListener('keyup', u); };
  }, []);

  const columns = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const b of blocks) {
      const def = BLOCK_MAP[b.type];
      if (def?.isFluid) continue;
      const k = `${b.pos[0]},${b.pos[2]}`;
      const h = b.pos[1] + (def?.isSlab ? 0.5 : 1);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(h);
    }
    return map;
  }, [blocks]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const k = keysRef.current;
    const speed = (k['ShiftLeft'] || k['ShiftRight'] ? 6 : 3.5) * delta;

    let { x, y, z, ry, vy, onGround } = playerState.current;

    const camFwd = new THREE.Vector3();
    camera.getWorldDirection(camFwd);
    camFwd.y = 0;
    camFwd.normalize();
    const camRight = new THREE.Vector3().crossVectors(camera.up, camFwd).normalize();

    let moveX = 0, moveZ = 0;
    if (k['KeyW'] || k['ArrowUp'])    { moveX += camFwd.x; moveZ += camFwd.z; }
    if (k['KeyS'] || k['ArrowDown'])  { moveX -= camFwd.x; moveZ -= camFwd.z; }
    if (k['KeyA'] || k['ArrowLeft'])  { moveX += camRight.x; moveZ += camRight.z; }
    if (k['KeyD'] || k['ArrowRight']) { moveX -= camRight.x; moveZ -= camRight.z; }

    if (moveX !== 0 || moveZ !== 0) {
      const moveVec = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(speed);
      x += moveVec.x;
      z += moveVec.z;
      
      const targetRy = Math.atan2(moveVec.x, moveVec.z);
      
      const diff = targetRy - ry;
      let shortDiff = diff % (Math.PI * 2);
      if (shortDiff > Math.PI) shortDiff -= Math.PI * 2;
      else if (shortDiff < -Math.PI) shortDiff += Math.PI * 2;
      ry += shortDiff * 10 * delta;
    }

    // Gravity
    vy -= 18 * delta;
    y += vy * delta;

    // Collision with blocks
    const bx = Math.round(x), bz = Math.round(z);
    const col = columns.get(`${bx},${bz}`);
    let floorY = -1;
    let hitWall = false;
    let hitCeiling = false;
    if (col) {
      for (const h of col) {
        if (h <= playerState.current.y + 1.1) {
          if (h > floorY) floorY = h;
        } else if (h > playerState.current.y + 1.1 && h < playerState.current.y + 2.2) {
          hitWall = true;
        } else if (h >= playerState.current.y + 2.2 && h < playerState.current.y + 3.0) {
          hitCeiling = true;
        }
      }
    }
    
    if (hitWall) {
      x = playerState.current.x;
      z = playerState.current.z;
      const oldBx = Math.round(x), oldBz = Math.round(z);
      const oldCol = columns.get(`${oldBx},${oldBz}`);
      floorY = -1;
      if (oldCol) {
        for (const h of oldCol) {
          if (h <= playerState.current.y + 1.1 && h > floorY) floorY = h;
        }
      }
    }

    if (hitCeiling && vy > 0) {
      vy = -2;
    }

    if (y <= floorY) { y = floorY; vy = 0; onGround = true; } else { onGround = false; }
    if ((k['Space'] || k['KeyQ']) && onGround) { vy = 7; onGround = false; }

    playerState.current = { x, y, z, ry, vy, onGround };

    // Update player mesh
    if (playerRef.current) {
      playerRef.current.position.set(x, y, z);
      playerRef.current.rotation.y = ry;

      const isMoving = (moveX !== 0 || moveZ !== 0);
      const targetSwing = isMoving ? Math.sin(timeRef.current * 15) * 0.4 : 0;
      
      const children = playerRef.current.children;
      if (children[5]) (children[5] as THREE.Mesh).rotation.x = THREE.MathUtils.lerp((children[5] as THREE.Mesh).rotation.x, -targetSwing, 0.2); 
      if (children[6]) (children[6] as THREE.Mesh).rotation.x = THREE.MathUtils.lerp((children[6] as THREE.Mesh).rotation.x, targetSwing, 0.2);  
      if (children[7]) (children[7] as THREE.Mesh).rotation.x = THREE.MathUtils.lerp((children[7] as THREE.Mesh).rotation.x, targetSwing, 0.2);  
      if (children[8]) (children[8] as THREE.Mesh).rotation.x = THREE.MathUtils.lerp((children[8] as THREE.Mesh).rotation.x, -targetSwing, 0.2); 
    }

    if (mode === 'play') {
      // Skutečný First-Person FPS pohled
      camera.position.lerp(new THREE.Vector3(x, y + 1.6, z), 0.4);
    } else {
      // Build mód
      if (controlsRef.current) {
        const idealTarget = new THREE.Vector3(x, y + 1.5, z);
        controlsRef.current.target.lerp(idealTarget, 0.2);
      }
    }
  });

  return <PlayerMesh playerRef={playerRef} mode={mode} />;
}

// ─── GROUND ───────────────────────────────────────────────────────────────────
function Ground({ addBlock, mode }: { addBlock:(x:number,y:number,z:number)=>void; mode: GameMode }) {
  return (
    <group>
      <mesh position={[0,-0.51,0]} rotation={[-Math.PI/2,0,0]}
        onClick={(e) => { e.stopPropagation(); addBlock(Math.round(e.point.x), 0, Math.round(e.point.z)); }}
      >
        <planeGeometry args={[400,400]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.6} />
      </mesh>
      <gridHelper args={[400,400,'#374151','#374151']} position={[0.5,-0.49,0.5]} />
    </group>
  );
}

// ─── BUILD MODE CAMERA ─────────────────────────────────────────────────────────
function BuildCameraController({ controlsRef, enabled }: { controlsRef: any; enabled: boolean }) {
  const keysRef = useRef<Record<string,boolean>>({});
  useEffect(() => {
    const d = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const u = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', d); window.addEventListener('keyup', u);
    return () => { window.removeEventListener('keydown', d); window.removeEventListener('keyup', u); };
  }, []);
  useFrame((state, delta) => {
    if (!controlsRef.current || !enabled) return;
    const k = keysRef.current;
    const speed = (k['ShiftLeft']||k['ShiftRight'] ? 22 : 10) * delta;
    const fwd = new THREE.Vector3(); state.camera.getWorldDirection(fwd); fwd.y=0; fwd.normalize();
    const right = new THREE.Vector3().crossVectors(state.camera.up, fwd).normalize();
    const move = new THREE.Vector3();
    if (k['KeyW']||k['ArrowUp'])    move.add(fwd);
    if (k['KeyS']||k['ArrowDown'])  move.sub(fwd);
    if (k['KeyA']||k['ArrowLeft'])  move.add(right);
    if (k['KeyD']||k['ArrowRight']) move.sub(right);
    if (k['Space']) { state.camera.position.y+=speed; controlsRef.current.target.y+=speed; }
    if (k['KeyQ'])  { state.camera.position.y-=speed; controlsRef.current.target.y-=speed; }
    if (move.lengthSq()>0) { move.normalize().multiplyScalar(speed); state.camera.position.add(move); controlsRef.current.target.add(move); }
  });
  return null;
}

// ─── SAND GRAVITY ─────────────────────────────────────────────────────────────
function useSandGravity(blocks: PlacedBlock[], setBlocks: React.Dispatch<React.SetStateAction<PlacedBlock[]>>) {
  useEffect(() => {
    const iv = setInterval(() => {
      setBlocks(prev => {
        let hasPotentialGravity = false;
        for (let i = 0; i < prev.length; i++) {
          if (BLOCK_MAP[prev[i].type]?.hasGravity && prev[i].pos[1] > -2) {
            hasPotentialGravity = true; break;
          }
        }
        if (!hasPotentialGravity) return prev;

        const pos = new Set<number>();
        for (let i = 0; i < prev.length; i++) {
          const p = prev[i].pos;
          pos.add((p[0]+1000)*1000000 + (p[1]+100)*1000 + (p[2]+1000));
        }

        let changed = false;
        const next = prev.map(b => {
          if (!BLOCK_MAP[b.type]?.hasGravity || b.pos[1] <= -2) return b;
          const bk = (b.pos[0]+1000)*1000000 + (b.pos[1]-1+100)*1000 + (b.pos[2]+1000);
          if (!pos.has(bk)) {
            pos.delete((b.pos[0]+1000)*1000000 + (b.pos[1]+100)*1000 + (b.pos[2]+1000)); 
            pos.add(bk); 
            changed = true;
            return { ...b, pos: [b.pos[0],b.pos[1]-1,b.pos[2]], key: `${b.pos[0]}-${b.pos[1]-1}-${b.pos[2]}` };
          }
          return b;
        });
        return changed ? next : prev;
      });
    }, 400);
    return () => clearInterval(iv);
  }, [setBlocks]);
}

// ─── SUN ─────────────────────────────────────────────────────────────────────
function SunMesh() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.05;
    ref.current.position.set(Math.cos(t) * 120, Math.sin(t) * 120 + 20, -80);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[8, 16, 16]} />
      <meshBasicMaterial color="#fde68a" />
    </mesh>
  );
}

// ─── HOTBAR SWATCH ─────────────────────────────────────────────────────────────
function HotbarSwatch({ item, active, onClick }: { item: HotbarItem; active: boolean; onClick: () => void }) {
  const def = BLOCK_MAP[item.blockId];
  if (!def) return null;
  const colors = item.customColors || def.colors;
  return (
    <button onClick={onClick} title={item.label||def.label}
      className={`relative w-12 h-12 rounded-xl border-2 overflow-hidden transition-all hover:scale-110 cursor-pointer flex-shrink-0 ${active ? 'border-yellow-400 shadow-[0_0_18px_rgba(212,175,55,0.7)] scale-110' : 'border-white/20 hover:border-white/40'}`}
    >
      {colors ? (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {([0,2,4,5] as number[]).map(i => <div key={i} style={{backgroundColor:colors[i]}} />)}
        </div>
      ) : (
        <div className="absolute inset-0" style={{backgroundColor:def.color, opacity:def.transparent?0.7:1}} />
      )}
      {def.isSlab && <div className="absolute bottom-0 inset-x-0 h-1/2 bg-black/30" />}
      {def.isSign && <div className="absolute inset-0 flex items-center justify-center text-black/60 font-bold text-[8px] uppercase" style={{backgroundColor:def.color}}>Sign</div>}
      {def.emissive && <div className="absolute inset-0 rounded-xl" style={{boxShadow:`inset 0 0 8px ${def.emissive}66`}} />}
      {def.hasGravity && <span className="absolute top-0 right-0.5 text-[9px] text-white/80">↓</span>}
      {def.isFluid && <span className="absolute top-0 right-0.5 text-[9px] text-white/80">~</span>}
    </button>
  );
}

// ─── SIGN EDITOR MODAL ────────────────────────────────────────────────────────
function SignEditorModal({ onConfirm, onClose }: { onConfirm: (text: string) => void; onClose: () => void }) {
  const [text, setText] = useState('');
  const fontSize = text.length < 10 ? '16px' : text.length < 30 ? '12px' : '9px';
  return (
    <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900">
          <h2 className="text-white font-bold text-lg flex items-center gap-3">📋 Editor Cedulky</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-4 h-24 bg-amber-700 rounded mx-auto mb-[-4px]" style={{width:'12px'}} />
              <div className="bg-amber-800 rounded-lg p-3 w-52 h-28 flex items-center justify-center text-center shadow-xl border-2 border-amber-600">
                <p className="text-white font-bold leading-tight break-words w-full" style={{fontSize, textShadow:'0 1px 3px #000'}}>{text || '...'}</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest font-mono block mb-2">Text cedulky</label>
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={80}
              rows={3}
              placeholder="Napiš co má být na cedulce..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-400/50 resize-none transition-colors"
            />
            <p className="text-white/20 text-xs mt-1 text-right font-mono">{text.length}/80</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-sm font-mono border border-white/10 transition-colors">Zrušit</button>
            <button onClick={() => { if (text.trim()) onConfirm(text.trim()); }} disabled={!text.trim()}
              className="flex-1 py-3 bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-400 rounded-xl font-bold text-sm border border-yellow-400/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >Umístit cedulku</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INVENTORY MODAL ──────────────────────────────────────────────────────────
function InventoryModal({ onClose, onSelect }: { onClose: () => void; onSelect: (id: string) => void }) {
  const [cat, setCat] = useState<BlockCategory>('basics');
  const [search, setSearch] = useState('');
  const filtered = BLOCK_REGISTRY.filter(b => b.category===cat && (b.label.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search.toLowerCase())));
  return (
    <div className="absolute inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden" style={{maxHeight:'85vh'}}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900">
          <div className="flex items-center gap-3">
            <Layers size={20} className="text-yellow-400" />
            <h2 className="text-white font-bold text-lg">Inventář bloků</h2>
            <span className="text-white/30 text-sm">– {BLOCK_REGISTRY.length} bloků</span>
          </div>
          <div className="flex gap-3">
            <input placeholder="Hledat..." value={search} onChange={e=>setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-yellow-400/50 w-44" />
            <button onClick={onClose} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10"><X size={20} /></button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-36 border-r border-white/10 flex flex-col bg-neutral-900/50 flex-shrink-0">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={()=>setCat(c.key)}
                className={`flex items-center gap-2 px-4 py-3 text-left transition-colors ${cat===c.key?'bg-yellow-400/20 text-yellow-400 border-l-2 border-yellow-400':'text-white/50 hover:text-white hover:bg-white/5'}`}
              ><span>{c.icon}</span><span className="font-mono text-xs">{c.label}</span></button>
            ))}
          </div>
          <div className="flex-1 p-5 overflow-y-auto">
            <div className="grid grid-cols-5 gap-3">
              {filtered.map(block => (
                <button key={block.id} onClick={()=>onSelect(block.id)} title={block.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-lg border-2 border-white/10 group-hover:border-white/30 group-hover:scale-110 transition-all relative overflow-hidden"
                    style={{backgroundColor:block.color,opacity:block.transparent&&!block.isSign?0.7:1}}
                  >
                    {block.isSlab && <div className="absolute bottom-0 inset-x-0 h-1/2 bg-black/30" />}
                    {block.emissive && <div className="absolute inset-0" style={{boxShadow:`inset 0 0 12px ${block.emissive}55`}} />}
                    {block.isSign && <span className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">Sign</span>}
                    {block.hasGravity && <span className="absolute top-0.5 right-0.5 text-[9px]">↓</span>}
                    {block.isFluid && <span className="absolute top-0.5 right-0.5 text-[9px]">~</span>}
                  </div>
                  <span className="text-[10px] font-mono text-white/50 group-hover:text-white text-center leading-tight">{block.label}</span>
                </button>
              ))}
            </div>
            {filtered.length===0 && <div className="flex flex-col items-center justify-center h-48 gap-3 text-white/20"><span className="text-4xl">🔍</span><p className="font-mono text-sm">Nic nenalezeno</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BLOCK EDITOR MODAL ───────────────────────────────────────────────────────
function BlockEditorModal({ editing, onClose, onSave, brushColor, setBrushColor }: {
  editing: { blockId: string; colors: string[] }; onClose: ()=>void;
  onSave: (colors: string[], label: string) => void; brushColor: string; setBrushColor: (c:string)=>void;
}) {
  const [colors, setColors] = useState<string[]>(editing.colors);
  const [label, setLabel] = useState('Vlastní blok');
  const def = BLOCK_MAP[editing.blockId];
  const isSlab = !!def?.isSlab;
  const FACE_LABELS = ['+X Pravá','-X Levá','+Y Vršek','-Y Spodek','+Z Přední','-Z Zadní'];
  const paintFace = (fi:number) => setColors(prev => { const c=[...prev]; c[fi]=brushColor; return c; });
  const PRESETS = ['#4ade80','#78350f','#9ca3af','#d4af37','#854d0e','#bae6fd','#ea580c','#1e1b4b','#b91c1c','#fde68a','#1d4ed8','#ffffff','#111111','#ef4444','#a855f7'];
  return (
    <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden" style={{maxHeight:'90vh'}}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900">
          <div className="flex items-center gap-3">
            <Paintbrush2 size={20} className="text-yellow-400" />
            <h2 className="text-white font-bold text-lg">Editor Bloků – {def?.label}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10"><X size={20} /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="border-r border-white/10 flex flex-col bg-neutral-950 flex-shrink-0" style={{width:'16rem'}}>
            <div className="p-5 border-b border-white/10">
              <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-3">Barva štětce</p>
              <HexColorPicker color={brushColor} onChange={setBrushColor} style={{width:'100%'}} />
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-white/20" style={{backgroundColor:brushColor}} />
                <p className="text-white font-mono text-sm">{brushColor.toUpperCase()}</p>
              </div>
            </div>
            <div className="p-4 border-b border-white/10">
              <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-2">Rychlé barvy</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map(c => (
                  <button key={c} onClick={()=>setBrushColor(c)}
                    className={`w-7 h-7 rounded-md border-2 transition-transform hover:scale-110 ${brushColor===c?'border-white':'border-transparent'}`}
                    style={{backgroundColor:c}} />
                ))}
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-2">Stěny</p>
              <div className="space-y-1">
                {FACE_LABELS.map((fl,i) => (
                  <button key={i} onClick={()=>paintFace(i)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 group">
                    <div className="w-6 h-6 rounded border border-white/20 flex-shrink-0 group-hover:scale-110 transition-transform" style={{backgroundColor:colors[i]}} />
                    <span className="text-white/50 text-xs font-mono group-hover:text-white flex-1 text-left">{fl}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 relative bg-neutral-900 overflow-hidden">
            <Canvas camera={{position:[2.5,2,2.5],fov:50}}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5,8,5]} intensity={1.5} />
              <mesh onClick={(e)=>{e.stopPropagation();paintFace(Math.floor(e.faceIndex!/2));}}>
                <boxGeometry args={isSlab?[1,0.5,1]:[1,1,1]} />
                {colors.map((c,i)=><meshStandardMaterial key={i} attach={`material-${i}`} color={c} transparent={def?.transparent} opacity={def?.opacity??1} roughness={def?.roughness??0.8} metalness={def?.metalness??0} />)}
                <Edges scale={1.05} threshold={15} color="white" />
              </mesh>
              <OrbitControls makeDefault enableZoom enablePan={false} />
            </Canvas>
            <p className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs font-mono pointer-events-none">Otáčej myší · Klikni na stěnu</p>
          </div>
          <div className="border-l border-white/10 flex flex-col p-5 gap-4 bg-neutral-950 flex-shrink-0" style={{width:'12rem'}}>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-2">Název</p>
              <input value={label} onChange={e=>setLabel(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-yellow-400/50" />
            </div>
            <div className="space-y-2">
              <button onClick={()=>setColors(Array(6).fill(brushColor))} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-xs font-mono border border-white/10">Obarvit vše</button>
              <button onClick={()=>setColors(editing.colors.slice())} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-xs font-mono border border-white/10">Resetovat</button>
            </div>
            <div className="mt-auto">
              <button onClick={()=>onSave(colors,label)} className="w-full py-3 bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-400 rounded-xl font-bold text-sm border border-yellow-400/50 transition-all">Uložit do lišty</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GIANT WEB ROOM (HTML WALLS) ────────────────────────────────────────────────
function WebWall({ position, rotation, content, width = 150, isActive, onActivate }: { position: [number,number,number]; rotation: [number,number,number]; content: React.ReactNode; width?: number; isActive?: boolean; onActivate?: () => void }) {
  return (
    <group position={position} rotation={rotation}>
      <Html transform position={[0, 0, 2]} distanceFactor={60} zIndexRange={isActive ? [100, 100] : [10, 0]}>
        <div 
          className="w-[1500px] h-[1000px] p-16 flex flex-col pointer-events-auto select-auto relative overflow-visible transition-all duration-1000" 
          style={{perspective: '6000px', transformStyle: 'preserve-3d'}}
          onMouseEnter={onActivate}
        >
          {content}
        </div>
      </Html>
    </group>
  );
}

function MovingClouds() {
  const groupRef = useRef<THREE.Group>(null);
  
  const cloudData = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      x: (Math.random() - 0.5) * 400,
      y: 80 + Math.random() * 40,
      z: (Math.random() - 0.5) * 400,
      speed: 0.1 + Math.random() * 0.2,
      opacity: 0.2 + Math.random() * 0.3,
      scale: 1 + Math.random() * 1.5,
    }));
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += 4 * delta;
      if (groupRef.current.position.x > 250) {
        groupRef.current.position.x = -250;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {cloudData.map((c, i) => (
        <Cloud key={i} position={[c.x, c.y, c.z]} speed={c.speed} opacity={c.opacity} scale={c.scale} />
      ))}
    </group>
  );
}

function GiantWebRoom() {
  const [activePanel, setActivePanel] = useState<number | null>(null);

  const PanelBox = ({ title, subtitle, icon }: any) => (
    <div className="w-full h-full flex items-center justify-center p-20 hover:z-50" style={{transformStyle: 'preserve-3d'}}>
      <div className="w-full h-full bg-[#0a0807]/90 hover:bg-[#0a0807] backdrop-blur-xl border-4 border-[#c5a059]/40 flex flex-col items-center justify-center group hover:border-[#c5a059] hover:[transform:translateZ(600px)_scale(1.4)] hover:shadow-[0_150px_200px_rgba(197,160,89,0.3)] transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative overflow-hidden cursor-default rounded-[4rem]" style={{transformStyle: 'preserve-3d'}}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#c5a059]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
        
        {icon && (
          <div className="opacity-70 transition-transform duration-1000 ease-out group-hover:[transform:translateZ(600px)_rotate(360deg)]" style={{filter:'drop-shadow(0 0 50px rgba(197,160,89,0.8))'}}>
            {icon}
          </div>
        )}
        
        {title && (
          <h2 className={`font-serif text-[#c5a059] uppercase font-bold transition-transform duration-1000 ease-out group-hover:[transform:translateZ(400px)] text-center px-12 max-w-full break-words ${icon ? 'text-[80px] mt-16 tracking-[0.3em]' : 'text-[100px] mb-12 tracking-[0.1em]'}`} style={{textShadow:'0 0 60px rgba(197,160,89,0.8)'}}>
            {title}
          </h2>
        )}
        
        {subtitle && (
          <p className="text-5xl text-[#c5a059]/80 font-light leading-relaxed max-w-5xl text-center transition-transform duration-700 ease-out group-hover:[transform:translateZ(200px)] whitespace-pre-wrap px-12">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const R = 250;
  const panelWidth = 210;
  
  const panelsData = [
    { title: "MMBarber Craft", subtitle: "IP: mc.mmbarber.cz\n\nPrémiový stavitelský svět." },
    { icon: <Scissors size={350} color="#c5a059" />, title: "Exclusive" },
    { title: "O Serveru", subtitle: "Kreativita se snoubí s luxusem.\nObarvuj, buduj, nech stopu." },
    { icon: <Scissors size={350} color="#c5a059" />, title: "Premium" },
    { title: "Kodex", subtitle: "Tvořte s elegancí.\nNeničte díla ostatních gentlemanů." },
    { icon: <Scissors size={350} color="#c5a059" />, title: "Luxury" },
    { title: "Ovládání", subtitle: "2x Klik - Editor Barev\nKolečko Myši - Pohled 1. Osoby" },
    { icon: <Scissors size={350} color="#c5a059" />, title: "Gentleman" },
  ];

  return (
    <group position={[0, 180, 0]}>
      {panelsData.map((data, i) => {
        const angle = i * (Math.PI / 4);
        const x = R * Math.sin(angle);
        const z = -R * Math.cos(angle);
        return (
          <WebWall 
            key={i}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
            content={<PanelBox {...data} />}
            width={panelWidth}
            isActive={activePanel === i}
            onActivate={() => setActivePanel(i)}
          />
        );
      })}
    </group>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const SAVE_KEY = 'mmbarber_mc_world_v13';

export default function VoxelBuilder({ pageData }: { pageData?: any }) {
  const defaultBlocks = useMemo(() => generateWorld(), []);
  const [blocks, setBlocks] = useState<PlacedBlock[]>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultBlocks;
  });

  const [hotbar, setHotbar] = useState<HotbarItem[]>(() =>
    ['grass','dirt','stone','oak','glass','water','sand','gold','lava','sign'].map((id,i)=>({id:`hb-${i}`,blockId:id}))
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState<GameMode>('build');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<{blockId:string;colors:string[]}|null>(null);
  const [signPending, setSignPending] = useState<{x:number;y:number;z:number}|null>(null);
  const [brushColor, setBrushColor] = useState('#4ade80');
  const [saveFlash, setSaveFlash] = useState(false);
  const controlsRef = useRef<any>(null);
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 10, 5));

  useSandGravity(blocks, setBlocks);

  const saveWorld = () => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(blocks));
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 2000);
    } catch {}
  };

  const resetWorld = () => {
    if (window.confirm('Opravdu resetovat svět? Tato akce je nevratná!')) {
      setBlocks(defaultBlocks);
      localStorage.removeItem(SAVE_KEY);
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = parseInt(e.key);
      if (n >= 1 && n <= hotbar.length) setActiveIdx(n-1);
      
      if (e.key==='e'||e.key==='E') {
        if (!isInventoryOpen && mode === 'play') document.exitPointerLock?.();
        setIsInventoryOpen(v=>!v);
      }
      
      if (e.key==='Tab') { e.preventDefault(); setMode(m=>m==='build'?'play':'build'); }
      if (e.key==='Escape') { setIsInventoryOpen(false); setEditingBlock(null); setSignPending(null); }
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  }, [hotbar.length, mode, isInventoryOpen]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('.allow-ctx')) e.preventDefault(); };
    document.addEventListener('contextmenu',h);
    return ()=>document.removeEventListener('contextmenu',h);
  }, []);

  const activeItem = hotbar[activeIdx];

  const addBlock = useCallback((x:number,y:number,z:number) => {
    if (!activeItem) return;
    const def = BLOCK_MAP[activeItem.blockId];
    if (def?.isSign) { setSignPending({x,y,z}); return; }
    const key=`${x}-${y}-${z}`;
    setBlocks(prev=>prev.find(b=>b.key===key)?prev:[...prev,{key,pos:[x,y,z],type:activeItem.blockId,customColors:activeItem.customColors}]);
  }, [activeItem, mode]);

  const removeBlock = useCallback((key:string)=>setBlocks(prev=>prev.filter(b=>b.key!==key)),[]);

  const handleSignConfirm = (text: string) => {
    if (!signPending) return;
    const {x,y,z}=signPending;
    const key=`${x}-${y}-${z}`;
    setBlocks(prev=>prev.find(b=>b.key===key)?prev:[...prev,{key,pos:[x,y,z],type:'sign',text}]);
    setSignPending(null);
  };

  const handleOpenEditor = (block:PlacedBlock) => {
    const def=BLOCK_MAP[block.type];
    if(!def||def.isSign) return;
    const base=block.customColors||def.colors||Array(6).fill(def.color);
    setEditingBlock({blockId:block.type,colors:[...base]});
  };

  const handleSaveEdited = (colors:string[],label:string) => {
    const newId=`hb-custom-${Date.now()}`;
    setHotbar(prev=>[...prev.slice(1),{id:newId,blockId:editingBlock!.blockId,customColors:colors,label}]);
    setEditingBlock(null);
  };

  const handleInventorySelect = (blockId:string) => {
    setHotbar(prev=>{const u=[...prev];u[activeIdx]={id:`hb-${Date.now()}`,blockId};return u;});
    setIsInventoryOpen(false);
  };

  const anyModal = isInventoryOpen || !!editingBlock || !!signPending;

  return (
    <div className="absolute inset-0 z-0 outline-none select-none overflow-hidden cursor-crosshair" style={{background:'linear-gradient(to bottom, #87CEEB 0%, #b0e0f0 60%, #c8f0d0 100%)'}} tabIndex={0} onPointerEnter={e=>!anyModal&&e.currentTarget.focus()}>
      
      {/* Modals */}
      {isInventoryOpen && <InventoryModal onClose={()=>setIsInventoryOpen(false)} onSelect={handleInventorySelect} />}
      {editingBlock && <BlockEditorModal editing={editingBlock} onClose={()=>setEditingBlock(null)} onSave={handleSaveEdited} brushColor={brushColor} setBrushColor={setBrushColor} />}
      {signPending && <SignEditorModal onConfirm={handleSignConfirm} onClose={()=>setSignPending(null)} />}

      {/* Top bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        {/* Mode toggle */}
        <button onClick={()=>setMode(m=>m==='build'?'play':'build')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all shadow-lg ${mode==='build' ? 'bg-amber-900/80 border-yellow-400/50 text-yellow-300 hover:bg-amber-800/80' : 'bg-green-900/80 border-green-400/50 text-green-300 hover:bg-green-800/80'}`}
        >
          {mode==='build' ? <><Hammer size={16} /> Stavět</> : <><Gamepad2 size={16} /> Hrát</>}
          <span className="text-[10px] opacity-50 font-mono ml-1">[Tab]</span>
        </button>

        {/* Save */}
        <button onClick={saveWorld}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition-all shadow-lg ${saveFlash ? 'bg-green-500/30 border-green-400 text-green-300' : 'bg-black/50 border-white/20 text-white/70 hover:text-white hover:bg-black/70'}`}
        >
          <Save size={16} /> {saveFlash ? 'Uloženo!' : 'Uložit svět'}
        </button>

        {/* Reset */}
        <button onClick={resetWorld}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border bg-red-900/40 border-red-500/30 text-red-400 hover:bg-red-900/70 transition-all shadow-lg"
        ><Trash2 size={16} /> Reset</button>
      </div>

      {/* Crosshair (Mode indicator) */}
      {mode === 'play' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none mix-blend-difference">
          <div className="w-4 h-[2px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-[2px] h-4 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}

      {/* Hotbar */}
      {mode === 'build' && (
        <div className="absolute bottom-0 inset-x-0 z-50 pointer-events-none">
          <div className="flex justify-center pb-6">
            <div className="pointer-events-auto bg-black/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2">
              {hotbar.map((item,idx)=>(
                <div key={item.id} className="relative">
                  <HotbarSwatch item={item} active={idx===activeIdx} onClick={()=>setActiveIdx(idx)} />
                  <span className="absolute -top-1 -left-1 text-[9px] font-mono text-white/40">{idx+1}</span>
                </div>
              ))}
              <div className="w-px h-10 bg-white/10 mx-1" />
              <button onClick={()=>setIsInventoryOpen(true)} title="Inventář [E]"
                className="pointer-events-auto w-12 h-12 rounded-xl border-2 border-dashed border-white/30 hover:border-yellow-400 hover:bg-yellow-400/10 flex items-center justify-center text-white/40 hover:text-yellow-400 transition-all"
              ><Plus size={18} /></button>
              <div className="w-px h-10 bg-white/10 mx-1" />
              <div className="flex flex-col text-[9px] font-mono text-white/30 space-y-0.5 pr-1">
                <p><span className="text-white/50">LKlik</span> Postavit</p>
                <p><span className="text-white/50">PKlik</span> Zničit</p>
                <p><span className="text-white/50">2×Klik</span> Upravit</p>
                <p><span className="text-white/50">WASD</span> Pohyb</p>
                <p><span className="text-white/50">Space/Q</span> Výška</p>
                <p><span className="text-white/50">Tab</span> Hrát</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'play' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-xl border border-white/10 text-white/50 text-xs font-mono text-center flex gap-4">
            <span><span className="text-white/80">Myš</span> Rozhlížení</span>
            <span><span className="text-white/80">L/P Klik</span> Stavět</span>
            <span><span className="text-white/80">E</span> Inventář</span>
            <span><span className="text-white/80">WASD</span> Pohyb</span>
            <span><span className="text-white/80">Tab</span> Kamera</span>
          </div>
        </div>
      )}

      {/* 3D World */}
      <Canvas camera={{position:[5,10,20],fov:70}} gl={{ antialias: false, powerPreference: 'high-performance' }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <fog attach="fog" args={['#87CEEB', mode === 'play' ? 15 : 60, mode === 'play' ? 35 : 150]} />
        <Sky sunPosition={[100,30,100]} turbidity={1} rayleigh={0.5} mieCoefficient={0.003} mieDirectionalG={0.9} />
        <Stars radius={200} depth={50} count={800} factor={3} saturation={0} fade />
        
        <MovingClouds />
        
        <SunMesh />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[30,50,30]} intensity={2} castShadow shadow-mapSize={[2048,2048]} />
        <pointLight position={[-10,5,10]} intensity={0.5} color="#7dd3fc" />
        
        <GiantWebRoom />
        <Ground addBlock={addBlock} mode={mode} />
        
        <BlocksRenderer blocks={blocks} addBlock={addBlock} removeBlock={removeBlock} onEdit={handleOpenEditor} mode={mode} />

        <PlayerController blocks={blocks} mode={mode} controlsRef={controlsRef} />
        
        <BuildCameraController controlsRef={controlsRef} enabled={mode==='build' && !anyModal} />
        
        {mode === 'build' ? (
          <OrbitControls 
            ref={controlsRef} 
            makeDefault 
            minDistance={1} 
            maxDistance={150} 
            enablePan={false} 
          />
        ) : (
          <PointerLockControls makeDefault />
        )}
      </Canvas>
    </div>
  );
}
