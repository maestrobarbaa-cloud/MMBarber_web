import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Ticket, MapPin, ExternalLink, Scissors } from "lucide-react";

export interface VoucherData {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string | null;
  company: {
    name: string;
    logoUrl: string | null;
    industry: string | null;
    address: string | null;
  };
}

interface Props {
  voucher: VoucherData;
  lang: 'cs' | 'en';
}

export const MatchVoucherCard: React.FC<Props> = ({ voucher, lang }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-zinc-900 border border-mafia-gold/30 rounded-xl p-4 shadow-[0_0_15px_rgba(197,160,89,0.15)] flex flex-col md:flex-row gap-4 items-center group hover:border-mafia-gold transition-colors"
    >
      <div className="absolute -right-4 -top-4 text-mafia-gold/5 rotate-12 pointer-events-none">
        <Ticket size={120} />
      </div>

      {voucher.company.logoUrl ? (
        <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-mafia-gold/50 flex-shrink-0">
          <Image src={voucher.company.logoUrl} alt={voucher.company.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full border-2 border-mafia-gold/50 flex-shrink-0 bg-black flex items-center justify-center text-mafia-gold">
          <Scissors size={24} />
        </div>
      )}

      <div className="flex-grow z-10 text-center md:text-left">
        <div className="text-xs font-mono text-mafia-gold mb-1 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 flex-wrap">
          <span className="font-bold">{voucher.company.name}</span>
          {voucher.company.industry && (
            <>
              <span className="text-white/30">•</span>
              <span className="text-white/70">{voucher.company.industry}</span>
            </>
          )}
          {voucher.company.address && (
            <>
              <span className="text-white/30">•</span>
              <span className="text-white/70 flex items-center gap-1"><MapPin size={10} /> {voucher.company.address}</span>
            </>
          )}
        </div>
        <h3 className="text-lg font-bold text-white mb-1 leading-tight">{voucher.title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2">{voucher.description}</p>
      </div>

      <div className="flex flex-col items-center justify-center min-w-[100px] z-10 p-3 bg-black/40 rounded-lg border border-white/5">
        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{lang === 'cs' ? 'Sleva' : 'Discount'}</div>
        <div className="text-xl font-black text-mafia-gold font-heading">{voucher.discount}</div>
        {voucher.code && (
          <div className="mt-2 bg-mafia-gold text-black font-mono font-bold text-xs px-2 py-1 rounded w-full text-center tracking-wider">
            {voucher.code}
          </div>
        )}
      </div>
    </motion.div>
  );
};
