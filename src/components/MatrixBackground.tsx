"use client";

import { useEffect, useRef, useState } from "react";

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => {
      setIsActive(document.documentElement.classList.contains("mode-matrix"));
    };

    checkActive();
    window.addEventListener("mmbarber-mode-update", checkActive);

    // Initial check for server-side hydration delay
    const timer = setTimeout(checkActive, 100);

    return () => {
      window.removeEventListener("mmbarber-mode-update", checkActive);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const chars = "MMBARBER0101シハミヒニリサテトボポウエ".split("");

    let animationFrameId: number;
    let accentColor = "#00ff41";

    const updateColor = () => {
        const rootStyle = getComputedStyle(document.documentElement);
        accentColor = rootStyle.getPropertyValue('--color-mafia-gold').trim() || "#00ff41";
    };
    updateColor();

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = accentColor;
      ctx.font = "bold 20pt monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newCols = Math.floor(width / 20);
      if (newCols > drops.length) {
        for (let i = drops.length; i < newCols; i++) drops[i] = 1;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen"
    />
  );
}
