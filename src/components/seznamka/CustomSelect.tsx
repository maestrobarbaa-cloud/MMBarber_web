"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string | string[];
  onChange: (val: any) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  isMulti?: boolean;
  dropUp?: boolean;
}

export function CustomSelect({ value, onChange, options, placeholder = "Vyber...", error, isMulti = false, dropUp = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayValue = () => {
    if (isMulti) {
      const vals = Array.isArray(value) ? value : [];
      if (vals.length === 0) return placeholder;
      if (vals.length === 1) return options.find(o => o.value === vals[0])?.label || placeholder;
      return `${vals.length} vybráno`;
    }
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const handleSelect = (optionValue: string) => {
    if (isMulti) {
      const vals = Array.isArray(value) ? value : [];
      if (vals.includes(optionValue)) {
        onChange(vals.filter(v => v !== optionValue));
      } else {
        onChange([...vals, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const hasSelection = isMulti ? (Array.isArray(value) && value.length > 0) : (value !== "");

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} py-3 px-4 text-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black focus:border-mafia-gold transition-colors font-sans text-sm flex justify-between items-center`}
      >
        <span className={hasSelection ? "text-white" : "text-white/40"}>
          {getDisplayValue()}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180 text-mafia-gold" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropUp ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-full bg-black border border-mafia-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden max-h-60 overflow-y-auto custom-scrollbar ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
          >
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  onChange(isMulti ? [] : "");
                  if (!isMulti) setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus-visible:ring-inset ${
                  !hasSelection ? "bg-mafia-gold/20 text-mafia-gold" : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {placeholder} (Vymazat)
              </button>
              {options.map((option) => {
                const isSelected = isMulti ? (Array.isArray(value) && value.includes(option.value)) : value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus-visible:ring-inset ${
                      isSelected
                        ? "bg-mafia-gold/20 text-mafia-gold"
                        : "text-white hover:bg-mafia-gold/10 hover:text-mafia-gold"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && isMulti && <Check size={14} className="text-mafia-gold" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

