"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as THREE from "three";

export type BuildingType = 'block' | 'house' | 'cylinder' | 'family_house' | 'factory' | 'pyramid' | 'bridge' | 'mosque' | 'church' | 'aqueduct' | 'wall' | 'fence' | 'parking_lot' | 'mall' | 'flowerbed' | 'water' | 'grass_platform' | 'dirt_platform' | 'hill_ramp';

export type BuildingData = {
  id: string;
  type: BuildingType;
  position: [number, number, number];
  rotationY?: number; // Rotace kolem Y osy (v radiánech)
  args: [number, number, number]; // width, height, depth
  color: string;
  hasNeon: boolean;
  neonColor: string;
  neonHeight: number;
  texOffset: [number, number];
  texRepeat: [number, number];
};

export type PropType = 'tree' | 'tree_oak' | 'bush' | 'fountain' | 'bench' | 'streetlamp' | 'gazebo' | 'rock' | 'trashbin' | 'billboard';

export type PropData = {
  id: string;
  type: PropType;
  position: [number, number, number];
  rotationY?: number; // Rotace kolem Y osy (v radiánech)
  scale: number;
};

export type IntersectionData = {
  id: string;
  x: number;
  z: number;
  lightDistance: number; // Nově přidáno pro kontrolu vzdálenosti semaforů
};

export type EditorState = {
  isEditMode: boolean;
  toggleEditMode: () => void;
  buildings: BuildingData[];
  setBuildings: React.Dispatch<React.SetStateAction<BuildingData[]>>;
  props: PropData[];
  setProps: React.Dispatch<React.SetStateAction<PropData[]>>;
  intersections: IntersectionData[];
  setIntersections: React.Dispatch<React.SetStateAction<IntersectionData[]>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateBuilding: (id: string, partialData: Partial<BuildingData>) => void;
  updateProp: (id: string, partialData: Partial<PropData>) => void;
  updateIntersection: (id: string, partialData: Partial<IntersectionData>) => void;
  addBuilding: (type?: BuildingType) => void;
  addProp: (type: PropType) => void;
  deleteSelected: () => void;
};

const EditorContext = createContext<EditorState | null>(null);

function generateDefaultCity() {
  const blocks: BuildingData[] = [];
  const intersections: IntersectionData[] = [];
  const props: PropData[] = [];
  const gridSize = 250; 
  const blockSize = 30; 

  const colors = ["#ffffff", "#cccccc", "#aaaaaa", "#888888"];
  const neonColors = ["#c5a059", "#ff0033", "#00ffcc", "#aa00ff", "#0066ff"];
  const buildingTypes: BuildingType[] = ['block', 'house', 'cylinder', 'family_house', 'factory', 'pyramid', 'bridge'];

  let idCounter = 0;

  for (let x = -gridSize; x <= gridSize; x += blockSize) {
    for (let z = -gridSize; z <= gridSize; z += blockSize) {
      if (Math.abs(x) < gridSize && Math.abs(z) < gridSize) {
        intersections.push({ id: `int-${idCounter++}`, x, z, lightDistance: 2 });
      }

      if (Math.abs(x) < 45 && Math.abs(z) < 45) {
        // Náměstí - vygenerujeme fontánu doprostřed
        if (x === 0 && z === 0) {
           props.push({ id: `prop-${idCounter++}`, type: 'fountain', position: [0, 0.5, 0], scale: 3 });
        }
        continue;
      }

      const distFromCenter = Math.sqrt(x * x + z * z);
      
      let chanceToBuild = 0.8;
      let maxHeight = 100;
      let minHeight = 40;
      
      if (distFromCenter > 150) {
        chanceToBuild = 0.5;
        maxHeight = 25;
        minHeight = 10;
      }

      if (Math.random() < chanceToBuild) {
        const height = minHeight + Math.pow(Math.random(), 2) * (maxHeight - minHeight);
        const isSuburb = distFromCenter > 150;
        const width = (16 + Math.random() * 8) * (isSuburb ? 1.5 : 1);
        const depth = (16 + Math.random() * 8) * (isSuburb ? 1.5 : 1);
        
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const hasNeon = !isSuburb && Math.random() > 0.7; 
        const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        
        let type: BuildingType = 'block';
        if (isSuburb) {
          type = Math.random() > 0.5 ? 'family_house' : 'house';
        } else {
          type = Math.random() > 0.8 ? 'cylinder' : Math.random() > 0.9 ? 'pyramid' : 'block';
        }
        
        blocks.push({
          id: `bldg-${idCounter++}`,
          type,
          position: [x + blockSize / 2, height / 2, z + blockSize / 2],
          args: [width, height, depth],
          color: baseColor,
          hasNeon,
          neonColor,
          neonHeight: height * 0.8,
          texOffset: [Math.random(), Math.random()],
          texRepeat: [width / 10, height / 10]
        });
      } else {
        // Prázdné místo - vygenerujeme občas strom nebo keř
        if (Math.random() > 0.5) {
          const propType = Math.random() > 0.7 ? 'bush' : (Math.random() > 0.5 ? 'tree_oak' : 'tree');
          props.push({ id: `prop-${idCounter++}`, type: propType, position: [x + blockSize / 2, 0, z + blockSize / 2], scale: 1 + Math.random() });
        }
      }
    }
  }
  return { blocks, intersections, props };
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [intersections, setIntersections] = useState<IntersectionData[]>([]);
  const [props, setProps] = useState<PropData[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("mafiaCityMap");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Zpětná kompatibilita: pokud staré ID nemělo prefix, přidáme ho
        const loadedBuildings = (parsed.buildings || parsed).map((b: any) => ({
          ...b,
          id: b.id.toString().startsWith('bldg-') ? b.id : `bldg-${b.id}`
        }));
        setBuildings(loadedBuildings);
        
        const loadedProps = (parsed.props || []).map((p: any) => ({
          ...p,
          id: p.id.toString().startsWith('prop-') ? p.id : `prop-${p.id}`
        }));
        setProps(loadedProps);
        
        const { intersections: ints } = generateDefaultCity();
        // Spojíme lokální křižovatky s vygenerovanými
        if (parsed.intersections) {
           const mergedInts = ints.map(i => {
             // Ošetření starých ID křižovatek
             const saved = parsed.intersections.find((si: IntersectionData) => 
               si.id === i.id || `int-${si.id}` === i.id || si.id === i.id.replace('int-', '')
             );
             return saved ? { ...i, ...saved, id: i.id } : i;
           });
           setIntersections(mergedInts);
        } else {
           setIntersections(ints);
        }
      } catch (e) {
        const generated = generateDefaultCity();
        setBuildings(generated.blocks);
        setIntersections(generated.intersections);
        setProps(generated.props);
      }
    } else {
      const generated = generateDefaultCity();
      setBuildings(generated.blocks);
      setIntersections(generated.intersections);
      setProps(generated.props);
    }
  }, []);

  const toggleEditMode = () => setIsEditMode((v) => !v);

  const updateBuilding = (id: string, partialData: Partial<BuildingData>) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...partialData } : b))
    );
  };

  const updateProp = (id: string, partialData: Partial<PropData>) => {
    setProps((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partialData } : p))
    );
  };

  const updateIntersection = (id: string, partialData: Partial<IntersectionData>) => {
    setIntersections((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...partialData } : i))
    );
  };

  const addBuilding = (type: BuildingType = 'block') => {
    const id = `bldg-${Math.random().toString(36).substr(2, 9)}`;
    const height = type === 'bridge' ? 5 : 20;
    const width = type === 'bridge' ? 20 : 10;
    const depth = type === 'bridge' ? 60 : 10;
    setBuildings((prev) => [
      ...prev,
      {
        id,
        type,
        position: [0, height / 2, 0],
        args: [width, height, depth],
        color: "#ffffff",
        hasNeon: false,
        neonColor: "#000",
        neonHeight: 0,
        texOffset: [Math.random(), Math.random()],
        texRepeat: [width / 10, height / 10],
      },
    ]);
    setSelectedId(id);
  };

  const addProp = (type: PropType) => {
    const id = `prop-${Math.random().toString(36).substr(2, 9)}`;
    setProps((prev) => [
      ...prev,
      {
        id,
        type,
        position: [0, 0.5, 0],
        scale: 1,
      },
    ]);
    setSelectedId(id);
  };

  const deleteSelected = () => {
    if (!selectedId || selectedId.startsWith('int-')) return;
    
    // Smažeme ať už je to budova nebo prop (pro jistotu oboje)
    setBuildings((prev) => prev.filter((b) => b.id !== selectedId));
    setProps((prev) => prev.filter((p) => p.id !== selectedId));
    
    setSelectedId(null);
  };

  return (
    <EditorContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        buildings,
        setBuildings,
        props,
        setProps,
        intersections,
        setIntersections,
        selectedId,
        setSelectedId,
        updateBuilding,
        updateProp,
        updateIntersection,
        addBuilding,
        addProp,
        deleteSelected,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
