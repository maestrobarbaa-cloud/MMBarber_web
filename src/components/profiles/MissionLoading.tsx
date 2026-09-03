import { motion, AnimatePresence } from "framer-motion";

export const MissionLoading = ({ isHovered, graphicsTier }: { isHovered: boolean, graphicsTier?: string }) => (
  <AnimatePresence>
    {isHovered && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Scanning Line */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-mafia-gold/40 to-transparent z-10"
        />
        
        {/* Binary/Data Overlay - Only on high tiers */}
        {graphicsTier !== 'low' && graphicsTier !== 'medium' && (
          <div className="absolute inset-0 flex flex-wrap content-start opacity-20 text-[6px] font-mono leading-none p-1 gap-1">
            {Array(20).fill(0).map((_, i) => (
              <motion.span 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.span>
            ))}
          </div>
        )}

        {/* Glitch Overlay - Only on high tiers */}
        {graphicsTier !== 'low' && graphicsTier !== 'medium' && (
          <motion.div 
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
            className="absolute inset-0 bg-white mix-blend-overlay"
          />
        )}
      </motion.div>
    )}
  </AnimatePresence>
);
