import { motion, AnimatePresence } from "framer-motion";
import { MilitaryInsignia } from "./MilitaryInsignia";
import { useUI } from "@/contexts/UIContext";

export const BarberRanking = ({ 
  level, 
  rankTitle, 
  lang, 
  id,
  xp
}: { 
  level: number, 
  rankTitle: string, 
  lang: string, 
  id: string,
  xp?: number
}) => {
  const { isBloodMode, isNoirMode } = useUI();

  const statusColor = isBloodMode 
    ? 'text-mafia-blood' 
    : (isNoirMode ? 'text-white' : 'text-mafia-gold');

  const barColor = isBloodMode 
    ? 'bg-mafia-blood' 
    : (isNoirMode ? 'bg-white' : 'bg-mafia-gold');

  const insigniaColor = isBloodMode 
    ? 'var(--color-mafia-blood)' 
    : (isNoirMode ? '#ffffff' : 'var(--color-mafia-gold)');

  return (
    <div className={`flex flex-col items-center gap-2 group/rank min-w-[160px] ${statusColor}`}>
      <div className="flex items-center gap-2.5">
        <MilitaryInsignia level={level} color={insigniaColor} size={42} />
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 min-h-[18px] min-w-[120px] justify-center">
            <AnimatePresence mode="wait">
              <motion.span 
                key={rankTitle}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] font-black tracking-[0.05em] uppercase leading-tight text-center"
              >
                {rankTitle}
              </motion.span>
            </AnimatePresence>
          </div>
          {xp !== undefined && (
            <div className="text-[10px] font-mono tracking-widest text-mafia-gold/60 mt-1 mb-1 font-bold">
              {xp} EXP
            </div>
          )}
          <div className="flex gap-0.5 mt-1 max-w-[200px] justify-center flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
              <div 
                key={i} 
                className={`h-[3px] w-2 md:w-2.5 rounded-full transition-all duration-700 ${
                  i <= level ? `${barColor} shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.7)]` : "bg-white/10"
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
