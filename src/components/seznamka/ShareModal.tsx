"use client";

import React, { useState } from "react";
import { X, Copy, Facebook, Twitter, Check, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  lang: 'cs' | 'en';
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`;
        break;
      case "native":
        if (navigator.share) {
          navigator.share({
            title: title,
            url: url,
          }).catch(console.error);
          return;
        }
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#111] border border-mafia-gold/30 p-6 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(197,160,89,0.15)]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest mb-6">
              {lang === 'cs' ? "Sdílet Akci" : "Share Event"}
            </h3>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={() => handleShare("native")}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-mafia-gold/20 flex items-center justify-center transition-colors">
                    <Send size={20} className="text-white group-hover:text-mafia-gold" />
                  </div>
                  <span className="text-[10px] text-white/60 uppercase font-bold">Možnosti</span>
                </button>
              )}
              
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#25D366]/20 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white group-hover:text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
                  </svg>
                </div>
                <span className="text-[10px] text-white/60 uppercase font-bold">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare("facebook")}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#1877F2]/20 flex items-center justify-center transition-colors">
                  <Facebook size={20} className="text-white group-hover:text-[#1877F2]" />
                </div>
                <span className="text-[10px] text-white/60 uppercase font-bold">Facebook</span>
              </button>

              <button
                onClick={() => handleShare("twitter")}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#1DA1F2]/20 flex items-center justify-center transition-colors">
                  <Twitter size={20} className="text-white group-hover:text-[#1DA1F2]" />
                </div>
                <span className="text-[10px] text-white/60 uppercase font-bold">X (Twitter)</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-xs text-white/80 pr-12 outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/10 hover:bg-mafia-gold flex items-center justify-center transition-colors text-white hover:text-black"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            {copied && (
              <p className="text-center text-[10px] text-green-400 mt-2 uppercase tracking-widest font-bold">
                {lang === 'cs' ? "Zkopírováno do schránky!" : "Copied to clipboard!"}
              </p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
