"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 0.2,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-mafia-gold border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-mafia-gold border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-mafia-gold border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-mafia-gold border-t-transparent border-b-transparent border-l-transparent",
  };

  const motionVariants = {
    hidden: { opacity: 0, scale: 0.95, y: position === "top" ? 5 : position === "bottom" ? -5 : 0, x: position === "left" ? 5 : position === "right" ? -5 : 0 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={motionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute z-50 pointer-events-none ${positionStyles[position]} ${className}`}
          >
            <div className="bg-black/95 backdrop-blur-md border border-mafia-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] px-3 py-2 rounded-md whitespace-nowrap">
              <span className="font-mono text-xs uppercase tracking-widest text-mafia-gold/90 font-bold">
                {content}
              </span>
            </div>
            
            {/* Arrow/Pointer */}
            <div
              className={`absolute border-[5px] ${arrowStyles[position]}`}
              style={{ width: 0, height: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
