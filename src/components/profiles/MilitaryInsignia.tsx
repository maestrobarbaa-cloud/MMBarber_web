import { motion } from "framer-motion";

export const MilitaryInsignia = ({ level, color = "currentColor", size = 36 }: { level: number, color?: string, size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="overflow-visible" style={{ color }}>
      <defs>
        <filter id="insigniaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#insigniaGlow)">
        {/* Level 0: FOUNDATION */}
        {level === 0 && (
          <motion.circle 
            cx="12" cy="12" r="4" 
            fill="none" stroke="currentColor" 
            strokeWidth="1.5" strokeDasharray="1 3"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="opacity-20"
          />
        )}

        {/* Levels 1-6: REFINED TACTICAL CHEVRONS (Lower Ranks) */}
        {level >= 1 && level <= 6 && (
          <g>
            {/* Standard Chevrons (V-Shapes) */}
            {level >= 1 && <path d="M4 10.5 L12 14.5 L20 10.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            {level >= 2 && <path d="M4 7.5 L12 11.5 L20 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            {level >= 3 && <path d="M4 4.5 L12 8.5 L20 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            
            {/* Rockers (Curved Arcs at Bottom - Inverted style) - Flatter radii for authentic look */}
            {level >= 4 && <path d="M5 14 A 25 25 0 0 0 19 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            {level >= 5 && <path d="M6 16.5 A 22 22 0 0 0 18 16.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            {level >= 6 && <path d="M7 19 A 20 20 0 0 0 17 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
            
            {/* Precision Detail (Inner line) */}
            <path d="M12 8.5 L12 11.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
          </g>
        )}

        {/* Levels 7-10: HIGH RANK COMMAND (Stars only) */}
        {level >= 7 && (
          <g>
            {/* Level 7: Single Central Star */}
            {level === 7 && (
              <motion.path 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                fill="currentColor" 
              />
            )}

            {/* Level 8: Dual Horizontal Stars */}
            {level === 8 && (
              <g>
                <motion.path 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: -5, opacity: 1 }}
                  d="M12 6 L13.5 11 L18.5 11 L14.5 14 L16 19 L12 16.5 L8 19 L9.5 14 L5.5 11 L10.5 11 Z" 
                  fill="currentColor" 
                  className="scale-75 origin-center"
                />
                <motion.path 
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 5, opacity: 1 }}
                  d="M12 6 L13.5 11 L18.5 11 L14.5 14 L16 19 L12 16.5 L8 19 L9.5 14 L5.5 11 L10.5 11 Z" 
                  fill="currentColor" 
                  className="scale-75 origin-center"
                />
              </g>
            )}

            {/* Level 9: Triple Star Formation (Triangle) */}
            {level === 9 && (
              <g>
                <motion.path 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: -4, opacity: 1 }}
                  d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                  fill="currentColor" 
                  className="scale-60 origin-center"
                />
                <motion.path 
                  initial={{ x: -10, y: 10, opacity: 0 }}
                  animate={{ x: -6, y: 4, opacity: 1 }}
                  d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                  fill="currentColor" 
                  className="scale-60 origin-center"
                />
                <motion.path 
                  initial={{ x: 10, y: 10, opacity: 0 }}
                  animate={{ x: 6, y: 4, opacity: 1 }}
                  d="M12 4 L13.5 9 L18.5 9 L14.5 12 L16 17 L12 14.5 L8 17 L9.5 12 L5.5 9 L10.5 9 Z" 
                  fill="currentColor" 
                  className="scale-60 origin-center"
                />
                {/* Tactical Ring */}
                <motion.circle 
                  cx="12" cy="11" r="9" 
                  fill="none" stroke="currentColor" 
                  strokeWidth="0.5" strokeDasharray="2 2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="opacity-40"
                />
              </g>
            )}

            {/* Level 10: ELITE MARSHAL / AUDITED BOSS (Central focal point) */}
            {level === 10 && (
              <g>
                <motion.path
                  d="M12 2 L20 10 L12 22 L4 10 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M12 5 L17 10 L12 17 L7 10 Z"
                  fill="currentColor"
                  className="opacity-30"
                />
                {/* Rotating Inner Star */}
                <motion.path 
                  d="M12 7 L13 9 L15 9 L13.5 10.5 L14 12.5 L12 11.5 L10 12.5 L10.5 10.5 L9 9 L11 9 Z" 
                  fill="currentColor"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}

            {/* Level 11: OFICIÁLNÍ KRÁL FADEU (Tactical Crown & Crest) */}
            {level === 11 && (
              <g>
                <motion.path
                  d="M12 2 L20 6 L18 16 L12 22 L6 16 L4 6 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="opacity-60"
                />
                {/* Crown shape */}
                <motion.path
                  d="M7 14 L9 9 L12 12 L15 9 L17 14 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                <circle cx="7" cy="14" r="1" fill="currentColor" />
                <circle cx="17" cy="14" r="1" fill="currentColor" />
              </g>
            )}

            {/* Level 12: ŽIVOUCÍ LEGENDA (Double Overlapping Rotating Seals) */}
            {level === 12 && (
              <g>
                <motion.path
                  d="M12 2 L22 12 L12 22 L2 12 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  animate={{ rotate: 90 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M12 2 L22 12 L12 22 L2 12 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{ rotate: -90 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                {/* Cross of Honor */}
                <motion.path
                  d="M12 7 L12 17 M7 12 L17 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </g>
            )}

            {/* Level 13: CEO REALITY (Ultimate Grand Badge & Stars) */}
            {level === 13 && (
              <g>
                {/* Outer Rotating Tactical Dashed Circle */}
                <motion.circle 
                  cx="12" cy="12" r="11" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeDasharray="4 2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                {/* Grand Diamond Shield */}
                <path
                  d="M12 3 L21 12 L12 21 L3 12 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                {/* 3 Central Stars */}
                <g className="scale-75 origin-center translate-x-[3px] translate-y-[3px]">
                  <motion.path 
                    d="M12 5 L13 8 L16 8 L13.5 10 L14 13 L12 11 L10 13 L10.5 10 L8 8 L11 8 Z" 
                    fill="currentColor"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <path d="M7 11 L8 13 L10 13 L8.5 14.5 L9 16.5 L7 15 L5 16.5 L5.5 14.5 L4 13 L6 13 Z" fill="currentColor" className="opacity-75" />
                  <path d="M17 11 L18 13 L20 13 L18.5 14.5 L19 16.5 L17 15 L15 16.5 L15.5 14.5 L14 13 L16 13 Z" fill="currentColor" className="opacity-75" />
                </g>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
};
