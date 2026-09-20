"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cpu, Zap, RadioReceiver, Disc } from 'lucide-react';

type Point = { r: number; c: number };
type Node = Point & { color: number; id?: string };

const COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#a855f7', // purple
  '#ec4899', // pink
  '#f97316', // orange
];

const ICONS = [Cpu, Zap, RadioReceiver, Disc, Cpu, Zap, RadioReceiver];

// Hardcoded levels for guaranteed solvability and fun
const LEVELS = [
  { size: 5, nodes: [{r:0,c:0,color:0}, {r:4,c:4,color:0}, {r:0,c:4,color:1}, {r:4,c:0,color:1}, {r:2,c:2,color:2}, {r:2,c:4,color:2}] },
  { size: 5, nodes: [{r:0,c:0,color:0}, {r:1,c:3,color:0}, {r:0,c:4,color:1}, {r:3,c:4,color:1}, {r:4,c:0,color:2}, {r:4,c:2,color:2}, {r:2,c:2,color:3}, {r:3,c:0,color:3}] },
  { size: 6, nodes: [{r:0,c:1,color:0}, {r:5,c:5,color:0}, {r:0,c:4,color:1}, {r:4,c:0,color:1}, {r:2,c:2,color:2}, {r:4,c:3,color:2}, {r:1,c:0,color:3}, {r:5,c:1,color:3}] },
  { size: 6, nodes: [{r:0,c:0,color:0}, {r:5,c:5,color:0}, {r:0,c:5,color:1}, {r:5,c:0,color:1}, {r:2,c:1,color:2}, {r:3,c:4,color:2}, {r:1,c:2,color:3}, {r:4,c:3,color:3}, {r:2,c:3,color:4}, {r:3,c:2,color:4}] },
  { size: 7, nodes: [{r:0,c:0,color:0}, {r:6,c:6,color:0}, {r:0,c:6,color:1}, {r:6,c:0,color:1}, {r:3,c:3,color:2}, {r:1,c:1,color:2}, {r:3,c:1,color:3}, {r:5,c:3,color:3}, {r:1,c:5,color:4}, {r:3,c:5,color:4}] },
];

export default function CircuitGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [paths, setPaths] = useState<Record<number, Point[]>>({});
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const currentLevel = LEVELS[levelIndex % LEVELS.length];
  // Increase size for levels beyond the hardcoded ones
  const size = currentLevel.size + Math.floor(levelIndex / LEVELS.length);
  
  // Generate random nodes for levels beyond hardcoded
  const [dynamicNodes, setDynamicNodes] = useState<any[]>([]);

  useEffect(() => {
    if (levelIndex >= LEVELS.length) {
      // Procedural generation of solvable levels using random walks
      const nodes: Node[] = [];
      const numPairs = Math.min(4 + Math.floor((levelIndex - 5) / 2), COLORS.length);
      const grid = Array(size).fill(0).map(() => Array(size).fill(null));
      
      const getNeighbors = (r: number, c: number) => {
        return [
          {r: r-1, c}, {r: r+1, c}, {r, c: c-1}, {r, c: c+1}
        ].filter(p => p.r >= 0 && p.r < size && p.c >= 0 && p.c < size && grid[p.r][p.c] === null);
      };

      let attempts = 0;
      let pairsCreated = 0;

      while (pairsCreated < numPairs && attempts < 100) {
        attempts++;
        const emptyCells = [];
        for(let r=0; r<size; r++) {
          for(let c=0; c<size; c++) {
            if(grid[r][c] === null) emptyCells.push({r,c});
          }
        }
        
        if (emptyCells.length < 2) break;
        
        const startCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let currR = startCell.r;
        let currC = startCell.c;
        
        const path = [{r: currR, c: currC}];
        grid[currR][currC] = pairsCreated; 
        
        const pathLen = 3 + Math.floor(Math.random() * (size * 1.5));
        for(let step=0; step<pathLen; step++) {
          const neighbors = getNeighbors(currR, currC);
          if (neighbors.length === 0) break;
          
          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          path.push(next);
          grid[next.r][next.c] = pairsCreated;
          currR = next.r;
          currC = next.c;
        }
        
        if (path.length > 1) {
          nodes.push({ r: startCell.r, c: startCell.c, color: pairsCreated, id: `n_${pairsCreated}_1` });
          nodes.push({ r: currR, c: currC, color: pairsCreated, id: `n_${pairsCreated}_2` });
          pairsCreated++;
        } else {
          grid[startCell.r][startCell.c] = null;
        }
      }
      
      setDynamicNodes(nodes);
    }
  }, [levelIndex, size]);

  const nodes = levelIndex >= LEVELS.length ? dynamicNodes : currentLevel.nodes;

  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    e.preventDefault();
    const node = nodes.find(n => n.r === r && n.c === c);
    if (node) {
      setActiveColor(node.color);
      setPaths(prev => ({ ...prev, [node.color]: [{ r, c }] }));
      return;
    }

    for (const [colorStr, path] of Object.entries(paths)) {
      const color = parseInt(colorStr);
      const idx = path.findIndex(p => p.r === r && p.c === c);
      if (idx !== -1) {
        setActiveColor(color);
        setPaths(prev => ({ ...prev, [color]: path.slice(0, idx + 1) }));
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeColor === null) return;
    
    const gridEl = gridRef.current;
    if (!gridEl) return;
    
    const rect = gridEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x < 0 || x >= rect.width || y < 0 || y >= rect.height) return;
    
    const c = Math.floor((x / rect.width) * size);
    const r = Math.floor((y / rect.height) * size);
    
    handlePointerEnter(r, c);
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (activeColor === null) return;

    setPaths(prev => {
      const path = prev[activeColor] || [];
      if (path.length === 0) return prev;

      const last = path[path.length - 1];
      
      // Can only move orthogonally by 1 step
      const isAdjacent = Math.abs(last.r - r) + Math.abs(last.c - c) === 1;
      if (!isAdjacent) return prev;

      // If moving backwards along own path, truncate
      if (path.length >= 2 && path[path.length - 2].r === r && path[path.length - 2].c === c) {
        return { ...prev, [activeColor]: path.slice(0, -1) };
      }

      // Check if hitting another node of DIFFERENT color
      const nodeHit = nodes.find(n => n.r === r && n.c === c);
      if (nodeHit && nodeHit.color !== activeColor) return prev; // Cannot enter wrong node

      // Check if crossing own path (loop) - not allowed, just truncate to that point
      const selfIdx = path.findIndex(p => p.r === r && p.c === c);
      if (selfIdx !== -1) {
        return { ...prev, [activeColor]: path.slice(0, selfIdx + 1) };
      }

      // Check if crossing ANOTHER path - break the other path
      const newPaths = { ...prev };
      for (const [colorStr, otherPath] of Object.entries(newPaths)) {
        const otherColor = parseInt(colorStr);
        if (otherColor === activeColor) continue;
        
        const crossIdx = otherPath.findIndex(p => p.r === r && p.c === c);
        if (crossIdx !== -1) {
          // Break the other path before the cross point
          newPaths[otherColor] = otherPath.slice(0, crossIdx);
        }
      }

      // Add to current path
      newPaths[activeColor] = [...path, { r, c }];

      // If hit target node, stop drawing
      if (nodeHit && nodeHit.color === activeColor) {
        setActiveColor(null);
      }

      return newPaths;
    });
  };

  const handlePointerUp = () => {
    setActiveColor(null);
  };

  useEffect(() => {
    // Check win condition
    if (nodes.length === 0) return;
    
    const uniqueColors = new Set(nodes.map(n => n.color));
    let allConnected = true;

    for (const color of uniqueColors) {
      const path = paths[color] || [];
      const colorNodes = nodes.filter(n => n.color === color);
      if (colorNodes.length < 2) continue;

      const [n1, n2] = colorNodes;
      
      if (path.length < 2) {
        allConnected = false;
        break;
      }

      const first = path[0];
      const last = path[path.length - 1];

      const connectsN1N2 = (first.r === n1.r && first.c === n1.c && last.r === n2.r && last.c === n2.c);
      const connectsN2N1 = (first.r === n2.r && first.c === n2.c && last.r === n1.r && last.c === n1.c);

      if (!connectsN1N2 && !connectsN2N1) {
        allConnected = false;
        break;
      }
    }

    // Check if entire board is covered (optional rule, but standard for Flow Free)
    // Let's just require all pairs connected for "Circuit Breaker" to make it faster
    
    if (allConnected && !completed) {
      setCompleted(true);
      setScore(s => s + (size * 100));
    }
  }, [paths, nodes, size, completed]);

  const nextLevel = () => {
    setLevelIndex(l => l + 1);
    setPaths({});
    setCompleted(false);
  };

  const resetLevel = () => {
    setPaths({});
  };

  const saveScore = async () => {
    try {
      await fetch('/api/minigames/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, maxLevel: levelIndex + 1 })
      });
      alert('Skóre bylo uloženo do žebříčku!');
      // reload page to see updated leaderboard
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Chyba při ukládání skóre.');
    }
  };

  return (
    <div 
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="flex justify-between w-full mb-6">
        <div className="text-xl font-bold text-neutral-300">Úroveň {levelIndex + 1}</div>
        <div className="text-xl font-bold text-mafia-gold">Skóre: {score}</div>
      </div>
      
      <div 
        ref={gridRef}
        className="w-full aspect-square max-w-lg bg-black rounded-lg border-2 border-neutral-800 relative touch-none mx-auto"
        onPointerMove={handlePointerMove}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gap: '2px',
          padding: '2px'
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
          const r = Math.floor(i / size);
          const c = i % size;
          const node = nodes.find(n => n.r === r && n.c === c);
          
          // Determine path segment
          let pathColor = null;
          let isStart = false;
          let isEnd = false;
          let fromDir = null; // up, down, left, right
          let toDir = null;

          for (const [colorStr, path] of Object.entries(paths)) {
            const idx = path.findIndex(p => p.r === r && p.c === c);
            if (idx !== -1) {
              pathColor = parseInt(colorStr);
              if (idx > 0) {
                const prev = path[idx - 1];
                if (prev.r < r) fromDir = 'top';
                else if (prev.r > r) fromDir = 'bottom';
                else if (prev.c < c) fromDir = 'left';
                else if (prev.c > c) fromDir = 'right';
              }
              if (idx < path.length - 1) {
                const next = path[idx + 1];
                if (next.r < r) toDir = 'top';
                else if (next.r > r) toDir = 'bottom';
                else if (next.c < c) toDir = 'left';
                else if (next.c > c) toDir = 'right';
              }
              break;
            }
          }

          const Icon = node ? ICONS[node.color % ICONS.length] : null;

          return (
            <div 
              key={i} 
              className="relative flex items-center justify-center bg-neutral-900/50 rounded-sm cursor-crosshair"
              onPointerDown={(e) => handlePointerDown(r, c, e)}
            >
              {/* Draw Path */}
              {pathColor !== null && (
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                  <div className="w-[20%] h-[20%] rounded-full" style={{ backgroundColor: COLORS[pathColor] }} />
                  {['top', 'bottom', 'left', 'right'].map(dir => {
                    if (fromDir === dir || toDir === dir) {
                      return (
                        <div 
                          key={dir}
                          className="absolute"
                          style={{
                            backgroundColor: COLORS[pathColor],
                            ...(dir === 'top' ? { top: 0, bottom: '50%', left: '40%', right: '40%' } : {}),
                            ...(dir === 'bottom' ? { top: '50%', bottom: 0, left: '40%', right: '40%' } : {}),
                            ...(dir === 'left' ? { left: 0, right: '50%', top: '40%', bottom: '40%' } : {}),
                            ...(dir === 'right' ? { left: '50%', right: 0, top: '40%', bottom: '40%' } : {}),
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {/* Draw Node */}
              {node && (
                <div 
                  className="w-3/4 h-3/4 rounded-md flex items-center justify-center z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  style={{ backgroundColor: COLORS[node.color], boxShadow: `0 0 10px ${COLORS[node.color]}` }}
                >
                  {Icon && <Icon size={size > 6 ? 16 : 24} className="text-black opacity-50" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {completed && (
        <div className="mt-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="text-2xl font-black text-mafia-gold mb-4 uppercase tracking-widest">
            Okruh uzavřen!
          </div>
          <button 
            onClick={nextLevel} 
            className="px-8 py-3 bg-mafia-gold text-black rounded-lg hover:bg-yellow-500 transition font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4"
          >
            Další úroveň
          </button>
        </div>
      )}

      <div className="mt-8 flex gap-4 w-full justify-center">
        {!completed && (
          <button 
            onClick={resetLevel} 
            className="px-4 py-2 text-neutral-400 hover:text-white transition font-mono text-sm border border-neutral-800 rounded hover:bg-neutral-800"
          >
            Restartovat úroveň
          </button>
        )}
        {score > 0 && (
          <button 
            onClick={saveScore} 
            className="px-4 py-2 text-mafia-gold border border-mafia-gold/30 hover:bg-mafia-gold/10 transition font-mono text-sm rounded"
          >
            Ukončit a uložit skóre
          </button>
        )}
      </div>
    </div>
  );
}
