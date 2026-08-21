import React from "react";
import { Info } from "lucide-react";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-flex items-center ml-2 align-middle z-50">
      <Info size={14} className="text-white/40 group-hover:text-mafia-gold transition-colors cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity w-48 md:w-64 bg-black border border-mafia-gold/30 p-3 text-[10px] font-sans text-white/80 rounded-lg shadow-xl pointer-events-none z-[100]">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-mafia-gold/30"></div>
      </div>
    </div>
  );
}
interface PreferenceSelectorProps {
  label: string;
  value: { value: string, importance: string } | undefined;
  onChange: (val: { value: string, importance: string }) => void;
  options: { value: string, label: string }[];
  tooltipText?: string;
}

export function PreferenceSelector({ label, value, onChange, options, tooltipText }: PreferenceSelectorProps) {
  const currentVal = value?.value || "";
  const currentImp = value?.importance || "prefer";

  return (
    <div className="bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-sm border border-white/10 hover:border-white/20 p-4 rounded-xl space-y-4 relative transition-colors shadow-inner">
      <div className="flex items-center">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest">{label}</label>
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ value: opt.value, importance: currentImp })}
            className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-all ${currentVal === opt.value ? 'border-mafia-gold bg-mafia-gold/20 text-mafia-gold font-bold' : 'border-white/10 text-white/50 hover:text-white hover:border-white/30 bg-black/40'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {currentVal && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {[
            { id: 'must_have', label: '🔴 Nutné (Bez toho ne)', color: 'text-red-500 border-red-500/50 bg-red-500/10' },
            { id: 'prefer', label: '🟡 Preferuji', color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' },
            { id: 'dont_care', label: '⚪ Neřeším', color: 'text-gray-400 border-gray-400/50 bg-gray-400/10' }
          ].map(imp => (
            <button
              key={imp.id}
              type="button"
              onClick={() => onChange({ value: currentVal, importance: imp.id })}
              className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg border transition-all ${currentImp === imp.id ? imp.color : 'border-white/10 text-white/30 hover:border-white/30 hover:bg-white/5'}`}
            >
              {imp.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface TraitSelectorProps {
  label: string;
  value: string | undefined;
  onChange: (val: string) => void;
  tooltipText?: string;
}

export function TraitSelector({ label, value, onChange, tooltipText }: TraitSelectorProps) {
  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/5 hover:border-white/10 p-3 rounded-xl transition-colors shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center">
          {label}
          {tooltipText && <InfoTooltip text={tooltipText} />}
        </label>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {[
          { id: 'vubec', label: 'Vůbec' },
          { id: 'trochu', label: 'Trochu' },
          { id: 'hodne', label: 'Hodně' },
          { id: 'zasadni', label: 'Zásadní' }
        ].map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`py-1.5 text-[9px] font-bold uppercase transition-all rounded-lg ${value === opt.id ? 'bg-mafia-gold text-black shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-black/40 text-white/40 hover:bg-white/10 hover:text-white'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
