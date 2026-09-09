import { Search, Map, Moon, Dices, CalendarDays, Zap, Crown } from "lucide-react";

export type AchievementId = 
  | 'first_blood' 
  | 'collector' 
  | 'night_owl' 
  | 'gambler' 
  | 'loyal' 
  | 'investigator'
  | 'vip_member';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: any;
  xpReward: number;
  hint: string;
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  first_blood: {
    id: 'first_blood',
    name: 'První krev',
    description: 'Našli jste svůj první skrytý fragment na webu.',
    icon: Search,
    xpReward: 50,
    hint: 'Něco se skrývá na stránkách. Zkuste se pozorně dívat.'
  },
  collector: {
    id: 'collector',
    name: 'Sběratel',
    description: 'Zkompletovali jste všech 5 fragmentů.',
    icon: Map,
    xpReward: 200,
    hint: 'Získejte všechny fragmenty na webu.'
  },
  night_owl: {
    id: 'night_owl',
    name: 'Noční sova',
    description: 'Procházeli jste web v noci pod rouškou tmy (Noir mód).',
    icon: Moon,
    xpReward: 30,
    hint: 'Nejlepší obchody se dělají po setmění.'
  },
  gambler: {
    id: 'gambler',
    name: 'Hráč',
    description: 'Zahráli jste si na automatech v sekci Elita.',
    icon: Dices,
    xpReward: 40,
    hint: 'Zkuste své štěstí tam, kde se točí velké peníze.'
  },
  loyal: {
    id: 'loyal',
    name: 'Věrný člen rodiny',
    description: 'Navštívili jste nás několik dní po sobě.',
    icon: CalendarDays,
    xpReward: 100,
    hint: 'Rodina ocení, když se ukážete pravidelně.'
  },
  investigator: {
    id: 'investigator',
    name: 'Vyšetřovatel',
    description: 'Našli jste tajnou sekci kompromitovaných účtů.',
    icon: Zap,
    xpReward: 150,
    hint: 'Některé informace by měly zůstat skryty.'
  },
  vip_member: {
    id: 'vip_member',
    name: 'VIP',
    description: 'Dostali jste se do VIP sekce webu.',
    icon: Crown,
    xpReward: 300,
    hint: 'Jen pro ty nejváženější hosty.'
  }
};
