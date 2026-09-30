"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/contexts/UIContext";
import { motion, AnimatePresence } from "framer-motion";

export function SlovackoEvent() {
  const [isActive, setIsActive] = useState(false);
  const { atmosphereOverride } = useUI();

  useEffect(() => {
    const checkEvent = () => {
      const now = new Date();
      const month = now.getMonth(); // 0 is Jan, 8 is Sep
      const date = now.getDate();
      
      // Hody and Slavnosti Vína are usually early-mid September (e.g. Sept 1 - Sept 15)
      const isEventTime = month === 8 && date >= 1 && date <= 15;
      
      if (atmosphereOverride === "slovacko") {
        setIsActive(true);
      } else if (atmosphereOverride && atmosphereOverride !== "classic") {
        setIsActive(false);
      } else {
        setIsActive(isEventTime);
      }
    };
    
    checkEvent();
    window.addEventListener('mmbarber-atmosphere-update', checkEvent);
    return () => window.removeEventListener('mmbarber-atmosphere-update', checkEvent);
  }, [atmosphereOverride]);

  useEffect(() => {
    if (isActive) {
      document.documentElement.classList.add('slovacko-active');
    } else {
      document.documentElement.classList.remove('slovacko-active');
    }
    return () => document.documentElement.classList.remove('slovacko-active');
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-[100vh] bottom-0 left-0 right-0 z-[50] pointer-events-none overflow-hidden"
        >
          {/* Left Image */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[15vw] max-w-[200px] bg-repeat-y opacity-30 mix-blend-screen hidden md:block"
            style={{ backgroundImage: 'url(/slovácko.png)', backgroundSize: 'contain', backgroundPosition: 'top left' }}
          ></div>
          {/* Right Image (Mirrored) */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[15vw] max-w-[200px] bg-repeat-y opacity-30 mix-blend-screen hidden md:block"
            style={{ backgroundImage: 'url(/slovácko.png)', backgroundSize: 'contain', backgroundPosition: 'top right', transform: 'scaleX(-1)' }}
          ></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
