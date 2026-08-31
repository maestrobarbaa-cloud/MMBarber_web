// Procedural Text Engine (The AI Mimic Algorithm)

const ACTIONS_CS = [
  "Detekovali jsme narušení trhu a nasadili",
  "Úspěšně jsme dekódovali",
  "Představujeme zcela novou architekturu pro",
  "Naše inženýrské oddělení právě uvolnilo",
  "Optimalizovali jsme algoritmy pro"
];

const ACTIONS_EN = [
  "We detected a market disruption and deployed",
  "We have successfully decoded",
  "Introducing a brand new architecture for",
  "Our engineering division just released",
  "We have optimized algorithms for"
];

const TECH_TERMS_CS = [
  "Neural Network Fade Engine",
  "Spatial Grooming Computing",
  "Quantum Precision Razor",
  "Augmented Style Reality",
  "Cloud-Synced Scissor Dynamics",
  "Machine Learning Texture Mapping",
  "Unibody Haircut Design",
  "Autonomous Styling Module"
];

const TECH_TERMS_EN = [
  "Neural Network Fade Engine",
  "Spatial Grooming Computing",
  "Quantum Precision Razor",
  "Augmented Style Reality",
  "Cloud-Synced Scissor Dynamics",
  "Machine Learning Texture Mapping",
  "Unibody Haircut Design",
  "Autonomous Styling Module"
];

const BARBER_RESULTS_CS = [
  "pro dosažení absolutní kontroly nad vaším střihem.",
  "čímž jsme garantovali 99.9% spolehlivost vašeho vzhledu.",
  "pro vybudování neporazitelného osobního brandu.",
  "aby váš styl plynule komunikoval na globálním trhu.",
  "čímž jsme redefinovali standardy pánské péče v tomto tisíciletí.",
  "pro bezprecedentní úroveň exkluzivity."
];

const BARBER_RESULTS_EN = [
  "to achieve absolute control over your haircut.",
  "guaranteeing 99.9% reliability for your appearance.",
  "to build an unbeatable personal brand.",
  "so your style seamlessly communicates in the global market.",
  "redefining the standards of men's grooming in this millennium.",
  "for an unprecedented level of exclusivity."
];

export function generateProceduralParagraph(lang: string, activeModelId: string, count: number = 2): string {
  // Use a pseudo-random seed based on the date and model so it stays stable for a day, but changes daily
  const seed = new Date().toDateString() + activeModelId;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; 
  }

  const random = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };

  const pick = (arr: string[]) => arr[Math.floor(random() * arr.length)];

  let paragraphs = [];
  for (let i = 0; i < count; i++) {
    const action = lang === 'cs' ? pick(ACTIONS_CS) : pick(ACTIONS_EN);
    const tech = lang === 'cs' ? pick(TECH_TERMS_CS) : pick(TECH_TERMS_EN);
    const result = lang === 'cs' ? pick(BARBER_RESULTS_CS) : pick(BARBER_RESULTS_EN);
    
    paragraphs.push(`${action} ${tech} ${result}`);
  }

  return paragraphs.join(" ");
}
