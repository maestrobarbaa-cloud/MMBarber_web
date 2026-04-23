"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Cpu, HardDrive, Layout, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PerformanceData {
  memoryUsed: string;
  memoryLimit: string;
  domElements: number;
  loadTime: string;
  fps: number;
  networkType: string;
  renderTime: string;
  cpuLoad: number;
  gpuLoad: number;
  cores: number;
  gpuName: string;
}

export function PerformanceModal({ isOpen, onClose }: PerformanceModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<PerformanceData | null>(null);
  const { lang } = useTranslation();
  const fpsRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const framesRef = useRef<number>(0);
  const cpuLoadRef = useRef<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Estimate CPU load via event loop lag
    let lastTick = performance.now();
    const calculateCpuLoad = () => {
        const now = performance.now();
        const delta = now - lastTick;
        // If delta > 16.7ms (for 60fps), there is some lag
        const lag = Math.max(0, delta - (1000 / 60));
        // Smooth the load value
        cpuLoadRef.current = cpuLoadRef.current * 0.9 + (lag / 10) * 0.1;
        lastTick = now;
        if (isOpen) requestAnimationFrame(calculateCpuLoad);
    };
    const cpuAnimId = requestAnimationFrame(calculateCpuLoad);

    // Calculate FPS
    const updateFps = () => {
      const now = performance.now();
      framesRef.current++;
      if (now >= lastTimeRef.current + 1000) {
        fpsRef.current = Math.round((framesRef.current * 1000) / (now - lastTimeRef.current));
        framesRef.current = 0;
        lastTimeRef.current = now;
      }
      if (isOpen) requestAnimationFrame(updateFps);
    };
    const fpsAnimId = requestAnimationFrame(updateFps);

    // Get GPU Name
    const getGpuInfo = () => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
            if (gl) {
                const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Generic Accelerator';
            }
        } catch (e) {}
        return 'Standard Graphics';
    };

    // Initial and periodic data update
    const updateData = () => {
      const perf: any = window.performance;
      const memory = perf.memory;
      const navEntry = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const domCount = document.querySelectorAll('*').length;
      
      // GPU Load estimation based on DOM nodes and active animations/filters
      const estimatedGpuLoad = Math.min(98, Math.round((domCount / 5000) * 30 + (fpsRef.current < 55 ? 40 : 10) + (Math.random() * 5)));

      setData({
        memoryUsed: memory ? `${Math.round(memory.usedJSHeapSize / 1048576)} MB` : "N/A",
        memoryLimit: memory ? `${Math.round(memory.jsHeapLimit / 1048576)} MB` : "N/A",
        domElements: domCount,
        loadTime: navEntry ? `${Math.round(navEntry.duration)} ms` : "N/A",
        fps: fpsRef.current || 60,
        networkType: (navigator as any).connection?.effectiveType?.toUpperCase() || "STABLE",
        renderTime: `${Math.round(performance.now() - (navEntry?.responseStart || 0))} ms`,
        cpuLoad: Math.min(100, Math.round(cpuLoadRef.current * 100 + 5 + Math.random() * 10)),
        gpuLoad: estimatedGpuLoad,
        cores: navigator.hardwareConcurrency || 4,
        gpuName: getGpuInfo().split(' ').slice(0, 3).join(' ')
      });
    };

    updateData();
    const interval = setInterval(updateData, 1500);

    return () => {
      cancelAnimationFrame(cpuAnimId);
      cancelAnimationFrame(fpsAnimId);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10006] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-crosshair"
            onClick={onClose}
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#c5a059_1px,transparent_1px),linear-gradient(to_bottom,#c5a059_1px,transparent_1px)] bg-[size:30px_30px]"></div>

          {/* Content Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#050505] border border-mafia-gold/40 shadow-[0_0_100px_rgba(197,160,89,0.1)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-mafia-gold/20 flex items-center justify-between bg-mafia-gold/5">
              <div className="flex items-center gap-4">
                <div className="p-2 border border-mafia-gold/30 text-mafia-gold">
                  <Activity size={20} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black text-white uppercase tracking-[0.2em] leading-none">
                    {lang === 'cs' ? 'Systémová Diagnostika' : 'System Diagnostics'}
                  </h2>
                  <p className="text-[9px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] mt-1.5">Node_ID: MM_BARBER_PROD_01 // Status: Running</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/20 hover:text-mafia-gold transition-all p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {/* CPU */}
              <div className="p-5 border border-white/5 bg-white/[0.02] flex flex-col gap-2 group hover:border-mafia-gold/20 transition-all">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">CPU LOAD</div>
                    <Cpu size={16} className="text-mafia-gold/40" />
                </div>
                <div className="text-3xl font-heading font-black text-white tracking-tighter">{data?.cpuLoad || '0'}%</div>
                <div className="text-[9px] font-mono text-white/30 uppercase">{data?.cores} CORES DETECTED</div>
                <div className="mt-2 h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-mafia-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${data?.cpuLoad || 0}%` }}
                    />
                </div>
              </div>

              {/* GPU */}
              <div className="p-5 border border-white/5 bg-white/[0.02] flex flex-col gap-2 group hover:border-mafia-gold/20 transition-all">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">GPU LOAD</div>
                    <Zap size={16} className="text-mafia-gold/40" />
                </div>
                <div className="text-3xl font-heading font-black text-white tracking-tighter">{data?.gpuLoad || '0'}%</div>
                <div className="text-[9px] font-mono text-white/30 uppercase truncate">{data?.gpuName}</div>
                <div className="mt-2 h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-mafia-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${data?.gpuLoad || 0}%` }}
                    />
                </div>
              </div>

              {/* Memory */}
              <div className="p-5 border border-white/5 bg-white/[0.02] flex flex-col gap-2 group hover:border-mafia-gold/20 transition-all">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">MEMORY</div>
                    <HardDrive size={16} className="text-mafia-gold/40" />
                </div>
                <div className="text-3xl font-heading font-black text-white tracking-tighter">{data?.memoryUsed || '--'}</div>
                <div className="text-[9px] font-mono text-white/30 uppercase truncate">OF {data?.memoryLimit} LIMIT</div>
                <div className="mt-2 h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-mafia-gold"
                      initial={{ width: 0 }}
                      animate={{ width: '35%' }}
                    />
                </div>
              </div>

              {/* FPS */}
              <div className="p-5 border border-white/5 bg-white/[0.02] flex flex-col gap-2 group hover:border-mafia-gold/20 transition-all">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">REFRESH</div>
                    <Activity size={16} className="text-mafia-gold/40" />
                </div>
                <div className="text-3xl font-heading font-black text-white tracking-tighter">{data?.fps || '0'} FPS</div>
                <div className="text-[9px] font-mono text-white/30 uppercase">STABLE RENDER</div>
                <div className="mt-2 h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-mafia-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${((data?.fps || 60) / 60) * 100}%` }}
                    />
                </div>
              </div>
            </div>

            {/* Bottom Table Style Info */}
            <div className="px-8 pb-8">
                <div className="w-full border border-white/5 bg-white/[0.01]">
                    <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 p-2 text-[9px] font-mono text-mafia-gold uppercase tracking-widest">
                        <div>Parametr</div>
                        <div>Aktuální Hodnota</div>
                        <div>Stav</div>
                    </div>
                    <div className="divide-y divide-white/5">
                        <PerformanceRow label="Uptime" value={Math.round(performance.now() / 1000) + "s"} status="AKTIVNÍ" color="text-green-500" />
                        <PerformanceRow label="Latence" value={data?.renderTime || "0ms"} status="OPTIMÁLNÍ" color="text-mafia-gold" />
                        <PerformanceRow label="DOM Nodes" value={String(data?.domElements || 0)} status="SYNC" color="text-mafia-gold" />
                        <PerformanceRow label="Network" value={data?.networkType || "STABLE"} status="CONNECTED" color="text-mafia-gold" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-mafia-gold/10 bg-mafia-gold/[0.02] flex items-center justify-center">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.8em]">End of Diagnostic Protocol // 2024</span>
            </div>

            {/* Scanner Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[2px] bg-mafia-gold/20 blur-[2px] z-50 pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PerformanceRow({ label, value, status, color }: { label: string, value: string, status: string, color: string }) {
    return (
        <div className="grid grid-cols-3 p-3 text-[10px] font-mono group hover:bg-white/5 transition-colors">
            <div className="text-white/40 uppercase">{label}</div>
            <div className="text-white font-black">{value}</div>
            <div className={`${color} font-black animate-pulse`}>{status}</div>
        </div>
    );
}
