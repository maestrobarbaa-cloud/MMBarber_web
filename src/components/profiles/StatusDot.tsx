import { EvaluatedStatus } from "@/utils/status";

export const StatusDot = ({ evaluated }: { evaluated: EvaluatedStatus }) => {
  if (evaluated.state === 'transparent' || !evaluated.state) return null;

  let colorClass = 'bg-white/20';
  let glowClass = '';
  
  if (evaluated.state === 'online') {
    colorClass = 'bg-green-500';
    glowClass = 'shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse';
  } else if (evaluated.state === 'offline') {
    colorClass = 'bg-red-600';
    glowClass = 'shadow-[0_0_10px_rgba(220,38,38,0.6)]';
  } else if (evaluated.state === 'custom') {
    colorClass = 'bg-mafia-gold';
    glowClass = 'shadow-[0_0_10px_rgba(197,160,89,0.6)] animate-pulse';
  }

  return (
    <div className="absolute -top-1 -right-4 flex items-center group/dot">
      <div className={`w-3 h-3 rounded-full ${colorClass} ${glowClass}`} />
      {evaluated.state === 'custom' && evaluated.text && (
        <span className="absolute left-4 opacity-0 group-hover/dot:opacity-100 transition-opacity bg-black/80 text-mafia-gold text-[8px] px-2 py-1 border border-mafia-gold/20 whitespace-nowrap rounded pointer-events-none">
          {evaluated.text}
        </span>
      )}
    </div>
  );
};
