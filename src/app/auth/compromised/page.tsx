"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

function CompromisedAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { lang } = useTranslation();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(lang === 'cs' ? "Chybí ověřovací token." : "Missing verification token.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/compromised/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || (lang === 'cs' ? "Účet byl úspěšně smazán." : "Account successfully deleted."));
        } else {
          setStatus("error");
          setMessage(data.error || (lang === 'cs' ? "Neplatný nebo vypršelý token." : "Invalid or expired token."));
        }
      } catch (error) {
        setStatus("error");
        setMessage(lang === 'cs' ? "Chyba při komunikaci se serverem." : "Server communication error.");
      }
    };

    verifyToken();
  }, [token, lang]);

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background styling to match the app */}
      <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-mafia-red/5 via-black to-mafia-gold/5"></div>

      <div className="max-w-md w-full bg-mafia-dark/80 border border-mafia-gold/30 p-8 shadow-2xl relative z-10 backdrop-blur-xl text-center">
        {/* Decor corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-mafia-gold/50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-mafia-gold/50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-mafia-gold/50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-mafia-gold/50"></div>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Loader2 className="w-12 h-12 text-mafia-gold animate-spin" />
            <p className="font-mono text-sm uppercase tracking-widest text-mafia-gold/80">
              {lang === 'cs' ? "Ověřování..." : "Verifying..."}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center gap-6 py-4">
            <div className="w-20 h-20 bg-mafia-red/10 rounded-full flex items-center justify-center border border-mafia-red/30">
              <ShieldCheck className="w-10 h-10 text-mafia-red" />
            </div>
            
            <h1 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-wider">
              {lang === 'cs' ? "Účet smazán" : "Account Deleted"}
            </h1>
            
            <div className="bg-black/50 p-4 border border-white/10 text-sm font-mono text-smoke-white/80 text-left leading-relaxed">
              <p className="mb-2">
                {lang === 'cs' 
                  ? "Váš účet byl z důvodu narušení bezpečnosti trvale smazán." 
                  : "Your account has been permanently deleted due to a security breach."}
              </p>
              <p className="text-mafia-red font-bold">
                {lang === 'cs' 
                  ? "BEZPEČNOSTNÍ DOPORUČENÍ:" 
                  : "SECURITY RECOMMENDATION:"}
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>{lang === 'cs' ? "Vytvořte si nový účet s jiným, silným heslem." : "Create a new account with a different, strong password."}</li>
                <li>{lang === 'cs' ? "Nikomu své heslo nesdělujte." : "Do not share your password with anyone."}</li>
                <li>{lang === 'cs' ? "Zkontrolujte si bezpečnost své e-mailové schránky." : "Check the security of your email inbox."}</li>
              </ul>
            </div>

            <Link href="/seznamka" className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center">
              {lang === 'cs' ? "ZPĚT NA HLAVNÍ STRÁNKU" : "BACK TO MAIN PAGE"}
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center gap-6 py-4">
            <div className="w-20 h-20 bg-mafia-red/10 rounded-full flex items-center justify-center border border-mafia-red/30">
              <ShieldAlert className="w-10 h-10 text-mafia-red" />
            </div>
            
            <h1 className="text-2xl font-heading font-black text-mafia-red uppercase tracking-wider">
              {lang === 'cs' ? "Chyba" : "Error"}
            </h1>
            
            <p className="font-mono text-sm text-smoke-white/80">
              {message}
            </p>

            <Link href="/seznamka" className="w-full py-4 bg-transparent border border-mafia-gold text-mafia-gold font-black uppercase tracking-[0.3em] hover:bg-mafia-gold hover:text-mafia-black transition-all flex items-center justify-center mt-4">
              {lang === 'cs' ? "ZPĚT" : "BACK"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompromisedAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mafia-black flex items-center justify-center"><Loader2 className="w-12 h-12 text-mafia-gold animate-spin" /></div>}>
      <CompromisedAccountContent />
    </Suspense>
  );
}
