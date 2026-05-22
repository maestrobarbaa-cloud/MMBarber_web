"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";

interface UnlockDiagramProps {
  required: number;
  collected: number;
  className?: string;
  size?: number;
}

export function UnlockDiagram({ required, collected, className = "", size = 300 }: UnlockDiagramProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const nodes = Array.from({ length: required });

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0 z-0">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(197,160,89,0.3)" />
            <stop offset="100%" stopColor="rgba(197,160,89,0)" />
          </radialGradient>
        </defs>

        {/* Draw lines first so they are behind nodes */}
        {nodes.map((_, i) => {
          const angle = (i / required) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = i < collected;

          return (
            <motion.line
              key={`line-${i}`}
              x1={x}
              y1={y}
              x2={center}
              y2={center}
              stroke={isActive ? "var(--color-mafia-gold)" : "rgba(255,255,255,0.1)"}
              strokeWidth={isActive ? 2 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 0.8 : 0.3 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className={isActive ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" : ""}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((_, i) => {
          const angle = (i / required) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = i < collected;

          return (
            <motion.g
              key={`node-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.5, type: "spring" }}
            >
              <circle
                cx={x}
                cy={y}
                r={isActive ? 12 : 8}
                fill={isActive ? "var(--color-mafia-gold)" : "#111"}
                stroke={isActive ? "#fff" : "rgba(255,255,255,0.2)"}
                strokeWidth={isActive ? 2 : 1}
                className={isActive ? "drop-shadow-[0_0_10px_rgba(197,160,89,0.8)]" : ""}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* Central Node (Question Mark) */}
      <motion.div 
        className="relative z-10 flex items-center justify-center bg-mafia-black border-4 border-mafia-gold/30 rounded-full shadow-[0_0_30px_rgba(197,160,89,0.2)]"
        style={{ width: size * 0.4, height: size * 0.4 }}
        animate={{
          boxShadow: collected > 0 
            ? `0 0 ${20 + collected * 5}px rgba(197,160,89,${0.2 + (collected / required) * 0.5})`
            : "0 0 10px rgba(197,160,89,0.1)"
        }}
      >
        <span className="text-mafia-gold/60 font-heading font-black italic drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" style={{ fontSize: size * 0.2 }}>
          ?
        </span>
        {/* Glow effect that intensifies based on collected fragments */}
        <div 
          className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none"
          style={{ 
            background: "radial-gradient(circle, rgba(197,160,89,0.4) 0%, transparent 70%)",
            opacity: collected / required
          }}
        />
      </motion.div>
    </div>
  );
}
