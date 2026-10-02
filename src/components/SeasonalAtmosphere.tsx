"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeType } from "@/lib/holidays";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  opacity: number;
  color?: string;
  particleColorRGB?: string;
  type?: string;
}

interface SeasonalAtmosphereProps {
  theme: ThemeType;
}

// Czech National Symbols
let czLionImg: HTMLImageElement | null = null;
let czEagleImg: HTMLImageElement | null = null;
let czSilesianEagleImg: HTMLImageElement | null = null;

// Other EU Symbols
let deEagleImg: HTMLImageElement | null = null;
let atEagleImg: HTMLImageElement | null = null;
let plEagleImg: HTMLImageElement | null = null;

if (typeof window !== 'undefined') {
  czLionImg = new Image();
  czLionImg.src = '/obr/national/cz_lion.svg';
  czEagleImg = new Image();
  czEagleImg.src = '/obr/national/cz_eagle.svg';
  czSilesianEagleImg = new Image();
  czSilesianEagleImg.src = '/obr/national/cz_silesian.svg';
  
  deEagleImg = new Image();
  deEagleImg.src = '/obr/national/de_eagle.svg';
  
  atEagleImg = new Image();
  atEagleImg.crossOrigin = 'anonymous';
  atEagleImg.src = 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Coat_of_arms_of_Austria.svg';

  plEagleImg = new Image();
  plEagleImg.crossOrigin = 'anonymous';
  plEagleImg.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Coat_of_arms_of_Poland.svg';
}

// Extra National Symbols dynamically loaded (zbytek Evropy a světa)
export const extraNationalSymbols: Record<string, string> = {
  usa_eagle: '/obr/national/usa_eagle.svg', // Local
  uk_arms: '/obr/national/uk_arms.svg', // Local
  it_emblem: '/obr/national/it_emblem.svg', // Local
  es_shield: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Coat_of_arms_of_Spain.svg', // Remote
  ca_arms: '/obr/national/ca_arms.svg', // Local
  ru_eagle: '/obr/national/ru_eagle.svg', // Local
  lt_vytis: '/obr/national/lt_vytis.svg', // Local
  lv_arms: '/obr/national/lv_arms.svg', // Local
  ee_arms: '/obr/national/ee_arms.svg', // Local
  nl_arms: '/obr/national/nl_arms.svg', // Local
  be_arms: '/obr/national/be_arms.svg', // Local
  pt_arms: '/obr/national/pt_arms.svg', // Local
  ro_arms: '/obr/national/ro_arms.svg', // Local
  bg_arms: '/obr/national/bg_arms.svg', // Local
  hr_arms: '/obr/national/hr_arms.svg', // Local
  si_arms: '/obr/national/si_arms.svg', // Local
  fr_arms: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Armoiries_de_la_R%C3%A9publique_fran%C3%A7aise.svg', // Remote
  gr_arms: '/obr/national/gr_arms.svg', // Local
  sk_arms: '/obr/national/sk_arms.svg', // Local
  se_arms: '/obr/national/se_arms.svg', // Local
  fi_arms: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Coat_of_arms_of_Finland.svg', // Remote
  dk_arms: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/National_coat_of_arms_of_Denmark.svg', // Remote
  ie_arms: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Coat_of_arms_of_Ireland.svg', // Remote
  ch_arms: '/obr/national/ch_arms.svg', // Local
  tr_emblem: '/obr/national/tr_emblem.svg' // Local
};

const extraImages: Record<string, HTMLImageElement> = {};
if (typeof window !== 'undefined') {
  Object.entries(extraNationalSymbols).forEach(([key, url]) => {
     const img = new Image();
     if (url.startsWith('http')) {
       img.crossOrigin = 'anonymous';
     }
     img.src = url;
     extraImages[key] = img;
  });
}

const SK_CROSS_PATH = typeof window !== 'undefined' ? new Path2D("M241.4 209c10.7.2 31.6.6 50.1-5.6 0 0-.4 6.7-.4 14.4s.5 14.4.5 14.4c-17-5.7-38.1-5.8-50.2-5.7v41.2h-16.8v-41.2c-12-.1-33.1 0-50.1 5.7 0 0 .5-6.7.5-14.4s-.5-14.4-.5-14.4c18.5 6.2 39.4 5.8 50 5.6v-25.9c-9.7 0-23.7.4-39.6 5.7 0 0 .5-6.6.5-14.4 0-7.7-.5-14.4-.5-14.4 15.9 5.3 29.9 5.8 39.6 5.7-.5-16.4-5.3-37-5.3-37s9.9.7 13.8.7 13.8-.7 13.8-.7-4.8 20.6-5.3 37c9.7.1 23.7-.4 39.6-5.7 0 0-.5 6.7-.5 14.4s.5 14.4.5 14.4a119 119 0 0 0-39.7-5.7v26z") : null;
const SK_HILLS_PATH = typeof window !== 'undefined' ? new Path2D("M233 263.3c-19.9 0-30.5 27.5-30.5 27.5s-6-13-22.2-13c-11 0-19 9.7-24.2 18.8 20 31.7 51.9 51.3 76.9 63.4 25-12 57-31.7 76.9-63.4-5.2-9-13.2-18.8-24.2-18.8-16.2 0-22.2 13-22.2 13S253 263.3 233 263.3") : null;

export function SeasonalAtmosphere({ theme }: SeasonalAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Map theme to behavior
  const getThemeConfig = () => {
    switch (theme) {
      case 'winter':
        return { particle: 'snow', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '160, 196, 255' };
      case 'silvestr':
        return { particle: 'snow', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '160, 196, 255' };
      case 'christmas':
        return { particle: 'snow', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '46, 125, 50' };
      case 'sakura':
      case 'may':
      case 'spring':
        return { particle: 'sakura_petal', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 179, 198' };
      case 'valentine':
        return { particle: 'heart', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 51, 102' };
      case 'veterans':
        return { particle: 'poppy', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '245, 40, 10' };
      case 'witches':
      case 'harvest':
      case 'halloween':
        return { particle: 'ember', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 102, 0' };
      case 'cny':
        return { particle: 'lantern', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 0, 0' };
      case 'midsummer':
      case 'easter':
        return { particle: 'orb', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '0, 255, 65' };
      case 'allsouls':
        return { particle: 'candle', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 180, 50' };
      case 'summer':
        return { particle: 'orb', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 202, 40' };
      case 'national-cz':
      case 'czech':
        return { particle: 'lion', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '17, 69, 126', particleColors: ['255, 0, 0', '255, 255, 255', '0, 100, 255'] };
      case 'national-sk':
      case 'national-hu':
        return { particle: 'sk_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '11, 78, 162', particleColors: ['255, 0, 0', '255, 255, 255', '0, 100, 255'] };
      case 'national-ru':
        return { particle: 'ru_eagle', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '213, 43, 30', particleColors: ['255, 0, 0', '255, 255, 255', '0, 100, 255'] };
      case 'national-usa':
        return { particle: 'usa_eagle', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '179, 25, 66', particleColors: ['255, 0, 0', '255, 255, 255', '0, 0, 150'] };
      case 'national-uk':
        return { particle: 'uk_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '1, 33, 105', particleColors: ['255, 0, 0', '255, 255, 255', '0, 0, 150'] };
      case 'national-de':
        return { particle: 'de_eagle', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 204, 0', particleColors: ['150, 150, 150', '255, 0, 0', '255, 204, 0'] };
      case 'national-at':
        return { particle: 'at_eagle', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 0, 0', particleColors: ['255, 0, 0', '255, 255, 255'] };
      case 'national-ch':
        return { particle: 'ch_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 0, 0', particleColors: ['255, 0, 0', '255, 255, 255'] };
      case 'national-ca':
        return { particle: 'ca_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 0, 0', particleColors: ['255, 0, 0', '255, 255, 255'] };
      case 'national-tr':
        return { particle: 'tr_emblem', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 0, 0', particleColors: ['255, 0, 0', '255, 255, 255'] };
      case 'national-it':
        return { particle: 'it_emblem', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 146, 70', particleColors: ['0, 146, 70', '255, 255, 255', '206, 43, 55'] };
      case 'national-es':
        return { particle: 'es_shield', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 196, 0', particleColors: ['198, 11, 30', '255, 196, 0'] };
      case 'national-fr':
        return { particle: 'fr_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 85, 164', particleColors: ['0, 85, 164', '255, 255, 255', '239, 65, 53'] };
      case 'national-gr':
        return { particle: 'gr_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '13, 94, 175', particleColors: ['13, 94, 175', '255, 255, 255'] };
      case 'national-pl':
        return { particle: 'pl_eagle', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '220, 20, 60', particleColors: ['255, 255, 255', '220, 20, 60'] };
      case 'national-se':
        return { particle: 'se_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 204, 2', particleColors: ['0, 106, 167', '254, 204, 2'] };
      case 'national-fi':
        return { particle: 'fi_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 47, 108', particleColors: ['255, 255, 255', '0, 47, 108'] };
      case 'national-dk':
        return { particle: 'dk_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '198, 12, 48', particleColors: ['198, 12, 48', '255, 255, 255'] };
      case 'national-ie':
        return { particle: 'ie_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '22, 155, 98', particleColors: ['22, 155, 98', '255, 255, 255', '255, 136, 62'] };
      case 'national-lt':
        return { particle: 'lt_vytis', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '253, 185, 19', particleColors: ['253, 185, 19', '0, 106, 68', '193, 39, 45'] };
      case 'national-lv':
        return { particle: 'lv_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '158, 48, 57', particleColors: ['158, 48, 57', '255, 255, 255', '158, 48, 57'] };
      case 'national-ee':
        return { particle: 'ee_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 114, 206', particleColors: ['0, 114, 206', '0, 0, 0', '255, 255, 255'] };
      case 'national-nl':
        return { particle: 'nl_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 155, 0', particleColors: ['174, 28, 40', '255, 255, 255', '33, 70, 139'] };
      case 'national-be':
        return { particle: 'be_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '253, 218, 36', particleColors: ['0, 0, 0', '253, 218, 36', '239, 51, 64'] };
      case 'national-pt':
        return { particle: 'pt_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 102, 0', particleColors: ['0, 102, 0', '255, 0, 0', '255, 255, 0'] };
      case 'national-ro':
        return { particle: 'ro_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '252, 209, 22', particleColors: ['0, 43, 127', '252, 209, 22', '206, 17, 38'] };
      case 'national-bg':
        return { particle: 'bg_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 150, 110', particleColors: ['255, 255, 255', '0, 150, 110', '214, 38, 18'] };
      case 'national-hr':
        return { particle: 'hr_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '255, 0, 0', particleColors: ['255, 0, 0', '255, 255, 255', '0, 0, 255'] };
      case 'national-si':
        return { particle: 'si_arms', bg: 'black', blend: 'normal', overlay: 'bg-black/80', color: '0, 0, 255', particleColors: ['255, 255, 255', '0, 0, 255', '255, 0, 0'] };
      case 'investor':
        return { particle: 'diamond', bg: 'black', blend: 'screen', overlay: 'bg-black/80', color: '255, 215, 0', particleColors: ['255, 215, 0', '255, 255, 255'] };
      default:
        return { particle: 'none', bg: 'default', blend: 'normal', overlay: 'bg-transparent', color: '255, 255, 255' };
    }
  };

  const config = getThemeConfig();

  useEffect(() => {
    const tier = document.documentElement.getAttribute('data-graphics-tier');
    if (tier === 'low' || tier === 'lite' || config.particle === 'none') {
      setIsVisible(config.particle !== 'none'); // Still render background image if low tier
      // But we will skip canvas animation
    } else {
      setIsVisible(true);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    const nationalKeys = ['lion', 'slovak_cross', 'linden_leaf', 'cross', 'crescent', 'fleur_de_lis', 'pillar', 'de_eagle', 'at_eagle', 'pl_eagle', ...Object.keys(extraNationalSymbols)];
    const isNationalTheme = (type: string | undefined) => type && nationalKeys.includes(type);

    const initParticles = () => {
      const particles: Particle[] = [];
      let numParticles = width < 768 ? 20 : (config.particle === 'snow' ? 80 : 40);
      
      if (isNationalTheme(config.particle)) {
         numParticles = width < 768 ? 5 : 10;
      }
      
      for (let i = 0; i < numParticles; i++) {
        if (isNationalTheme(config.particle)) {
           particles.push({
             x: Math.random() * width,
             y: Math.random() * height,
             size: Math.random() * 15 + 15,
             speedY: -(Math.random() * 0.3 + 0.1),
             speedX: (Math.random() - 0.5) * 0.2,
             angle: 0,
             spin: 0,
             opacity: Math.random() * 0.8,
             type: config.particle,
             particleColorRGB: config.particleColors ? config.particleColors[Math.floor(Math.random() * config.particleColors.length)] : undefined
           });
        } else {
           particles.push({
             x: Math.random() * width,
             y: Math.random() * height - height,
             size: (config.particle === 'eagle') ? Math.random() * 20 + 20 : (config.particle === 'lantern' || config.particle === 'maple_leaf' || config.particle === 'linden_leaf' || config.particle === 'gear' || config.particle === 'sun' || config.particle === 'crescent' || config.particle === 'cross' || config.particle === 'crown' || config.particle === 'racing_shield' || config.particle === 'diamond' || config.particle === 'slovak_cross') ? Math.random() * 15 + 10 : config.particle === 'candle' ? Math.random() * 5 + 8 : (config.particle === 'snow' ? Math.random() * 3 + 1 : Math.random() * 8 + 3),
             speedY: (config.particle === 'ember' || config.particle === 'lantern' || config.particle === 'candle') ? -(Math.random() * 1.0 + 0.3) : Math.random() * 1.5 + 0.5,
             speedX: Math.random() * 1 - 0.5,
             angle: Math.random() * 360,
             spin: (Math.random() - 0.5) * 0.1,
             opacity: Math.random() * 0.6 + 0.2,
             type: config.particle,
             particleColorRGB: config.particleColors ? config.particleColors[Math.floor(Math.random() * config.particleColors.length)] : undefined
           });
        }
      }
      particlesRef.current = particles;
    };
    
    if (tier !== 'low' && tier !== 'lite') {
      initParticles();
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, -p.size / 3, p.size, 0);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, p.size, 0, p.size * 1.2);
      ctx.bezierCurveTo(-p.size / 2, p.size, -p.size, p.size / 3, -p.size, 0);
      ctx.bezierCurveTo(-p.size, -p.size / 3, -p.size / 2, -p.size / 2, 0, 0);
      const gradient = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
      const c = config.color || '255,51,102';
      gradient.addColorStop(0, `rgba(${c}, ${p.opacity})`);
      gradient.addColorStop(1, `rgba(${c}, ${p.opacity * 0.5})`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawSakuraPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      
      const w = p.size;
      const h = p.size * 1.5;
      
      // Nakreslíme lístek sakury s typickým výkrojem na špičce
      ctx.moveTo(0, h * 0.5); // Spodek
      ctx.bezierCurveTo(-w * 0.5, h * 0.1, -w * 0.8, -h * 0.3, -w * 0.4, -h * 0.5); // Levý okraj
      ctx.lineTo(0, -h * 0.35); // Výkroj (cleft)
      ctx.lineTo(w * 0.4, -h * 0.5); // Pravý vršek výkroje
      ctx.bezierCurveTo(w * 0.8, -h * 0.3, w * 0.5, h * 0.1, 0, h * 0.5); // Pravý okraj
      
      const gradient = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
      const c = config.color || '255,179,198';
      gradient.addColorStop(0, `rgba(${c}, ${p.opacity})`);
      gradient.addColorStop(1, `rgba(${c}, ${p.opacity * 0.6})`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawPoppy = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      
      const s = p.size * 1.5; // Zvětšíme je, aby vynikly detaily
      
      // Gradient pro celý květ: od temného středu po zářivou červeno-oranžovou
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
      grad.addColorStop(0, `rgba(30, 0, 0, ${p.opacity})`);
      grad.addColorStop(0.2, `rgba(180, 10, 10, ${p.opacity})`);
      grad.addColorStop(0.6, `rgba(240, 40, 10, ${p.opacity})`);
      grad.addColorStop(1, `rgba(255, 60, 20, ${p.opacity})`);
      
      ctx.fillStyle = grad;
      
      // 4 široké, překrývající se vějířovité lístky (typické pro vlčí mák)
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 2) * i + (i % 2 === 0 ? 0.1 : -0.1));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Široký oblý vějíř
        ctx.bezierCurveTo(s * 1.3, -s * 0.3, s * 1.4, -s * 1.5, 0, -s * 1.4);
        ctx.bezierCurveTo(-s * 1.4, -s * 1.5, -s * 1.3, -s * 0.3, 0, 0);
        ctx.fill();
        
        // Stíny / vrásky lístků (vytváří texturu papírového okvětního lístku)
        ctx.strokeStyle = `rgba(150, 0, 0, ${p.opacity * 0.4})`;
        ctx.lineWidth = s * 0.05;
        for (let j = -1; j <= 1; j++) {
           if (j === 0) continue;
           ctx.beginPath();
           ctx.moveTo(0, 0);
           ctx.quadraticCurveTo(j * s * 0.4, -s * 0.5, j * s * 0.6, -s * 1.1);
           ctx.stroke();
        }
        ctx.restore();
      }
      
      // Realistický střed máku:
      // 1. Černé podloží pod tyčinkami
      ctx.fillStyle = `rgba(10, 10, 10, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Černé tyčinky se žlutým pylem (pestíky) do všech směrů
      ctx.strokeStyle = `rgba(15, 15, 15, ${p.opacity})`;
      ctx.lineWidth = s * 0.03;
      for (let i = 0; i < 18; i++) {
         const angle = (Math.PI * 2 / 18) * i;
         const innerR = s * 0.15;
         // Lehce nepravidelná délka tyčinek
         const outerR = s * 0.4 + Math.sin(i * 123) * s * 0.05; 
         
         // Vykreslit tyčinku
         ctx.beginPath();
         ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
         ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
         ctx.stroke();
         
         // Žlutý pyl (prašník) na konci
         ctx.fillStyle = `rgba(220, 200, 40, ${p.opacity * 0.9})`;
         ctx.beginPath();
         ctx.arc(Math.cos(angle) * outerR, Math.sin(angle) * outerR, s * 0.05, 0, Math.PI * 2);
         ctx.fill();
      }
      
      // 3. Zelená makovice (tobolka) úplně uprostřed
      ctx.fillStyle = `rgba(80, 120, 40, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
      ctx.fill();
      
      // 4. Hvězdicovité rýhování na zelené tobolce (hnědo-zelená linka)
      ctx.strokeStyle = `rgba(40, 60, 20, ${p.opacity})`;
      ctx.lineWidth = s * 0.02;
      for (let i = 0; i < 8; i++) {
         const angle = (Math.PI * 2 / 8) * i;
         ctx.beginPath();
         ctx.moveTo(0, 0);
         ctx.lineTo(Math.cos(angle) * s * 0.18, Math.sin(angle) * s * 0.18);
         ctx.stroke();
      }
      
      ctx.restore();
    };

    const drawSnow = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    };

    const drawEmber = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 100}, 0, ${p.opacity})`;
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,50,0,0.8)";
    };

    const drawLindenLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      // Lipový lístek (podobný srdci, ale se špičkou víc protaženou)
      ctx.moveTo(0, p.size / 2);
      ctx.bezierCurveTo(-p.size, p.size, -p.size * 1.5, -p.size / 2, 0, -p.size);
      ctx.bezierCurveTo(p.size * 1.5, -p.size / 2, p.size, p.size, 0, p.size / 2);
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      ctx.restore();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos(((18 + i * 72) / 180) * Math.PI) * p.size, -Math.sin(((18 + i * 72) / 180) * Math.PI) * p.size);
        ctx.lineTo(Math.cos(((54 + i * 72) / 180) * Math.PI) * (p.size * 0.4), -Math.sin(((54 + i * 72) / 180) * Math.PI) * (p.size * 0.4));
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.6)`;
      ctx.restore();
    };

    const drawGear = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
        ctx.lineTo(Math.cos(a + 0.2) * (p.size * 1.2), Math.sin(a + 0.2) * (p.size * 1.2));
        ctx.lineTo(Math.cos(a + 0.6) * (p.size * 1.2), Math.sin(a + 0.6) * (p.size * 1.2));
        ctx.lineTo(Math.cos(a + 0.8) * p.size, Math.sin(a + 0.8) * p.size);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawRacingShield = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      // Štít (Scuderia style)
      ctx.moveTo(-p.size, -p.size); 
      ctx.lineTo(p.size, -p.size); 
      ctx.quadraticCurveTo(p.size, p.size * 0.5, 0, p.size * 1.2);
      ctx.quadraticCurveTo(-p.size, p.size * 0.5, -p.size, -p.size); 
      ctx.closePath();
      ctx.fill();
      
      // Výřez pro proužek nahoře (vlajka)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.rect(-p.size * 0.8, -p.size * 0.8, p.size * 1.6, p.size * 0.3);
      ctx.fill();
      
      // Výřez pro trojúhelník uprostřed (evokující koně/znak)
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.2);
      ctx.lineTo(p.size * 0.4, p.size * 0.5);
      ctx.lineTo(-p.size * 0.4, p.size * 0.5);
      ctx.closePath();
      ctx.fill();
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${c}, 0.8)`;
      ctx.restore();
    };

    const drawSun = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.moveTo(Math.cos(a) * (p.size * 0.6), Math.sin(a) * (p.size * 0.6));
        ctx.lineTo(Math.cos(a) * (p.size * 1.2), Math.sin(a) * (p.size * 1.2));
      }
      ctx.fill();
      ctx.lineWidth = p.size * 0.2;
      ctx.strokeStyle = `rgba(${c}, ${p.opacity})`;
      ctx.stroke();
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${c}, 0.8)`;
      ctx.restore();
    };

    const drawMapleLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      
      // Měřítko listu
      const s = p.size / 10;
      
      ctx.beginPath();
      ctx.moveTo(0 * s, -10 * s); // top
      ctx.lineTo(1.5 * s, -6 * s);
      ctx.lineTo(3.5 * s, -7.5 * s);
      ctx.lineTo(2.5 * s, -2 * s);
      ctx.lineTo(8 * s, -5 * s);
      ctx.lineTo(6 * s, -1 * s);
      ctx.lineTo(10 * s, 0.5 * s);
      ctx.lineTo(7 * s, 3 * s);
      ctx.lineTo(8 * s, 6 * s);
      ctx.lineTo(3 * s, 5 * s);
      ctx.lineTo(1 * s, 5 * s);
      ctx.lineTo(1 * s, 11 * s);
      ctx.lineTo(-1 * s, 11 * s);
      ctx.lineTo(-1 * s, 5 * s);
      ctx.lineTo(-3 * s, 5 * s);
      ctx.lineTo(-8 * s, 6 * s);
      ctx.lineTo(-7 * s, 3 * s);
      ctx.lineTo(-10 * s, 0.5 * s);
      ctx.lineTo(-6 * s, -1 * s);
      ctx.lineTo(-8 * s, -5 * s);
      ctx.lineTo(-2.5 * s, -2 * s);
      ctx.lineTo(-3.5 * s, -7.5 * s);
      ctx.lineTo(-1.5 * s, -6 * s);
      ctx.closePath();
      
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      ctx.restore();
    };

    const drawCross = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      const thick = p.size * 0.6;
      ctx.fillRect(-thick / 2, -p.size, thick, p.size * 2);
      ctx.fillRect(-p.size, -thick / 2, p.size * 2, thick);
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.6)`;
      ctx.restore();
    };

    const drawCrescent = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(p.size * 0.3, -p.size * 0.3, p.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawMusicNote = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(-p.size * 0.5, p.size * 0.5, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-p.size * 0.1, -p.size * 0.8, p.size * 0.2, p.size * 1.3);
      ctx.fillRect(-p.size * 0.1, -p.size * 0.8, p.size, p.size * 0.3);
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      ctx.restore();
    };

    const drawCrown = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      ctx.moveTo(-p.size, p.size * 0.5);
      ctx.lineTo(p.size, p.size * 0.5);
      ctx.lineTo(p.size * 1.2, -p.size * 0.2);
      ctx.lineTo(p.size * 0.4, 0);
      ctx.lineTo(0, -p.size * 0.8);
      ctx.lineTo(-p.size * 0.4, 0);
      ctx.lineTo(-p.size * 1.2, -p.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      ctx.restore();
    };

    const drawDiamond = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 215, 0';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.7, 0);
      ctx.lineTo(0, p.size);
      ctx.lineTo(-p.size * 0.7, 0);
      ctx.closePath();
      ctx.fill();
      
      // inner detail
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.5);
      ctx.lineTo(p.size * 0.3, 0);
      ctx.lineTo(0, p.size * 0.5);
      ctx.lineTo(-p.size * 0.3, 0);
      ctx.closePath();
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${c}, 1)`;
      ctx.restore();
    };

    const drawSlovakCross = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      // Scale based on original SVG viewport size
      const scale = p.size / 60;
      ctx.scale(scale, scale);
      ctx.translate(-233, -245); // Center the path
      
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      
      if (SK_CROSS_PATH && SK_HILLS_PATH) {
        ctx.fill(SK_CROSS_PATH);
        ctx.fill(SK_HILLS_PATH);
      }
      ctx.restore();
    };

    const drawEagle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      try {
        if (czEagleImg && czEagleImg.complete && czEagleImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(0, 80, 200, 0.4)`;

          // Modrý štít (erb) pro moravskou orlici
          const sw = p.size * 1.1;
          const sh = p.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(-sw, -sh);
          ctx.lineTo(sw, -sh);
          ctx.lineTo(sw, sh * 0.2);
          ctx.quadraticCurveTo(sw, sh * 1.1, 0, sh * 1.4);
          ctx.quadraticCurveTo(-sw, sh * 1.1, -sw, sh * 0.2);
          ctx.closePath();
          ctx.fillStyle = `rgba(0, 60, 160, ${p.opacity * 0.85})`;
          ctx.fill();

          ctx.drawImage(czEagleImg, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          return;
        }
      } catch (e) {}

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.arc(p.size * 0.2, -p.size * 0.8, p.size * 0.3, 0, Math.PI * 2);
      ctx.moveTo(-p.size * 0.3, -p.size * 0.3); ctx.lineTo(-p.size * 1.5, -p.size * 0.9); ctx.lineTo(-p.size * 1.0, 0); ctx.lineTo(-p.size * 0.3, p.size * 0.3);
      ctx.moveTo(p.size * 0.3, -p.size * 0.3); ctx.lineTo(p.size * 1.5, -p.size * 0.9); ctx.lineTo(p.size * 1.0, 0); ctx.lineTo(p.size * 0.3, p.size * 0.3);
      ctx.moveTo(-p.size * 0.4, p.size * 0.5); ctx.lineTo(0, p.size * 1.3); ctx.lineTo(p.size * 0.4, p.size * 0.5);
      ctx.fill();
      ctx.restore();
    };

    const drawSilesianEagle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      try {
        if (czSilesianEagleImg && czSilesianEagleImg.complete && czSilesianEagleImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 204, 0, 0.4)`;
          
          // Gold shield backing (erb) for the black eagle to make it visible
          const sw = p.size * 1.1;
          const sh = p.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(-sw, -sh);
          ctx.lineTo(sw, -sh);
          ctx.lineTo(sw, sh * 0.2);
          ctx.quadraticCurveTo(sw, sh * 1.1, 0, sh * 1.4);
          ctx.quadraticCurveTo(-sw, sh * 1.1, -sw, sh * 0.2);
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 204, 0, ${p.opacity * 0.85})`;
          ctx.fill();

          ctx.drawImage(czSilesianEagleImg, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          return;
        }
      } catch (e) {}

      // Fallback
      drawEagle(ctx, p);
    };

    const drawFleurDeLis = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s*0.3, -s*0.3, s*0.6, 0);
      ctx.quadraticCurveTo(s*0.3, s*0.2, 0, s*0.8);
      ctx.quadraticCurveTo(-s*0.3, s*0.2, -s*0.6, 0);
      ctx.quadraticCurveTo(-s*0.3, -s*0.3, 0, -s);
      
      ctx.moveTo(-s*0.8, -s*0.3);
      ctx.quadraticCurveTo(-s*0.2, -s*0.1, -s*0.1, s*0.5);
      ctx.quadraticCurveTo(-s*0.5, s*0.3, -s*0.8, -s*0.3);

      ctx.moveTo(s*0.8, -s*0.3);
      ctx.quadraticCurveTo(s*0.2, -s*0.1, s*0.1, s*0.5);
      ctx.quadraticCurveTo(s*0.5, s*0.3, s*0.8, -s*0.3);
      
      ctx.rect(-s*0.5, s*0.4, s, s*0.15);
      ctx.fill();
      ctx.restore();
    };

    const drawPillar = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      
      const s = p.size;
      ctx.fillRect(-s*0.8, -s*0.8, s*1.6, s*0.2);
      ctx.fillRect(-s*0.6, -s*0.6, s*1.2, s*0.2);
      ctx.fillRect(-s*0.4, -s*0.4, s*0.8, s*1.2);
      
      ctx.fillStyle = `rgba(0,0,0,${p.opacity*0.3})`;
      ctx.fillRect(-s*0.2, -s*0.4, s*0.1, s*1.2);
      ctx.fillRect(s*0.1, -s*0.4, s*0.1, s*1.2);
      
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.fillRect(-s*0.6, s*0.8, s*1.2, s*0.2);
      ctx.fillRect(-s*0.8, s*1.0, s*1.6, s*0.2);
      
      ctx.restore();
    };

    const drawDeEagle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      try {
        if (deEagleImg && deEagleImg.complete && deEagleImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 204, 0, 0.4)`;
          ctx.drawImage(deEagleImg, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          return;
        }
      } catch (e) {}
    };

    const drawAtEagle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      try {
        if (atEagleImg && atEagleImg.complete && atEagleImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 0, 0, 0.4)`;
          ctx.drawImage(atEagleImg, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          return;
        }
      } catch (e) {}
    };

    const drawPlEagle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      try {
        if (plEagleImg && plEagleImg.complete && plEagleImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 255, 255, 0.4)`;
          
          const sw = p.size * 1.1;
          const sh = p.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(-sw, -sh);
          ctx.lineTo(sw, -sh);
          ctx.lineTo(sw, sh * 0.2);
          ctx.quadraticCurveTo(sw, sh * 1.1, 0, sh * 1.4);
          ctx.quadraticCurveTo(-sw, sh * 1.1, -sw, sh * 0.2);
          ctx.closePath();
          ctx.fillStyle = `rgba(220, 20, 60, ${p.opacity * 0.85})`;
          ctx.fill();

          ctx.drawImage(plEagleImg, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          return;
        }
      } catch (e) {}
    };

    const drawExtraNationalSymbol = (ctx: CanvasRenderingContext2D, p: Particle, time: number) => {
      try {
        const img = extraImages[p.type || ''];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          
          let pulse = 1;
          let alphaMultiplier = 1;
          let customRotate = p.angle;
          let glowIntensity = 15;
          
          // Unikátní efekty podle lokace
          if (p.type === 'usa_eagle' || p.type === 'uk_arms' || p.type === 'ru_eagle') {
             // Imperiální / Majestátní - hluboké pomalé dýchání
             pulse = 1 + Math.sin(time * 0.8) * 0.15;
             glowIntensity = 25;
          } else if (p.type === 'it_emblem' || p.type === 'es_shield' || p.type === 'pt_arms' || p.type === 'hr_arms') {
             // Jižanské / Středomořské - energické pohupování a třpyt
             customRotate += Math.sin(time * 1.5) * 0.15;
             pulse = 1 + Math.sin(time * 2.0) * 0.05;
          } else if (p.type === 'lt_vytis' || p.type === 'lv_arms' || p.type === 'ee_arms' || p.type === 'bg_arms' || p.type === 'ro_arms') {
             // Východní / Pobaltské - mystické problikávání a silná aura
             alphaMultiplier = 0.7 + Math.cos(time * 3.0) * 0.3;
             pulse = 1 + Math.sin(time * 0.5) * 0.05;
             glowIntensity = 30 + Math.sin(time * 5.0) * 10;
          } else if (p.type === 'ca_arms' || p.type === 'nl_arms' || p.type === 'be_arms' || p.type === 'si_arms') {
             // Západní / Střední - elegantní jemné vznášení
             customRotate += Math.sin(time * 0.5) * 0.1;
             alphaMultiplier = 0.9 + Math.sin(time * 1.0) * 0.1;
          } else if (p.type === 'fr_arms' || p.type === 'gr_arms' || p.type === 'sk_arms' || p.type === 'se_arms' || p.type === 'fi_arms' || p.type === 'dk_arms' || p.type === 'ie_arms' || p.type === 'ch_arms' || p.type === 'tr_emblem') {
             // Zbrusu nový efekt: "Křišťálový třpyt" - symboly pulzují rovnoměrně a ostře problikávají
             pulse = 1 + Math.sin(time * 1.2) * 0.08 + Math.cos(time * 2.5) * 0.02; // Rovnoměrné dýchání bez deformace
             customRotate += Math.cos(time * 0.8) * 0.08;
             glowIntensity = 40 + Math.sin(time * 8.0) * 20; // Extrémně silná tepající záře
             alphaMultiplier = 0.8 + Math.cos(time * 6.0) * 0.2;
          }

          ctx.rotate(customRotate);
          ctx.scale(pulse, pulse);
          ctx.globalAlpha = Math.min(1, Math.max(0, p.opacity * alphaMultiplier));
          ctx.shadowBlur = glowIntensity;
          
          // Osvětlení ve státních barvách (barvy pocházejí z p.particleColorRGB)
          const rgb = p.particleColorRGB || '255, 255, 255';
          ctx.shadowColor = `rgba(${rgb}, ${0.5 * alphaMultiplier})`;
          
          ctx.drawImage(img, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
        }
      } catch (e) {}
    };

    const drawLion = (ctx: CanvasRenderingContext2D, p: Particle) => {
      try {
        if (czLionImg && czLionImg.complete && czLionImg.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 255, 255, 0.3)`;
          ctx.drawImage(czLionImg, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
          return;
        }
      } catch (e) {
        // Fallback drawing if image fails or gets tainted
      }
      
      // Fallback geometric lion head
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const c = p.particleColorRGB || '255, 255, 255';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${c}, 0.5)`;
      ctx.beginPath();
      for(let i=0; i<16; i++) {
        let r = (i%2===0) ? p.size : p.size * 0.75;
        let a = (i/16) * Math.PI * 2;
        ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(-p.size*0.15, -p.size*0.1, p.size*0.12, 0, Math.PI*2);
      ctx.arc(p.size*0.15, -p.size*0.1, p.size*0.12, 0, Math.PI*2);
      ctx.moveTo(-p.size*0.1, p.size*0.2);
      ctx.lineTo(p.size*0.1, p.size*0.2);
      ctx.lineTo(0, p.size*0.35);
      ctx.fill();
      ctx.restore();
    };

    const drawOrb = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      const c = p.particleColorRGB || '180, 255, 150';
      ctx.fillStyle = `rgba(${c}, ${p.opacity})`;
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${c}, 0.6)`;
    };

    const drawCandle = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      
      const width = p.size * 0.6;
      const height = p.size * 2;
      
      // Sways softly
      ctx.rotate(Math.sin(p.angle) * 0.1);
      
      // Candle body (wax)
      ctx.fillStyle = `rgba(220, 220, 200, ${p.opacity})`;
      ctx.fillRect(-width/2, 0, width, height);
      
      // Wick
      ctx.strokeStyle = `rgba(50, 50, 50, ${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -p.size * 0.3);
      ctx.stroke();

      // Flame (flickering)
      const flicker = Math.random() * 0.2 + 0.8; 
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(255, 150, 0, ${p.opacity * flicker})`;
      
      ctx.beginPath();
      ctx.ellipse(0, -p.size * 0.7, width * 0.8 * flicker, p.size * 0.6 * flicker, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 180, 50, ${p.opacity * flicker})`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawLantern = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      
      // Sways softly
      ctx.rotate(Math.sin(p.angle) * 0.2);
      
      const width = p.size;
      const height = p.size * 1.2;
      
      // Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(255, 50, 0, ${p.opacity})`;

      // Lantern body (red/orange glow)
      ctx.beginPath();
      ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 40, 0, ${p.opacity})`;
      ctx.fill();
      
      // Vertical lines on the lantern
      ctx.strokeStyle = `rgba(100, 10, 0, ${p.opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.4, height, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.8, height, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Top and bottom caps
      ctx.fillStyle = `rgba(255, 200, 0, ${p.opacity})`;
      ctx.shadowBlur = 0;
      ctx.fillRect(-width * 0.4, -height - 2, width * 0.8, 3);
      ctx.fillRect(-width * 0.4, height - 1, width * 0.8, 3);
      
      // Tassel at the bottom
      ctx.beginPath();
      ctx.moveTo(0, height + 2);
      ctx.lineTo(0, height + p.size * 0.8);
      ctx.strokeStyle = `rgba(255, 150, 0, ${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    };


    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const time = Date.now() * 0.001;
      const globalWind = Math.sin(time * 0.5) * 0.5;
      
      particlesRef.current.forEach((p, index) => {
        if (isNationalTheme(config.particle)) {
           p.size += 0.08;
           p.y += p.speedY;
           p.x += p.speedX + Math.sin(time * 0.5 + index) * 0.2;
           p.angle = Math.sin(time * 0.4 + index) * 0.1;

           if (p.size < 40) {
              p.opacity = Math.min(1, p.opacity + 0.005);
           } else if (p.size > 70) {
              p.opacity = Math.max(0, p.opacity - 0.008);
           }

           if (p.opacity <= 0 && p.size > 70) {
              p.size = Math.random() * 10 + 10;
              p.x = Math.random() * width;
              p.y = Math.random() * height;
              p.opacity = 0;
           }
        } else {
           p.y += p.speedY;
           p.x += p.speedX + globalWind;
           p.angle += p.spin;

           if (config.particle === 'ember' || config.particle === 'lantern' || config.particle === 'candle') {
               if (p.y < -p.size * 3) {
                   p.y = height + p.size * 3;
                   p.x = Math.random() * width;
               }
           } else {
               if (p.y > height + p.size) {
                   p.y = -p.size;
                   p.x = Math.random() * width;
               }
           }

           if (p.x > width + p.size) p.x = -p.size;
           else if (p.x < -p.size) p.x = width + p.size;
        }

        if (config.particle === 'heart') drawHeart(ctx, p);
        else if (config.particle === 'sakura_petal') drawSakuraPetal(ctx, p);
        else if (config.particle === 'poppy') drawPoppy(ctx, p);
        else if (config.particle === 'snow') drawSnow(ctx, p);
        else if (config.particle === 'ember') drawEmber(ctx, p);
        else if (config.particle === 'orb') drawOrb(ctx, p);
        else if (config.particle === 'lantern') drawLantern(ctx, p);
        else if (config.particle === 'candle') drawCandle(ctx, p);
        else if (config.particle === 'linden_leaf') drawLindenLeaf(ctx, p);
        else if (config.particle === 'star') drawStar(ctx, p);
        else if (config.particle === 'gear') drawGear(ctx, p);
        else if (config.particle === 'racing_shield') drawRacingShield(ctx, p);
        else if (config.particle === 'sun') drawSun(ctx, p);
        else if (config.particle === 'maple_leaf') drawMapleLeaf(ctx, p);
        else if (config.particle === 'cross') drawCross(ctx, p);
        else if (config.particle === 'crescent') drawCrescent(ctx, p);
        else if (config.particle === 'music_note') drawMusicNote(ctx, p);
        else if (config.particle === 'crown') drawCrown(ctx, p);
        else if (config.particle === 'diamond') drawDiamond(ctx, p);
        else if (config.particle === 'slovak_cross') drawSlovakCross(ctx, p);
        else if (config.particle === 'fleur_de_lis') drawFleurDeLis(ctx, p);
        else if (config.particle === 'pillar') drawPillar(ctx, p);
        else if (config.particle === 'de_eagle') drawDeEagle(ctx, p);
        else if (config.particle === 'at_eagle') drawAtEagle(ctx, p);
        else if (config.particle === 'pl_eagle') drawPlEagle(ctx, p);
        else if (extraNationalSymbols[config.particle as string]) drawExtraNationalSymbol(ctx, p, time);
        else if (config.particle === 'lion') {
          if (index % 3 === 0) drawLion(ctx, p);
          else if (index % 3 === 1) drawEagle(ctx, p);
          else drawSilesianEagle(ctx, p);
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    if (tier !== 'low' && tier !== 'lite') {
      animate();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [theme]);

  if (!isVisible && config.bg === 'default') return null;
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Image */}
      {config.bg !== 'default' && config.bg !== 'none' && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${config.bg === 'black' ? 'opacity-100' : 'opacity-40'}`} 
          style={config.bg === 'black' ? { backgroundColor: '#020202' } : { backgroundImage: `url('/obr/sezona/${config.bg}.jpg')` }}
        ></div>
      )}
      
      {/* Overlay to ensure text readability */}
      <div className={`absolute inset-0 ${config.overlay} transition-colors duration-1000`}></div>
      
      {/* Particles Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full opacity-90 transition-opacity duration-1000 mix-blend-${config.blend}`}
      />
      {/* Global Color Override */}
      {config.color && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root, html.theme-gold, html.theme-silver, html.theme-blood, html.mode-stealth {
            --color-mafia-gold: rgb(${config.color}) !important;
            --color-mafia-gold-rgb: ${config.color} !important;
            --color-mafia-gold-glow: rgba(${config.color}, 0.5) !important;
          }
        `}} />
      )}
    </div>
  );
}
