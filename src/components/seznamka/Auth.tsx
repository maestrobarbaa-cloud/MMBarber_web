"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronRight, CheckCircle2, LockKeyhole, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { signIn } from "next-auth/react";

const SPECIAL_CHARS = ["*", "$", "!", "@", "#", "&", "?", "+", "="];

export function Auth({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const { lang } = useTranslation();
  const [mode, setMode] = useState<"login" | "register" | "compromised">("login");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  
  // Hesla
  const [password, setPassword] = useState("");
  const [isDualPassword, setIsDualPassword] = useState(false);
  const [dualPass1, setDualPass1] = useState("");
  const [dualChar, setDualChar] = useState("*");
  const [dualPass2, setDualPass2] = useState("");
  
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (mode === "compromised") {
      if (!email) {
        setError(lang === 'cs' ? "Zadejte e-mailovou adresu." : "Enter your email address.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/auth/compromised", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setSuccessMsg(data.message || (lang === 'cs' ? "E-mail byl odeslán." : "Email sent."));
          setEmail("");
        } else {
          setError(data.error || (lang === 'cs' ? "Něco se pokazilo." : "Something went wrong."));
        }
      } catch (err) {
        setError(lang === 'cs' ? "Chyba připojení k serveru." : "Server connection error.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Příprava konečného hesla
    let finalPassword = password;
    if (isDualPassword) {
      if (!dualPass1 || !dualPass2) {
        setError(lang === 'cs' ? "Vyplňte obě hesla pro Dvojitý zámek." : "Fill both passwords for Dual Lock.");
        return;
      }
      finalPassword = `${dualPass1}${dualChar}${dualPass2}`;
    }

    if (!email || !finalPassword || (mode === "register" && !nickname)) {
      setError(lang === 'cs' ? "Vyplňte všechny povinné údaje." : "Fill in all required fields.");
      return;
    }
    
    if (mode === "register" && !consent) {
      setError(lang === 'cs' ? "Musíte souhlasit s podmínkami a právní odpovědností." : "You must agree to the terms.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: finalPassword, name: nickname })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Došlo k chybě při registraci.");
          setLoading(false);
          return;
        }
      }

      // Provede přihlášení přes NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password: finalPassword
      });

      if (result?.error) {
        setError(lang === 'cs' ? "Nesprávný e-mail nebo heslo." : "Invalid email or password.");
      } else {
        onLoginSuccess({ email, name: nickname });
      }
    } catch (err) {
      setError(lang === 'cs' ? "Chyba připojení k serveru." : "Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-mafia-dark/80 border border-mafia-gold/30 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Dekorativní rohy */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-mafia-gold/50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-mafia-gold/50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-mafia-gold/50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-mafia-gold/50"></div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
          {mode === "register" ? (lang === 'cs' ? "Registrace" : "Register") : 
           mode === "compromised" ? (lang === 'cs' ? "Záchrana účtu" : "Account Recovery") :
           (lang === 'cs' ? "Přihlášení" : "Login")}
        </h2>
        <p className="text-smoke-white/50 font-mono text-xs uppercase tracking-widest">
          {mode === "compromised" 
            ? (lang === 'cs' ? "Zadejte e-mail pro smazání zneužitého účtu." : "Enter email to delete compromised account.")
            : (lang === 'cs' ? "Tento prostor vyžaduje autorizaci." : "This space requires authorization.")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "register" && (
          <div>
            <label className="block text-[10px] font-mono text-smoke-white/60 uppercase tracking-widest mb-2">
              {lang === 'cs' ? "Přezdívka (Skryje tvou identitu)" : "Nickname"}
            </label>
            <input 
              type="text" 
              value={nickname} 
              onChange={e => setNickname(e.target.value)}
              className="w-full bg-black/50 border border-white/10 focus:border-mafia-gold px-4 py-3 text-smoke-white font-mono text-sm focus:outline-none transition-colors"
              placeholder={lang === 'cs' ? "Např. Maverick737" : "e.g. Maverick737"}
            />
          </div>
        )}

        <div>
          <label className="block text-[10px] font-mono text-smoke-white/60 uppercase tracking-widest mb-2">
            {lang === 'cs' ? "E-mailová adresa" : "Email address"}
          </label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-white/10 focus:border-mafia-gold px-4 py-3 text-smoke-white font-mono text-sm focus:outline-none transition-colors"
            placeholder="email@example.com"
          />
        </div>

        {mode !== "compromised" && (
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-mono text-smoke-white/60 uppercase tracking-widest">
                {lang === 'cs' ? "Přístupové heslo" : "Password"}
              </label>
              
              <button 
                type="button" 
                onClick={() => setIsDualPassword(!isDualPassword)}
                className={`text-[9px] uppercase tracking-widest flex items-center gap-1 font-bold transition-colors ${isDualPassword ? 'text-mafia-gold' : 'text-white/40 hover:text-white'}`}
              >
                <LockKeyhole size={10} />
                {lang === 'cs' ? "Dvojité heslo" : "Dual Password"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!isDualPassword ? (
                <motion.div 
                  key="single"
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-mafia-gold px-4 py-3 text-smoke-white font-mono text-sm focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="dual"
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <input 
                    type="password" 
                    value={dualPass1} 
                    onChange={e => setDualPass1(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 focus:border-mafia-gold px-4 py-3 text-smoke-white font-mono text-sm focus:outline-none transition-colors"
                    placeholder={lang === 'cs' ? "Heslo 1" : "Pass 1"}
                  />
                  <select
                    value={dualChar}
                    onChange={e => setDualChar(e.target.value)}
                    className="w-16 bg-black border border-mafia-gold/50 text-mafia-gold font-bold px-2 focus:outline-none text-center appearance-none"
                  >
                    {SPECIAL_CHARS.map(char => (
                      <option key={char} value={char}>{char}</option>
                    ))}
                  </select>
                  <input 
                    type="password" 
                    value={dualPass2} 
                    onChange={e => setDualPass2(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 focus:border-mafia-gold px-4 py-3 text-smoke-white font-mono text-sm focus:outline-none transition-colors"
                    placeholder={lang === 'cs' ? "Heslo 2" : "Pass 2"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-3 flex gap-3 items-start mt-4 rounded-sm">
              <Info size={16} className="text-mafia-gold mt-0.5 flex-shrink-0" />
              <p className="text-[9px] font-mono text-mafia-gold/80 leading-relaxed uppercase tracking-wider">
                {lang === 'cs' 
                  ? "Tip pro bezpečnost (Dobrovolné): Používejte silná hesla. Pro maximální ochranu můžete kliknutím nahoře přepnout na 'Dvojité heslo'. Systém pak bude vyžadovat zadání dvou hesel spojených speciálním znakem (např. ahoj + $ + svet)." 
                  : "Security Tip (Optional): Use strong passwords. For maximum protection, switch to 'Dual Password'. The system will require two passwords separated by a special character (e.g. hello + $ + world)."}
              </p>
            </div>
          </div>
        )}

        {mode === "register" && (
          <label className="flex items-start gap-4 cursor-pointer group mt-4">
            <div onClick={() => setConsent(!consent)}
              className={`mt-0.5 w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                consent ? "border-mafia-red bg-mafia-red/20" : "border-white/20 group-hover:border-mafia-gold/40"
              }`}>
              {consent && <CheckCircle2 size={12} className="text-mafia-red" strokeWidth={3} />}
            </div>
            <span className="text-[9px] font-mono text-smoke-white/50 leading-relaxed uppercase">
              {lang === 'cs' 
                ? "Potvrzuji, že je mi více než 18 let a do aplikace vstupuji zcela dobrovolně. Beru na vědomí, že platforma slouží pouze jako zprostředkovatelský nástroj a provozovatel nenese žádnou právní ani trestní odpovědnost za chování uživatelů, jimi vložený obsah (texty, fotky, akce) ani za průběh osobních setkání. Souhlasím se zpracováním údajů nezbytných pro chod služby v souladu s nařízením GDPR (EU 2016/679). Zavazuji se nenahrávat citlivé osobní údaje a beru na vědomí, že za své aktivity zde nesu plnou odpovědnost." 
                : "I confirm that I am over 18 and enter this application completely voluntarily. I understand that the platform serves only as a tool, and the operator bears no legal or criminal responsibility for user behavior, uploaded content (texts, photos, events), or the course of in-person meetings. I agree to the processing of data necessary for the service in accordance with GDPR (EU 2016/679). I commit not to upload sensitive personal data and acknowledge that I bear full responsibility for my actions here."}
            </span>
          </label>
        )}

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-mafia-red text-xs font-mono uppercase bg-mafia-red/10 border border-mafia-red/20 p-3 flex gap-2 items-center">
              <ShieldCheck size={14} /> {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-500 text-xs font-mono uppercase bg-green-500/10 border border-green-500/20 p-3 flex gap-2 items-center">
              <CheckCircle2 size={14} /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          disabled={loading}
          className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "PROCESUJI..." : (
            mode === "register" ? (lang === 'cs' ? "ZALOŽIT ÚČET" : "CREATE ACCOUNT") : 
            mode === "compromised" ? (lang === 'cs' ? "ODESLAT" : "SEND") :
            (lang === 'cs' ? "VSTOUPIT" : "ENTER")
          )}
          {!loading && <ChevronRight size={18} />}
        </button>

        <div className="text-center mt-6 flex flex-col gap-3">
          <button 
            type="button" 
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[10px] font-mono text-mafia-gold/60 hover:text-mafia-gold uppercase tracking-widest transition-colors border-b border-transparent hover:border-mafia-gold/30 pb-1"
          >
            {mode === "login" || mode === "compromised"
              ? (lang === 'cs' ? "Nemáš účet? Registrovat se" : "No account? Register")
              : (lang === 'cs' ? "Máš účet? Přihlásit se" : "Have an account? Login")}
          </button>
          
          {mode !== "compromised" && (
            <button 
              type="button" 
              onClick={() => setMode("compromised")}
              className="text-[10px] font-mono text-mafia-red/60 hover:text-mafia-red uppercase tracking-widest transition-colors"
            >
              {lang === 'cs' ? "Zneužil vám nebo někdo odcizil účet?" : "Account stolen or compromised?"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
