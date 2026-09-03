import { EvaluatedStatus } from "@/utils/status";

export const StatusText = ({ evaluated, lang }: { evaluated: EvaluatedStatus, lang: string }) => {
  if (evaluated.state === 'transparent' || !evaluated.state) return null;

  let colorClass = 'text-white/40';
  let text = '';
  
  if (evaluated.state === 'online') {
    colorClass = 'text-mafia-gold drop-shadow-[0_0_5px_rgba(197,160,89,0.8)]';
    text = lang === 'cs' ? 'PRÁVĚ PRACUJE' : 'CURRENTLY WORKING';
  } else if (evaluated.state === 'offline') {
    colorClass = 'text-red-500';
    text = lang === 'cs' ? 'MIMO SLUŽBU' : 'OFF DUTY';
  } else if (evaluated.state === 'custom') {
    colorClass = 'text-mafia-gold drop-shadow-[0_0_5px_rgba(197,160,89,0.8)]';
    text = evaluated.text || (lang === 'cs' ? 'MIMO SLUŽBU' : 'OFF DUTY');
  }

  return (
    <div className={`text-[10px] md:text-[11px] font-mono font-bold tracking-widest uppercase ${colorClass}`}>
      {text}
    </div>
  );
};
