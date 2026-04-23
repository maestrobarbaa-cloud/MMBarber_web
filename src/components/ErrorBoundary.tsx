"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-mafia-black border-2 border-mafia-red/50 p-10 shadow-[0_0_50px_rgba(139,0,0,0.3)] relative overflow-hidden">
            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,1)_1px,transparent_1px,transparent_2px)] opacity-20"></div>
            
            <AlertTriangle className="text-mafia-red mx-auto mb-6 animate-pulse" size={64} />
            
            <h2 className="text-mafia-red font-heading font-black text-2xl uppercase tracking-[0.2em] mb-4">
              KRITICKÁ CHYBA SYSTÉMU
            </h2>
            
            <p className="text-smoke-white/60 font-mono text-xs uppercase tracking-widest mb-10 leading-relaxed">
              Nastala neočekávaná chyba v logice aplikace. Pravděpodobně došlo ke střetu skriptů nebo výpadku centrály.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-mafia-red text-white font-heading font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
              >
                <RefreshCw size={18} />
                RESTARTOVAT SYSTÉM
              </button>
              
              <Link 
                href="/"
                className="w-full py-4 border border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <Home size={14} />
                NÁVRAT NA ÚVODNÍ STRANU
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-loose">
                ERROR_DUMP: {this.state.error?.message?.slice(0, 50)}...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
