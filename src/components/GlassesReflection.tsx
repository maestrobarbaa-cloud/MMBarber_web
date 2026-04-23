"use client";

import Image from "next/image";

export function GlassesReflection({
  clientImageSrc = "https://images.unsplash.com/photo-1542327897-4141b355e20e?q=80&w=800&auto=format&fit=crop"
}: {
  clientImageSrc?: string;
}) {
  return (
    <section className="relative w-full py-32 bg-mafia-black overflow-hidden flex flex-col items-center border-t border-mafia-gold/10">
      
      <div className="text-center mb-16 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white mb-4 tracking-widest uppercase">
          Tvůj nový <span className="text-mafia-gold">Odraz</span>
        </h2>
        <p className="text-smoke-white/60 font-sans max-w-xl mx-auto text-sm md:text-base">
          Tvrdý pohled mafiána. Žádné kompromisy.
        </p>
      </div>

      {/* 
        This is the Sunglasses component.
        We simulate the sunglasses frame with an SVG, and use CSS clip-path or mask-image 
        to constrain the client's photo strictly within the "lenses".
      */}
      <div className="relative w-[300px] h-[120px] md:w-[600px] md:h-[240px] mt-8 group cursor-pointer z-10">
        
        {/* The Frame of the Glasses (SVG over everything) */}
        <div className="absolute inset-0 z-20 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] pointer-events-none">
          <svg viewBox="0 0 800 300" className="w-full h-full text-mafia-dark drop-shadow-2xl">
            {/* Bridge */}
            <path d="M 360 80 Q 400 60 440 80 L 440 100 Q 400 90 360 100 Z" fill="currentColor" />
            {/* Lenses Frames */}
            <path d="M 100 80 C 150 40, 250 40, 360 80 C 370 120, 340 220, 250 240 C 150 260, 80 180, 100 80 Z" fill="none" stroke="currentColor" strokeWidth="20" />
            <path d="M 440 80 C 550 40, 650 40, 700 80 C 720 180, 650 260, 550 240 C 460 220, 430 120, 440 80 Z" fill="none" stroke="currentColor" strokeWidth="20" />
            {/* Temples */}
            <path d="M 80 90 L 20 60" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
            <path d="M 720 90 L 780 60" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
          </svg>
        </div>

        {/* The Left Lens Reflection (Masked Image) */}
        <div 
          className="absolute inset-0 z-10 overflow-hidden" 
          style={{ 
            clipPath: "url(#left-lens-clip)", 
            WebkitClipPath: "url(#left-lens-clip)" 
          }}
        >
          <Image 
            src={clientImageSrc} 
            alt="Client Left Reflection" 
            width={300}
            height={240}
            className="w-full h-full object-cover grayscale opacity-80 mix-blend-screen scale-110 group-hover:scale-125 group-hover:grayscale-0 transition-transform duration-1000 origin-center"
          />
          {/* Glass glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
        </div>

        {/* The Right Lens Reflection (Masked Image) */}
        <div 
          className="absolute inset-0 z-10 overflow-hidden" 
          style={{ 
            clipPath: "url(#right-lens-clip)", 
            WebkitClipPath: "url(#right-lens-clip)" 
          }}
        >
          <Image 
            src={clientImageSrc} 
            alt="Client Right Reflection" 
            width={300}
            height={240}
            className="w-full h-full object-cover grayscale opacity-80 mix-blend-screen scale-110 group-hover:scale-125 group-hover:grayscale-0 transition-transform duration-1000 origin-center shadow-none"
            style={{ transform: "scaleX(-1)" }} // mirror for natural reflection feel
          />
          {/* Glass glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform delay-100"></div>
        </div>

      </div>

      {/* SVG Clip Paths Definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="left-lens-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.125 0.266 C 0.187 0.133, 0.312 0.133, 0.45 0.266 C 0.462 0.4, 0.425 0.733, 0.312 0.8 C 0.187 0.866, 0.1 0.6, 0.125 0.266 Z"></path>
          </clipPath>
          <clipPath id="right-lens-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.55 0.266 C 0.687 0.133, 0.812 0.133, 0.875 0.266 C 0.9 0.6, 0.812 0.866, 0.687 0.8 C 0.575 0.733, 0.537 0.4, 0.55 0.266 Z"></path>
          </clipPath>
        </defs>
      </svg>
      
    </section>
  );
}
