"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, PlugZap, Wrench, Droplet, Hammer, Scissors, Paintbrush } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export type CraftType = 'elektrika' | 'voda' | 'zednik' | 'drevo' | 'malir';

export default function CraftCalculator({ setGlobalTotal, activeCraft }: { setGlobalTotal: (val: number) => void, activeCraft: CraftType }) {
  const { lang } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const [total, setTotal] = useState(0);

  // ELEKTRIKA STATE
  const [elecProp, setElecProp] = useState("byt");
  const [elecSockets, setElecSockets] = useState(0);
  const [elecLights, setElecLights] = useState(0);
  const [elecPanel, setElecPanel] = useState("none");
  const [elecSmart, setElecSmart] = useState(false);
  
  // VODA STATE
  const [plumbProp, setPlumbProp] = useState("byt");
  const [plumbPipes, setPlumbPipes] = useState(0);
  const [plumbHeating, setPlumbHeating] = useState(false);
  const [plumbBoiler, setPlumbBoiler] = useState(false);
  const [plumbRadiators, setPlumbRadiators] = useState(0);

  // ZEDNIK STATE
  const [masonArea, setMasonArea] = useState(0);
  const [masonPlaster, setMasonPlaster] = useState(false);
  const [masonTiles, setMasonTiles] = useState(0);
  const [masonWall, setMasonWall] = useState(0);

  // DREVO STATE
  const [woodFloor, setWoodFloor] = useState(0);
  const [woodDoors, setWoodDoors] = useState(0);
  const [woodKitchen, setWoodKitchen] = useState(false);
  const [woodCustom, setWoodCustom] = useState(false);

  // MALIR STATE
  const [paintArea, setPaintArea] = useState(0);
  const [paintCoats, setPaintCoats] = useState(1);
  const [paintPremium, setPaintPremium] = useState(false);
  const [paintScrape, setPaintScrape] = useState(false);

  useEffect(() => {
    let t = 0;
    if (activeCraft === 'elektrika') {
      t += elecProp === 'byt' ? 2000 : elecProp === 'dum' ? 5000 : 10000;
      t += elecSockets * 450 + elecLights * 450;
      t += elecPanel === 'subpanel' ? 8500 : elecPanel === '100A' ? 25000 : 0;
      if (elecSmart) t += 55000;
    } else if (activeCraft === 'voda') {
      t += plumbProp === 'byt' ? 2000 : plumbProp === 'dum' ? 5000 : 10000;
      t += plumbPipes * 800 + plumbRadiators * 3500;
      if (plumbHeating) t += 45000;
      if (plumbBoiler) t += 35000;
    } else if (activeCraft === 'zednik') {
      t += masonArea * 600;
      if (masonPlaster) t += masonArea * 350;
      t += masonTiles * 850;
      t += masonWall * 1200;
    } else if (activeCraft === 'drevo') {
      t += woodFloor * 450;
      t += woodDoors * 2500;
      if (woodKitchen) t += 45000;
      if (woodCustom) t += 15000;
    } else if (activeCraft === 'malir') {
      let pPrice = paintPremium ? 120 : 60;
      t += paintArea * pPrice * paintCoats;
      if (paintScrape) t += paintArea * 45;
    }
    setTotal(t);
    setGlobalTotal(t);
  }, [activeCraft, elecProp, elecSockets, elecLights, elecPanel, elecSmart, plumbProp, plumbPipes, plumbHeating, plumbBoiler, plumbRadiators, masonArea, masonPlaster, masonTiles, masonWall, woodFloor, woodDoors, woodKitchen, woodCustom, paintArea, paintCoats, paintPremium, paintScrape]);

  const renderSlider = (label: string, value: number, setter: (val: number) => void, max: number, step: number, unit: string) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-mono text-cyan-400/80 mb-2 uppercase">
        <span>{label}</span>
        <span className="text-white">{value} {unit}</span>
      </div>
      <input type="range" min="0" max={max} step={step} value={value} onChange={(e) => setter(Number(e.target.value))} className="w-full accent-cyan-500" />
    </div>
  );

  const renderToggle = (label: string, checked: boolean, setter: (val: boolean) => void) => (
    <button onClick={() => setter(!checked)} className={`w-full py-3 px-4 flex justify-between items-center rounded-xl border transition-all mb-2 ${checked ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-950/50 border-cyan-500/20 text-slate-400 hover:border-cyan-500/50"}`}>
      <span className="text-xs uppercase tracking-wider font-bold">{label}</span>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? "bg-cyan-500" : "bg-slate-700"}`}>
        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${checked ? "left-6" : "left-1"}`} />
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto">
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10 flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={activeCraft} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            
            {activeCraft === 'elektrika' && (
              <>
                <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-4 border-b border-cyan-500/20 pb-2">Elektroinstalace</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  {['byt', 'dum', 'komerce', 'hala'].map(t => (
                    <button key={t} onClick={() => setElecProp(t)} className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border ${elecProp === t ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-950 border-cyan-500/20 text-slate-400"}`}>{t}</button>
                  ))}
                </div>
                {renderSlider("Běžné zásuvky a světla", elecSockets, setElecSockets, 200, 1, "ks")}
                {renderSlider("LED Pásky a speciální svítidla", elecLights, setElecLights, 50, 1, "ks")}
                {renderToggle("Smart Home Příprava (Loxone)", elecSmart, setElecSmart)}
              </>
            )}

            {activeCraft === 'voda' && (
              <>
                <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-4 border-b border-cyan-500/20 pb-2">Voda & Topení</h3>
                {renderSlider("Rozvody vody (metry)", plumbPipes, setPlumbPipes, 500, 5, "m")}
                {renderSlider("Počet radiátorů", plumbRadiators, setPlumbRadiators, 30, 1, "ks")}
                {renderToggle("Podlahové vytápění", plumbHeating, setPlumbHeating)}
                {renderToggle("Instalace Tepelného čerpadla/Kotle", plumbBoiler, setPlumbBoiler)}
              </>
            )}

            {activeCraft === 'zednik' && (
              <>
                <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-4 border-b border-cyan-500/20 pb-2">Zednictví & Obklady</h3>
                {renderSlider("Plocha podlahy (m2)", masonArea, setMasonArea, 500, 10, "m2")}
                {renderSlider("Obklady a dlažba (m2)", masonTiles, setMasonTiles, 200, 5, "m2")}
                {renderSlider("Vyzdívka příček (m2)", masonWall, setMasonWall, 200, 5, "m2")}
                {renderToggle("Nové omítky (komplet)", masonPlaster, setMasonPlaster)}
              </>
            )}

            {activeCraft === 'drevo' && (
              <>
                <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-4 border-b border-cyan-500/20 pb-2">Dřevo & Podlahy</h3>
                {renderSlider("Pokládka podlahy (m2)", woodFloor, setWoodFloor, 300, 10, "m2")}
                {renderSlider("Montáž dveří (zárubně)", woodDoors, setWoodDoors, 20, 1, "ks")}
                {renderToggle("Montáž kuchyně na míru", woodKitchen, setWoodKitchen)}
                {renderToggle("Vestavěné skříně", woodCustom, setWoodCustom)}
              </>
            )}

            {activeCraft === 'malir' && (
              <>
                <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-4 border-b border-cyan-500/20 pb-2">Malířství & Sádrokartony</h3>
                {renderSlider("Malovaná plocha stěn (m2)", paintArea, setPaintArea, 1000, 10, "m2")}
                {renderSlider("Počet nátěrů", paintCoats, setPaintCoats, 3, 1, "x")}
                {renderToggle("Škrábání staré malby", paintScrape, setPaintScrape)}
                {renderToggle("Prémiové omyvatelné barvy", paintPremium, setPaintPremium)}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


