import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-mafia-gold/20 rounded-lg overflow-hidden bg-black/40 mb-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-mafia-dark hover:bg-mafia-gold/10 transition-colors"
      >
        <div className="flex items-center gap-2 font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">
          {icon} {title}
        </div>
        <ChevronDown className={`text-mafia-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-mafia-gold/10 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
