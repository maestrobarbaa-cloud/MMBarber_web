"use client";

import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls, useTexture } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft, Trophy, PenTool, Save, Plus, Trash2, X } from "lucide-react";
import * as THREE from "three";

import { Car } from "./Car";
import { CityEnvironment } from "./CityEnvironment";
import { Collectibles } from "./Collectibles";
import { EditorProvider, useEditor, BuildingType, PropType } from "./EditorContext";

function Skybox() {
  const skyTexture = useTexture("/textures/skybox.jpg");
  return (
    <mesh>
      <sphereGeometry args={[400, 32, 32]} />
      <meshBasicMaterial map={skyTexture} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

function MafiaCityInner() {
  const [score, setScore] = useState(0);
  const [newBldgType, setNewBldgType] = useState<BuildingType>('block');
  const [newPropType, setNewPropType] = useState<PropType>('tree');
  const [newTerrainType, setNewTerrainType] = useState<BuildingType>('grass_platform');
  const { isEditMode, toggleEditMode, addBuilding, addProp, deleteSelected, buildings, props, intersections, selectedId, updateBuilding, updateProp, updateIntersection } = useEditor();

  const handleSave = () => {
    const data = JSON.stringify({ buildings, props, intersections });
    localStorage.setItem("mafiaCityMap", data);
    alert("Mapa uložena!");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "#000" }}>
      {/* Hlavní UI Overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        zIndex: 10,
        pointerEvents: "none"
      }}>
        <div style={{ display: "flex", gap: "10px", pointerEvents: "auto" }}>
          <Link 
            href="/3d-lab" 
            style={{
              background: "rgba(0,0,0,0.8)",
              border: "1px solid #c5a059",
              color: "#c5a059",
              padding: "10px 15px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              fontWeight: "bold"
            }}
          >
            <ArrowLeft size={18} />
            Zpět do Labu
          </Link>

          <button
            onClick={toggleEditMode}
            style={{
              background: isEditMode ? "#c5a059" : "rgba(0,0,0,0.8)",
              color: isEditMode ? "#000" : "#c5a059",
              border: "1px solid #c5a059",
              padding: "10px 15px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              fontWeight: "bold"
            }}
          >
            <PenTool size={18} />
            {isEditMode ? "Ukončit Editor" : "Editor Mapy"}
          </button>
        </div>

        {!isEditMode && (
          <div style={{
            background: "rgba(0,0,0,0.8)",
            border: "1px solid #c5a059",
            color: "#c5a059",
            padding: "15px 25px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "sans-serif",
            fontSize: "24px",
            fontWeight: "900"
          }}>
            <Trophy size={24} color="#c5a059" />
            {score}
          </div>
        )}
      </div>
      
      {/* Nápověda dole (Hra) */}
      {!isEditMode && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none"
        }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            fontFamily: "monospace",
            fontSize: "14px"
          }}>
            Ovládání: W, A, S, D nebo Šipky | Mezerník: Brzda
          </div>
        </div>
      )}

      {/* VÝVOJÁŘSKÝ PANEL (Editor) */}
      {isEditMode && (
        <div style={{
          position: "absolute",
          right: "20px",
          top: "80px",
          width: "300px",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          background: "rgba(10, 10, 12, 0.95)",
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "20px",
          color: "white",
          zIndex: 20,
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
        }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#c5a059", borderBottom: "1px solid #333", paddingBottom: "10px" }}>Nástroje Vývojáře</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              <select 
                value={newBldgType} 
                onChange={(e) => setNewBldgType(e.target.value as BuildingType)} 
                style={{ flex: 1, padding: "8px", background: "#333", color: "white", border: "1px solid #555", borderRadius: "6px" }}
              >
                <optgroup label="🏠 Základní budovy">
                  <option value="block">Mrakodrap</option>
                  <option value="house">Panelák se střechou</option>
                  <option value="family_house">Rodinný domek</option>
                  <option value="factory">Továrna</option>
                  <option value="mall">Obchodní centrum</option>
                </optgroup>
                <optgroup label="🏰 Historické & Speciální">
                  <option value="cylinder">Válec</option>
                  <option value="pyramid">Pyramida</option>
                  <option value="mosque">Mešita</option>
                  <option value="church">Kostel</option>
                </optgroup>
                <optgroup label="🛣️ Infrastruktura a Cesty">
                  <option value="bridge">Most</option>
                  <option value="aqueduct">Akvadukt</option>
                  <option value="wall">Zídka</option>
                  <option value="fence">Plot</option>
                  <option value="parking_lot">Parkoviště</option>
                  <option value="flowerbed">Květinový záhon</option>
                </optgroup>
              </select>
              <button onClick={() => addBuilding(newBldgType)} style={{ padding: "8px 12px", background: "#222", border: "1px solid #444", color: "white", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", cursor: "pointer", whiteSpace: "nowrap" }}>
                <Plus size={16} /> Strukturu
              </button>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <select 
                value={newTerrainType} 
                onChange={(e) => setNewTerrainType(e.target.value as BuildingType)} 
                style={{ flex: 1, padding: "8px", background: "#1a3a1a", color: "white", border: "1px solid #2a5a2a", borderRadius: "6px" }}
              >
                <optgroup label="🌍 Krajina a Voda">
                  <option value="grass_platform">Plošina (Tráva)</option>
                  <option value="dirt_platform">Plošina (Hlína)</option>
                  <option value="hill_ramp">Kopec / Svah</option>
                  <option value="water">Vodní plocha (Moře/Řeka)</option>
                </optgroup>
              </select>
              <button onClick={() => addBuilding(newTerrainType)} style={{ padding: "8px 12px", background: "#1a3a1a", border: "1px solid #2a5a2a", color: "white", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", cursor: "pointer", whiteSpace: "nowrap" }}>
                <Plus size={16} /> Terén
              </button>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <select 
                value={newPropType} 
                onChange={(e) => setNewPropType(e.target.value as PropType)} 
                style={{ flex: 1, padding: "8px", background: "#333", color: "white", border: "1px solid #555", borderRadius: "6px" }}
              >
                <optgroup label="🌲 Příroda">
                  <option value="tree">Jehličnan</option>
                  <option value="tree_oak">Listnáč</option>
                  <option value="bush">Keř</option>
                  <option value="rock">Skála</option>
                </optgroup>
                <optgroup label="🏙️ Městské Doplňky">
                  <option value="fountain">Fontána</option>
                  <option value="bench">Lavička</option>
                  <option value="streetlamp">Lampa</option>
                  <option value="gazebo">Odpočívadlo (Altán)</option>
                  <option value="trashbin">Odpadkový koš</option>
                  <option value="billboard">Billboard</option>
                </optgroup>
              </select>
              <button onClick={() => addProp(newPropType)} style={{ padding: "8px 12px", background: "#222", border: "1px solid #444", color: "white", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", cursor: "pointer", whiteSpace: "nowrap" }}>
                <Plus size={16} /> Dekoraci
              </button>
            </div>

            <button onClick={deleteSelected} disabled={!selectedId || selectedId.startsWith('int-')} style={{ padding: "8px", background: selectedId && !selectedId.startsWith('int-') ? "#520" : "#222", border: "1px solid #444", color: selectedId && !selectedId.startsWith('int-') ? "#f55" : "#666", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", cursor: selectedId && !selectedId.startsWith('int-') ? "pointer" : "not-allowed" }}>
              <Trash2 size={16} /> Smazat vybrané
            </button>
          </div>

          <button onClick={handleSave} style={{ padding: "10px", background: "#c5a059", border: "none", color: "black", fontWeight: "bold", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
            <Save size={18} /> Uložit Mapu do LS
          </button>

          {selectedId && (
            <div style={{ marginTop: "10px", padding: "10px", background: "#1a1a1a", borderRadius: "8px", border: "1px dashed #444" }}>
              {selectedId.startsWith('bldg-') && (() => {
                const b = buildings.find(x => x.id === selectedId);
                if (!b) return null;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                    <h3 style={{ margin: "0", fontSize: "14px", color: "#aaa" }}>Vlastnosti struktury (Modelu)</h3>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", color: "#888" }}>Vybraný Typ:</label>
                      <select 
                        value={b.type}
                        onChange={(e) => updateBuilding(b.id, { type: e.target.value as any })}
                        style={{ width: "100%", padding: "5px", background: "#333", color: "white", border: "1px solid #555", borderRadius: "4px" }}
                      >
                        <optgroup label="🏠 Základní budovy">
                          <option value="block">Mrakodrap</option>
                          <option value="house">Panelák se střechou</option>
                          <option value="family_house">Rodinný domek</option>
                          <option value="factory">Továrna</option>
                          <option value="mall">Obchodní centrum</option>
                        </optgroup>
                        <optgroup label="🏰 Historické & Speciální">
                          <option value="cylinder">Válec</option>
                          <option value="pyramid">Pyramida</option>
                          <option value="mosque">Mešita</option>
                          <option value="church">Kostel</option>
                        </optgroup>
                        <optgroup label="🛣️ Infrastruktura a Cesty">
                          <option value="bridge">Most</option>
                          <option value="aqueduct">Akvadukt</option>
                          <option value="wall">Zídka</option>
                          <option value="fence">Plot</option>
                          <option value="parking_lot">Parkoviště</option>
                          <option value="flowerbed">Květinový záhon</option>
                        </optgroup>
                        <optgroup label="🌍 Krajina a Voda">
                          <option value="grass_platform">Plošina (Tráva)</option>
                          <option value="dirt_platform">Plošina (Hlína)</option>
                          <option value="hill_ramp">Kopec / Svah</option>
                          <option value="water">Vodní plocha (Moře/Řeka)</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Základní barva:</span>
                      </label>
                      <input 
                        type="color" 
                        value={b.color}
                        onChange={(e) => updateBuilding(b.id, { color: e.target.value })}
                        style={{ width: "100%", height: "30px", border: "none", cursor: "pointer", background: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Šířka (X):</span>
                        <span>{Math.round(b.args[0])}</span>
                      </label>
                      <input 
                        type="range" 
                        min="5" max="100" step="1"
                        value={b.args[0]}
                        onChange={(e) => {
                          const newWidth = parseFloat(e.target.value);
                          updateBuilding(b.id, { 
                            args: [newWidth, b.args[1], b.args[2]]
                          });
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>

                    {b.type !== 'parking_lot' && b.type !== 'flowerbed' && b.type !== 'water' && b.type !== 'grass_platform' && b.type !== 'dirt_platform' && (
                      <div>
                        <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                          <span>Výška (Y):</span>
                          <span>{Math.round(b.args[1])}</span>
                        </label>
                        <input 
                          type="range" 
                          min="5" max="200" step="1"
                          value={b.args[1]}
                          onChange={(e) => {
                            const newHeight = parseFloat(e.target.value);
                            updateBuilding(b.id, { 
                              args: [b.args[0], newHeight, b.args[2]],
                              position: [b.position[0], newHeight / 2, b.position[2]] 
                            });
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Hloubka (Z):</span>
                        <span>{Math.round(b.args[2])}</span>
                      </label>
                      <input 
                        type="range" 
                        min="5" max="100" step="1"
                        value={b.args[2]}
                        onChange={(e) => {
                          const newDepth = parseFloat(e.target.value);
                          updateBuilding(b.id, { 
                            args: [b.args[0], b.args[1], newDepth]
                          });
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Rotace (stupně):</span>
                        <span>{b.rotationY ? Math.round((b.rotationY * 180) / Math.PI) : 0}°</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" max="360" step="5"
                        value={b.rotationY ? (b.rotationY * 180) / Math.PI : 0}
                        onChange={(e) => updateBuilding(b.id, { rotationY: (parseFloat(e.target.value) * Math.PI) / 180 })}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                );
              })()}

              {selectedId.startsWith('prop-') && (() => {
                const p = props.find(x => x.id === selectedId);
                if (!p) return null;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                    <h3 style={{ margin: "0", fontSize: "14px", color: "#aaa" }}>Vlastnosti dekorace</h3>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", color: "#888" }}>Typ dekorace:</label>
                      <select 
                        value={p.type}
                        onChange={(e) => updateProp(p.id, { type: e.target.value as any })}
                        style={{ width: "100%", padding: "5px", background: "#333", color: "white", border: "1px solid #555", borderRadius: "4px" }}
                      >
                        <optgroup label="🌲 Příroda">
                          <option value="tree">Jehličnan</option>
                          <option value="tree_oak">Listnáč</option>
                          <option value="bush">Keř</option>
                          <option value="rock">Skála</option>
                        </optgroup>
                        <optgroup label="🏙️ Městské Doplňky">
                          <option value="fountain">Fontána</option>
                          <option value="bench">Lavička</option>
                          <option value="streetlamp">Lampa</option>
                          <option value="gazebo">Odpočívadlo (Altán)</option>
                          <option value="trashbin">Odpadkový koš</option>
                          <option value="billboard">Billboard</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Velikost:</span>
                        <span>{p.scale.toFixed(1)}</span>
                      </label>
                      <input 
                        type="range" 
                        min="0.5" max="10" step="0.1"
                        value={p.scale}
                        onChange={(e) => updateProp(p.id, { scale: parseFloat(e.target.value) })}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Rotace (stupně):</span>
                        <span>{p.rotationY ? Math.round((p.rotationY * 180) / Math.PI) : 0}°</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" max="360" step="5"
                        value={p.rotationY ? (p.rotationY * 180) / Math.PI : 0}
                        onChange={(e) => updateProp(p.id, { rotationY: (parseFloat(e.target.value) * Math.PI) / 180 })}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                );
              })()}

              {selectedId.startsWith('int-') && (() => {
                const int = intersections.find(x => x.id === selectedId);
                if (!int) return null;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                    <h3 style={{ margin: "0", fontSize: "14px", color: "#aaa" }}>Křižovatka a Semafory</h3>
                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#888" }}>
                        <span>Vzdálenost semaforů od středu:</span>
                        <span>{int.lightDistance}</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" max="10" step="0.5"
                        value={int.lightDistance}
                        onChange={(e) => updateIntersection(int.id, { lightDistance: parseFloat(e.target.value) })}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                );
              })()}

              {!selectedId.startsWith('int-') && (
                <button 
                  onClick={deleteSelected} 
                  style={{ 
                    marginTop: "15px", 
                    width: "100%", 
                    padding: "10px", 
                    background: "#8b0000", 
                    border: "none", 
                    color: "white", 
                    fontWeight: "bold", 
                    borderRadius: "6px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "8px", 
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.5)"
                  }}
                >
                  <Trash2 size={16} /> Odstranit vybraný objekt
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* V editoru nepotřebujeme temnou mlhu, aby bylo vidět celé město */}
        {!isEditMode && <fog attach="fog" args={["#0a0a0c", 20, 250]} />}
        
        <Suspense fallback={null}>
          <Skybox />
          
          <ambientLight intensity={isEditMode ? 0.5 : 0.15} />
          <directionalLight castShadow position={[50, 80, -50]} intensity={1} shadow-mapSize={[2048, 2048]} />
          
          {isEditMode && <OrbitControls makeDefault />}

          <Physics paused={isEditMode}>
            {/* Auto nenecháme vykreslovat v editoru, aby nepřekáželo při stavění? Nebo jen vypneme fyziku. Zde necháme render, protože physics is paused. */}
            {!isEditMode && <Car />}
            <CityEnvironment />
            <Collectibles onCollect={() => setScore(s => s + 10)} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function MafiaCityGame() {
  useEffect(() => {
    let lang = 'en';
    if (typeof navigator !== 'undefined') {
      lang = navigator.language.slice(0, 2).toLowerCase();
    }
    
    const messages: Record<string, string> = {
      cs: "Vybuduj si vlastní město! 🌆 MM Barber - ",
      sk: "Vybuduj si vlastné mesto! 🌆 MM Barber - ",
      en: "Build your own city! 🌆 MM Barber - ",
      de: "Baue deine eigene Stadt! 🌆 MM Barber - ",
      ru: "Построй свой собственный город! 🌆 MM Barber - ",
      es: "¡Construye tu propia ciudad! 🌆 MM Barber - ",
      fr: "Construisez votre propre ville ! 🌆 MM Barber - "
    };
    
    let text = messages[lang] || messages['en'];
    const originalTitle = document.title;
    
    const interval = setInterval(() => {
      text = text.substring(1) + text.substring(0, 1);
      document.title = text;
    }, 350); // Rychlost posouvání

    return () => {
      clearInterval(interval);
      document.title = originalTitle;
    };
  }, []);

  return (
    <EditorProvider>
      <MafiaCityInner />
    </EditorProvider>
  );
}
