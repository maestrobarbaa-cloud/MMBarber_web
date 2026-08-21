import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, Heart, Briefcase, Plane, PawPrint, Users, X, ArrowLeft, Gamepad2, Moon, Flame, Star, Eye, Sparkles, Music, BookOpen, Crown, Palette, Flag, Calendar, Leaf, Home, Activity, Wrench, History, Zap } from 'lucide-react';
import { ProfileData } from './ProfileCard';

export interface SearchFilters {
  category: string | null;
  subCategories: string[];
  onlyIdVerified?: boolean;
}

export interface DiscoveryCategory {
  id: string;
  icon: React.ElementType;
  title: Record<'cs' | 'en', string>;
  description: Record<'cs' | 'en', string>;
  color: string;
  subOptions: { id: string; label: Record<'cs' | 'en', string>; tag: string }[];
}

export const CATEGORIES: DiscoveryCategory[] = [
  {
    id: 'relationships',
    icon: Heart,
    title: { cs: 'Vztahy', en: 'Relationships' },
    description: { cs: 'Láska, flirt nebo něco vážného?', en: 'Love, flirt or something serious?' },
    color: 'border-red-500 text-red-500 bg-red-500/10',
    subOptions: [
      { id: 'serious', label: { cs: '❤️ Vážný vztah', en: '❤️ Serious relationship' }, tag: '❤️ Vážný vztah' },
      { id: 'flirt', label: { cs: '🔥 Flirt a zábava', en: '🔥 Flirt & Fun' }, tag: '🔥 Flirt a zábava' },
      { id: 'fwb', label: { cs: '😏 Kamarádi s výhodami (FWB)', en: '😏 Friends with Benefits' }, tag: '😏 Kamarádi s výhodami' },
      { id: 'ons', label: { cs: '🌙 Na jednu noc (ONS)', en: '🌙 One Night Stand' }, tag: '🌙 Na jednu noc' },
      { id: 'poly', label: { cs: '♾️ Polyamorie / Otevřený vztah', en: '♾️ Polyamory / Open Rel.' }, tag: '♾️ Polyamorie' },
      { id: 'bdsm', label: { cs: '⛓️ BDSM / Kink friendly', en: '⛓️ BDSM / Kink friendly' }, tag: '⛓️ BDSM' },
      { id: 'sugar', label: { cs: '💎 Sugar Dating', en: '💎 Sugar Dating' }, tag: '💎 Sugar Dating' },
      { id: 'sapiosexual', label: { cs: '🧠 Sapiosexuál', en: '🧠 Sapiosexual' }, tag: '🧠 Sapiosexuál' },
    ]
  },
  {
    id: 'friends',
    icon: Users,
    title: { cs: 'Přátelství a Komunita', en: 'Friendship & Community' },
    description: { cs: 'Hledám parťáka nebo svou bublinu.', en: 'Looking for a buddy or my bubble.' },
    color: 'border-blue-500 text-blue-500 bg-blue-500/10',
    subOptions: [
      { id: 'friends', label: { cs: '🤝 Hledám přátele', en: '🤝 Looking for friends' }, tag: '🤝 Hledám přátele' },
      { id: 'party', label: { cs: '🥳 Párty zvíře', en: '🥳 Party animal' }, tag: '🥳 Párty zvíře' },
      { id: 'drama', label: { cs: '👑 Drama Queen / King', en: '👑 Drama Queen / King' }, tag: '👑 Drama Queen / King' },
      { id: 'student', label: { cs: '👩‍🎓 Student', en: '👩‍🎓 Student' }, tag: '👩‍🎓 Student' },
      { id: 'lgbtq', label: { cs: '🌈 LGBTQ+ Friendly', en: '🌈 LGBTQ+ Friendly' }, tag: '🌈 LGBTQ+' },
      { id: 'vegan_com', label: { cs: '🥬 Veganská komunita', en: '🥬 Vegan community' }, tag: '🥬 Veganská komunita' },
      { id: 'gamer_com', label: { cs: '👾 Gamer komunita', en: '👾 Gamer community' }, tag: '👾 Gamer komunita' }
    ]
  },
  {
    id: 'local_communities',
    icon: Home,
    title: { cs: 'Lokální Komunity (Místa)', en: 'Local Communities (Places)' },
    description: { cs: 'Vchody, budovy, ulice a čtvrti. Poznej své sousedy.', en: 'Entrances, buildings, streets and neighborhoods. Meet your neighbors.' },
    color: 'border-cyan-500 text-cyan-500 bg-cyan-500/10',
    subOptions: [
      { id: 'entrance', label: { cs: '🚪 Vchod', en: '🚪 Entrance' }, tag: '🚪 Vchod' },
      { id: 'building', label: { cs: '🏢 Budova', en: '🏢 Building' }, tag: '🏢 Budova' },
      { id: 'street', label: { cs: '🛣️ Ulice', en: '🛣️ Street' }, tag: '🛣️ Ulice' },
      { id: 'neighborhood', label: { cs: '🏘️ Čtvrť', en: '🏘️ Neighborhood' }, tag: '🏘️ Čtvrť' }
    ]
  },
  {
    id: 'school',
    icon: BookOpen,
    title: { cs: 'Škola a Spolužáci', en: 'School & Classmates' },
    description: { cs: 'Hledám staré spolužáky, nebo parťáky na učení.', en: 'Looking for old classmates or study buddies.' },
    color: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
    subOptions: [
      { id: 'old_classmates', label: { cs: '🎓 Staré spolužáky', en: '🎓 Old classmates' }, tag: '🎓 Starý spolužák' },
      { id: 'new_classmates', label: { cs: '🎒 Nové spolužáky', en: '🎒 New classmates' }, tag: '🎒 Nový spolužák' },
      { id: 'study_buddy', label: { cs: '📚 Parťáka na učení', en: '📚 Study buddy' }, tag: '📚 Parťák na učení' },
      { id: 'uni_friends', label: { cs: '🏫 Lidi z intru / koleje', en: '🏫 Dorm friends' }, tag: '🏫 Kolej/Intr' },
      { id: 'tutor', label: { cs: '👨‍🏫 Doučování / Mentoring', en: '👨‍🏫 Tutoring / Mentoring' }, tag: '👨‍🏫 Doučování' },
      
      { id: 'student_it', label: { cs: '💻 Student - IT / Tech', en: '💻 Student - IT / Tech' }, tag: '💻 Student IT' },
      { id: 'student_humanities', label: { cs: '🎭 Student - Humanitní obory', en: '🎭 Student - Humanities' }, tag: '🎭 Humanitní obory' },
      { id: 'student_med', label: { cs: '⚕️ Student - Medicína / Zdr.', en: '⚕️ Student - Medical' }, tag: '⚕️ Medicína' },
      { id: 'student_law', label: { cs: '⚖️ Student - Práva', en: '⚖️ Student - Law' }, tag: '⚖️ Práva' },
      { id: 'student_eco', label: { cs: '📊 Student - Ekonomie / Byznys', en: '📊 Student - Economics' }, tag: '📊 Ekonomie' },
      { id: 'student_pedagogy', label: { cs: '🧸 Student - Pedagogika', en: '🧸 Student - Pedagogy' }, tag: '🧸 Pedagogika' },
      { id: 'student_art', label: { cs: '🎨 Student - Umění / Design', en: '🎨 Student - Art / Design' }, tag: '🎨 Umění' },
      { id: 'student_engineering', label: { cs: '⚙️ Student - Technika / Stroj.', en: '⚙️ Student - Engineering' }, tag: '⚙️ Technika/Strojní' },
      { id: 'student_architecture', label: { cs: '📐 Student - Architektura', en: '📐 Student - Architecture' }, tag: '📐 Architektura' },
      { id: 'student_languages', label: { cs: '🗣️ Student - Jazyky / Filo.', en: '🗣️ Student - Languages' }, tag: '🗣️ Jazyky/Filologie' },
      { id: 'student_sports', label: { cs: '💪 Student - Sport / FTVS', en: '💪 Student - Sports' }, tag: '💪 Sportovní' },
      { id: 'student_agriculture', label: { cs: '🌾 Student - Zemědělství / Eko.', en: '🌾 Student - Agriculture' }, tag: '🌾 Zemědělské' },
      { id: 'student_police', label: { cs: '👮 Student - Bezpečnost / Policie', en: '👮 Student - Security' }, tag: '👮 Bezpečnostní' },
      { id: 'student_chemistry', label: { cs: '⚗️ Student - Chemie / FCHT', en: '⚗️ Student - Chemistry' }, tag: '⚗️ Chemie' }
    ]
  },
  {
    id: 'clubs',
    icon: Flag,
    title: { cs: 'Spolky a Zájmové skupiny', en: 'Clubs & Interest Groups' },
    description: { cs: 'Přidej se k lidem, kteří sdílejí tvou specifickou vášeň.', en: 'Join people who share your specific passion.' },
    color: 'border-orange-500 text-orange-500 bg-orange-500/10',
    subOptions: [
      { id: 'golf', label: { cs: '⛳ Golfový klub', en: '⛳ Golf club' }, tag: '⛳ Golfový klub' },
      { id: 'cigar', label: { cs: '🚬 Klub kuřáků doutníků', en: '🚬 Cigar smokers club' }, tag: '🚬 Doutníky' },
      { id: 'wine', label: { cs: '🍷 Vinný sklípek', en: '🍷 Wine tasting' }, tag: '🍷 Degustace vína' },
      { id: 'bookclub', label: { cs: '📖 Knižní klub', en: '📖 Book club' }, tag: '📖 Knižní klub' },
      { id: 'chess', label: { cs: '♟️ Šachový spolek', en: '♟️ Chess club' }, tag: '♟️ Šachy' },
      { id: 'business', label: { cs: '💼 Podnikatelský spolek', en: '💼 Business club' }, tag: '💼 Podnikatelský spolek' },
      { id: 'invest', label: { cs: '📈 Investiční kroužek', en: '📈 Investment circle' }, tag: '📈 Investiční kroužek' }
    ]
  },
  {
    id: 'career',
    icon: Briefcase,
    title: { cs: 'Kariéra, Profese a Byznys', en: 'Career, Professions & Business' },
    description: { cs: 'Networking, ambice, řemesla a odborníci.', en: 'Networking, ambitions, trades and experts.' },
    color: 'border-mafia-gold text-mafia-gold bg-mafia-gold/10',
    subOptions: [
      { id: 'ceo', label: { cs: '🏢 Ředitel / CEO', en: '🏢 Director / CEO' }, tag: '🏢 Ředitel / CEO' },
      { id: 'manager', label: { cs: '👔 Manažer / Vedoucí', en: '👔 Manager / Leader' }, tag: '👔 Manažer / Vedoucí' },
      { id: 'project_manager', label: { cs: '📋 Projektový manažer', en: '📋 Project Manager' }, tag: '📋 Projektový manažer' },
      { id: 'hr', label: { cs: '👥 HR / Personalista', en: '👥 HR / Recruiter' }, tag: '👥 HR / Personalista' },
      { id: 'assistant', label: { cs: '📝 Asistent/ka', en: '📝 Assistant' }, tag: '📝 Asistent/ka' },
      { id: 'entrepreneur', label: { cs: '💼 Podnikatel / Živnostník', en: '💼 Entrepreneur / Freelancer' }, tag: '💼 Podnikatel / Živnostník' },
      { id: 'investor', label: { cs: '💸 Investor', en: '💸 Investor' }, tag: '💸 Investor' },
      
      { id: 'developer', label: { cs: '💻 Vývojář / IT', en: '💻 Developer / IT' }, tag: '💻 Vývojář / IT' },
      { id: 'tester', label: { cs: '🐛 QA / Tester', en: '🐛 QA / Tester' }, tag: '🐛 QA / Tester' },
      { id: 'data_analyst', label: { cs: '📊 Datový analytik', en: '📊 Data Analyst' }, tag: '📊 Datový analytik' },
      { id: 'cybersecurity', label: { cs: '🛡️ Kyberbezpečnost', en: '🛡️ Cybersecurity' }, tag: '🛡️ Kyberbezpečnost' },
      { id: 'ux_ui', label: { cs: '🎨 UX/UI Designér', en: '🎨 UX/UI Designer' }, tag: '🎨 UX/UI Designér' },
      
      { id: 'accountant', label: { cs: '🧾 Účetní / Auditor', en: '🧾 Accountant / Auditor' }, tag: '🧾 Účetní / Auditor' },
      { id: 'finance', label: { cs: '💹 Finanční poradce', en: '💹 Financial Advisor' }, tag: '💹 Finanční poradce' },
      { id: 'lawyer', label: { cs: '⚖️ Právník / Advokát', en: '⚖️ Lawyer / Attorney' }, tag: '⚖️ Právník / Advokát' },
      { id: 'banker', label: { cs: '🏦 Bankéř / Úředník', en: '🏦 Banker / Clerk' }, tag: '🏦 Bankéř' },
      
      { id: 'sales', label: { cs: '🤝 Obchodník / Prodej', en: '🤝 Sales / Retail' }, tag: '🤝 Obchodník / Prodej' },
      { id: 'marketing', label: { cs: '🎯 Markéťák', en: '🎯 Marketer' }, tag: '🎯 Markéťák' },
      { id: 'pr', label: { cs: '📢 PR / Komunikace', en: '📢 PR / Communications' }, tag: '📢 PR / Komunikace' },
      
      { id: 'doctor', label: { cs: '👩‍⚕️ Lékař / Doktor', en: '👩‍⚕️ Doctor' }, tag: '👩‍⚕️ Lékař' },
      { id: 'nurse', label: { cs: '🏥 Zdravotní sestra / Bratr', en: '🏥 Nurse' }, tag: '🏥 Zdravotní sestra' },
      { id: 'dentist', label: { cs: '🦷 Zubař', en: '🦷 Dentist' }, tag: '🦷 Zubař' },
      { id: 'psychologist', label: { cs: '🧠 Psycholog / Terapeut', en: '🧠 Psychologist / Therapist' }, tag: '🧠 Psycholog / Terapeut' },
      { id: 'pharmacist', label: { cs: '💊 Lékárník', en: '💊 Pharmacist' }, tag: '💊 Lékárník' },
      { id: 'physio', label: { cs: '💆 Fyzioterapeut', en: '💆 Physiotherapist' }, tag: '💆 Fyzioterapeut' },
      { id: 'paramedic', label: { cs: '🚑 Záchranář', en: '🚑 Paramedic' }, tag: '🚑 Záchranář' },
      { id: 'caregiver', label: { cs: '🤲 Pečovatel/ka', en: '🤲 Caregiver' }, tag: '🤲 Pečovatel/ka' },
      { id: 'vet', label: { cs: '🐕 Veterinář', en: '🐕 Veterinarian' }, tag: '🐕 Veterinář' },
      
      { id: 'teacher', label: { cs: '👨‍🏫 Učitel / Profesor', en: '👨‍🏫 Teacher / Professor' }, tag: '👨‍🏫 Učitel / Profesor' },
      { id: 'tutor', label: { cs: '📖 Lektor / Trenér', en: '📖 Tutor / Coach' }, tag: '📖 Lektor / Trenér' },
      { id: 'social_pedagogue', label: { cs: '🤝 Sociální pedagog', en: '🤝 Social Educator' }, tag: '🤝 Sociální pedagog' },
      { id: 'special_pedagogue', label: { cs: '🧑‍🦽 Speciální pedagog', en: '🧑‍🦽 Special Educator' }, tag: '🧑‍🦽 Speciální pedagog' },
      { id: 'scientist', label: { cs: '🔬 Vědec / Výzkumník', en: '🔬 Scientist / Researcher' }, tag: '🔬 Vědec / Výzkumník' },
      
      { id: 'chef', label: { cs: '🍔 Kuchař / Gastro', en: '🍔 Chef / Gastro' }, tag: '🍔 Kuchař' },
      { id: 'waiter', label: { cs: '🍽️ Číšník / Servírka', en: '🍽️ Waiter / Waitress' }, tag: '🍽️ Číšník / Servírka' },
      { id: 'barman', label: { cs: '🍸 Barman / Barista', en: '🍸 Bartender / Barista' }, tag: '🍸 Barman / Barista' },
      { id: 'baker', label: { cs: '🥐 Pekař / Cukrář', en: '🥐 Baker / Confectioner' }, tag: '🥐 Pekař / Cukrář' },
      { id: 'butcher', label: { cs: '🥩 Řezník', en: '🥩 Butcher' }, tag: '🥩 Řezník' },
      
      { id: 'receptionist', label: { cs: '🛎️ Recepční', en: '🛎️ Receptionist' }, tag: '🛎️ Recepční' },
      { id: 'guide', label: { cs: '🗺️ Průvodce', en: '🗺️ Guide' }, tag: '🗺️ Průvodce' },
      { id: 'shop_assistant', label: { cs: '🛒 Prodavač/ka', en: '🛒 Shop Assistant' }, tag: '🛒 Prodavač/ka' },
      { id: 'barber', label: { cs: '✂️ Barber / Kadeřník', en: '✂️ Barber / Hairdresser' }, tag: '✂️ Barber / Kadeřník' },
      { id: 'beauty', label: { cs: '💅 Kosmetička / Nehtařka', en: '💅 Beautician' }, tag: '💅 Kosmetička' },
      { id: 'masseur', label: { cs: '💆 Masér/ka', en: '💆 Masseur' }, tag: '💆 Masér/ka' },
      { id: 'fitness_coach', label: { cs: '💪 Fitness trenér', en: '💪 Fitness Coach' }, tag: '💪 Fitness trenér' },
      
      { id: 'factory_worker', label: { cs: '🏭 Dělník / Operátor', en: '🏭 Factory Worker / Operator' }, tag: '🏭 Dělník / Operátor' },
      { id: 'manufacturer', label: { cs: '🏭 Výrobce / Manufaktura', en: '🏭 Manufacturer' }, tag: '🏭 Výrobce' },
      { id: 'mason', label: { cs: '🧱 Zedník', en: '🧱 Mason' }, tag: '🧱 Zedník' },
      { id: 'carpenter', label: { cs: '🪚 Tesař / Truhlář', en: '🪚 Carpenter' }, tag: '🪚 Tesař / Truhlář' },
      { id: 'plumber', label: { cs: '🚰 Instalatér', en: '🚰 Plumber' }, tag: '🚰 Instalatér' },
      { id: 'electrician', label: { cs: '⚡ Elektrikář', en: '⚡ Electrician' }, tag: '⚡ Elektrikář' },
      { id: 'painter', label: { cs: '🖌️ Malíř pokojů', en: '🖌️ Painter' }, tag: '🖌️ Malíř' },
      { id: 'welder', label: { cs: '🔥 Svářeč', en: '🔥 Welder' }, tag: '🔥 Svářeč' },
      { id: 'mechanic', label: { cs: '🔧 Automechanik', en: '🔧 Mechanic' }, tag: '🔧 Automechanik' },
      { id: 'warehouse', label: { cs: '📦 Skladník', en: '📦 Warehouse Worker' }, tag: '📦 Skladník' },
      { id: 'engineer', label: { cs: '⚙️ Technik / Inženýr', en: '⚙️ Engineer / Technician' }, tag: '⚙️ Technik / Inženýr' },
      { id: 'architect', label: { cs: '📐 Architekt / Projektant', en: '📐 Architect / Planner' }, tag: '📐 Architekt' },
      
      { id: 'driver', label: { cs: '🚚 Řidič (Kamion/Bus/Taxi)', en: '🚚 Driver' }, tag: '🚚 Řidič' },
      { id: 'courier', label: { cs: '🛵 Kurýr / Doručovatel', en: '🛵 Courier / Delivery' }, tag: '🛵 Kurýr' },
      { id: 'logistics', label: { cs: '📦 Logistik / Dispečer', en: '📦 Logistics / Dispatcher' }, tag: '📦 Logistik / Dispečer' },
      { id: 'aviation', label: { cs: '✈️ Pilot / Letuška', en: '✈️ Pilot / Flight Attendant' }, tag: '✈️ Pilot / Letuška' },
      { id: 'train_driver', label: { cs: '🚆 Strojvedoucí', en: '🚆 Train Driver' }, tag: '🚆 Strojvedoucí' },
      
      { id: 'police', label: { cs: '👮‍♂️ Policista', en: '👮‍♂️ Police Officer' }, tag: '👮‍♂️ Policista' },
      { id: 'soldier', label: { cs: '🪖 Voják', en: '🪖 Soldier' }, tag: '🪖 Voják' },
      { id: 'firefighter', label: { cs: '🚒 Hasič', en: '🚒 Firefighter' }, tag: '🚒 Hasič' },
      { id: 'security', label: { cs: '🛡️ Strážný / Security', en: '🛡️ Security Guard' }, tag: '🛡️ Strážný / Security' },
      { id: 'civil_servant', label: { cs: '🏛️ Úředník / Státní správa', en: '🏛️ Civil Servant' }, tag: '🏛️ Úředník' },
      { id: 'politician', label: { cs: '👔 Politik / Diplomat', en: '👔 Politician / Diplomat' }, tag: '👔 Politik / Diplomat' },
      { id: 'law_enforcement', label: { cs: '🕵️ Vyšetřovatel / Kriminalista', en: '🕵️ Investigator' }, tag: '🕵️ Kriminalista' },
      
      { id: 'actor', label: { cs: '🎬 Herec', en: '🎬 Actor' }, tag: '🎬 Herec' },
      { id: 'musician', label: { cs: '🎵 Hudebník / Zpěvák', en: '🎵 Musician / Singer' }, tag: '🎵 Hudebník / Zpěvák' },
      { id: 'artist', label: { cs: '🎨 Malíř / Sochař', en: '🎨 Artist / Sculptor' }, tag: '🎨 Malíř / Sochař' },
      { id: 'photographer', label: { cs: '📸 Fotograf / Kameraman', en: '📸 Photographer / Cameraman' }, tag: '📸 Fotograf' },
      { id: 'journalist', label: { cs: '📰 Novinář / Redaktor', en: '📰 Journalist / Editor' }, tag: '📰 Novinář / Redaktor' },
      { id: 'writer', label: { cs: '✍️ Spisovatel / Copywriter', en: '✍️ Writer / Copywriter' }, tag: '✍️ Spisovatel / Copywriter' },
      { id: 'influencer', label: { cs: '📱 Influencer / Youtuber', en: '📱 Influencer / Youtuber' }, tag: '📱 Influencer / Youtuber' },
      { id: 'presenter', label: { cs: '🎙️ Moderátor', en: '🎙️ Presenter' }, tag: '🎙️ Moderátor' },
      
      { id: 'farmer', label: { cs: '🚜 Zemědělec / Farmář', en: '🚜 Farmer / Agriculture' }, tag: '🚜 Zemědělec / Farmář' },
      { id: 'forester', label: { cs: '🌲 Lesník / Myslivec', en: '🌲 Forester / Hunter' }, tag: '🌲 Lesník / Myslivec' },
      { id: 'gardener', label: { cs: '🌻 Zahradník / Florista', en: '🌻 Gardener / Florist' }, tag: '🌻 Zahradník / Florista' },
      { id: 'ecologist', label: { cs: '🌍 Ekolog', en: '🌍 Ecologist' }, tag: '🌍 Ekolog' },
      
      { id: 'real_estate', label: { cs: '🏠 Realitní makléř', en: '🏠 Real Estate Agent' }, tag: '🏠 Realitní makléř' },
      { id: 'insurance', label: { cs: '🛡️ Pojišťovací poradce', en: '🛡️ Insurance Agent' }, tag: '🛡️ Pojišťovák' },
      { id: 'trader_crypto', label: { cs: '📈 Trader / Krypto nadšenec', en: '📈 Trader / Crypto' }, tag: '📈 Trader / Krypto' },
      { id: 'reseller', label: { cs: '🔄 Překupník / Reseller / Flipping', en: '🔄 Reseller / Flipping' }, tag: '🔄 Překupník / Reseller' },
      { id: 'ecommerce', label: { cs: '🛒 E-shop / E-commerce', en: '🛒 E-shop / E-commerce' }, tag: '🛒 E-commerce' },
      
      { id: 'custom_pro_sports', label: { cs: '🏅 Profesionální sportovec', en: '🏅 Professional Athlete' }, tag: '🏅 Profi sportovec' },
      { id: 'custom_vip', label: { cs: '🌟 Celebrita / VIP', en: '🌟 Celebrity / VIP' }, tag: '🌟 Celebrita' },
      { id: 'custom_public_figure', label: { cs: '🎤 Veřejně známá osobnost', en: '🎤 Public Figure' }, tag: '🎤 Veřejně známá osobnost' },
      { id: 'custom_model', label: { cs: '📸 Model / Modelka', en: '📸 Model' }, tag: '📸 Model/ka' },
      { id: 'custom_esports', label: { cs: '🎮 E-sports hráč / Streamer', en: '🎮 E-sports / Streamer' }, tag: '🎮 E-sports' },
      { id: 'custom_translator', label: { cs: '🌍 Překladatel / Tlumočník', en: '🌍 Translator / Interpreter' }, tag: '🌍 Překladatel' },
      { id: 'custom_librarian', label: { cs: '📚 Knihovník/ce', en: '📚 Librarian' }, tag: '📚 Knihovník' },
      { id: 'custom_judge', label: { cs: '⚖️ Soudce / Notář / Exekutor', en: '⚖️ Judge / Notary' }, tag: '⚖️ Soudce / Notář' },
      { id: 'custom_customs', label: { cs: '🛂 Celník / Vězeňský dozorce', en: '🛂 Customs / Prison Guard' }, tag: '🛂 Celník / Dozorce' },
      { id: 'custom_sailor', label: { cs: '⚓ Námořník / Kapitán', en: '⚓ Sailor / Captain' }, tag: '⚓ Námořník' },
      { id: 'custom_tailor', label: { cs: '🧵 Krejčí / Švadlena', en: '🧵 Tailor / Seamstress' }, tag: '🧵 Krejčí' },
      { id: 'custom_cleaner', label: { cs: '🧹 Uklízeč/ka / Hospodyně', en: '🧹 Cleaner / Housekeeper' }, tag: '🧹 Úklid' },
      { id: 'custom_cashier', label: { cs: '💵 Pokladní / Doplňovač', en: '💵 Cashier / Restocker' }, tag: '💵 Pokladní' },
      { id: 'custom_florist', label: { cs: '💐 Květinář/ka', en: '💐 Florist' }, tag: '💐 Květinář' },
      { id: 'custom_devops', label: { cs: '☁️ DevOps / SysAdmin', en: '☁️ DevOps / SysAdmin' }, tag: '☁️ DevOps' },
      { id: 'custom_ai', label: { cs: '🤖 AI / Machine Learning', en: '🤖 AI Specialist' }, tag: '🤖 AI Specialist' },
      { id: 'custom_product_mgr', label: { cs: '🎯 Product / Scrum Master', en: '🎯 Product / Scrum' }, tag: '🎯 Product Mgr' },
      { id: 'custom_makeup', label: { cs: '💄 Vizážista / Makeup Artist', en: '💄 Makeup Artist' }, tag: '💄 Vizážista' },
      { id: 'custom_dj', label: { cs: '🎧 DJ / Hudební producent', en: '🎧 DJ / Producer' }, tag: '🎧 DJ' },
      { id: 'custom_dancer', label: { cs: '💃 Tanečník / Choreograf', en: '💃 Dancer / Choreographer' }, tag: '💃 Tanečník' },
      { id: 'custom_optician', label: { cs: '👓 Optik / Optometrista', en: '👓 Optician' }, tag: '👓 Optik' },
      { id: 'custom_midwife', label: { cs: '👶 Porodní asistentka / Dula', en: '👶 Midwife / Doula' }, tag: '👶 Porodní asistentka' },
      { id: 'custom_builder', label: { cs: '🏗️ Stavař / Stavební dělník', en: '🏗️ Builder / Construction' }, tag: '🏗️ Stavař' },
      { id: 'custom_roofer', label: { cs: '🏘️ Pokrývač / Klempíř', en: '🏘️ Roofer / Tinsmith' }, tag: '🏘️ Pokrývač' },
      
      { id: 'mega_nutrition', label: { cs: '🍏 Nutriční specialista', en: '🍏 Nutritionist' }, tag: '🍏 Nutriční poradce' },
      { id: 'mega_chiropractor', label: { cs: '🦴 Chiropraktik', en: '🦴 Chiropractor' }, tag: '🦴 Chiropraktik' },
      { id: 'mega_blacksmith', label: { cs: '🔨 Kovář', en: '🔨 Blacksmith' }, tag: '🔨 Kovář' },
      { id: 'mega_glass', label: { cs: '🪟 Sklenář', en: '🪟 Glazier' }, tag: '🪟 Sklenář' },
      { id: 'mega_jeweler', label: { cs: '💎 Šperkař / Zlatník', en: '💎 Jeweler / Goldsmith' }, tag: '💎 Šperkař / Zlatník' },
      { id: 'mega_watchmaker', label: { cs: '⌚ Hodinář', en: '⌚ Watchmaker' }, tag: '⌚ Hodinář' },
      { id: 'mega_upholsterer', label: { cs: '🛋️ Čalouník', en: '🛋️ Upholsterer' }, tag: '🛋️ Čalouník' },
      { id: 'mega_animator', label: { cs: '🎬 Animátor / 3D Grafik', en: '🎬 Animator / 3D Artist' }, tag: '🎬 Animátor / 3D' },
      { id: 'mega_videoeditor', label: { cs: '🎞️ Střihač / Video Editor', en: '🎞️ Video Editor' }, tag: '🎞️ Střihač' },
      { id: 'mega_sound', label: { cs: '🎙️ Zvukař', en: '🎙️ Sound Engineer' }, tag: '🎙️ Zvukař' },
      { id: 'mega_seo', label: { cs: '🔍 SEO Specialista', en: '🔍 SEO Specialist' }, tag: '🔍 SEO' },
      { id: 'mega_director', label: { cs: '🎥 Režisér / Scenárista', en: '🎥 Director / Screenwriter' }, tag: '🎥 Režisér / Scenárista' },
      { id: 'mega_stunt', label: { cs: '🦸‍♂️ Kaskadér', en: '🦸‍♂️ Stuntman' }, tag: '🦸‍♂️ Kaskadér' },
      { id: 'mega_curator', label: { cs: '🏛️ Kurátor / Galerista', en: '🏛️ Curator' }, tag: '🏛️ Kurátor' },
      { id: 'mega_voiceover', label: { cs: '🗣️ Dabér', en: '🗣️ Voice Actor' }, tag: '🗣️ Dabér' },
      { id: 'mega_standup', label: { cs: '🤡 Komik / Stand-up', en: '🤡 Comedian' }, tag: '🤡 Komik' },
      { id: 'mega_magician', label: { cs: '🎩 Iluzionista / Kouzelník', en: '🎩 Magician' }, tag: '🎩 Iluzionista' },
      { id: 'mega_astrology', label: { cs: '🔮 Astrolog / Kartář/ka', en: '🔮 Astrologer / Tarot' }, tag: '🔮 Ezo / Astrolog' },
      { id: 'mega_priest', label: { cs: '⛪ Kněz / Duchovní', en: '⛪ Priest / Clergy' }, tag: '⛪ Kněz / Duchovní' },
      { id: 'mega_archaeologist', label: { cs: '🏺 Archeolog', en: '🏺 Archaeologist' }, tag: '🏺 Archeolog' },
      { id: 'mega_astronomer', label: { cs: '🔭 Astronom', en: '🔭 Astronomer' }, tag: '🔭 Astronom' },
      { id: 'mega_biologist', label: { cs: '🧬 Biolog', en: '🧬 Biologist' }, tag: '🧬 Biolog' },
      { id: 'mega_geologist', label: { cs: '🪨 Geolog', en: '🪨 Geologist' }, tag: '🪨 Geolog' },
      { id: 'mega_meteorologist', label: { cs: '🌤️ Meteorolog', en: '🌤️ Meteorologist' }, tag: '🌤️ Meteorolog' },
      { id: 'mega_historian', label: { cs: '📜 Historik', en: '📜 Historian' }, tag: '📜 Historik' },
      { id: 'mega_mayor', label: { cs: '🏛️ Starosta', en: '🏛️ Mayor' }, tag: '🏛️ Starosta' },
      { id: 'mega_diplomat', label: { cs: '🤝 Diplomat', en: '🤝 Diplomat' }, tag: '🤝 Diplomat' },
      { id: 'mega_detective', label: { cs: '🕵️ Soukromý detektiv', en: '🕵️ Private Detective' }, tag: '🕵️ Detektiv' },
      { id: 'mega_drone', label: { cs: '🚁 Pilot dronu', en: '🚁 Drone Pilot' }, tag: '🚁 Pilot dronu' },
      { id: 'mega_testdriver', label: { cs: '🏎️ Zkušební jezdec', en: '🏎️ Test Driver' }, tag: '🏎️ Zkušební jezdec' },
      { id: 'mega_garbageman', label: { cs: '🗑️ Popelář / Technické služby', en: '🗑️ Garbage Collector' }, tag: '🗑️ Popelář' },
      { id: 'mega_gravedigger', label: { cs: '🪦 Hrobník', en: '🪦 Gravedigger' }, tag: '🪦 Hrobník' },
      { id: 'mega_sommelier', label: { cs: '🍷 Sommelier', en: '🍷 Sommelier' }, tag: '🍷 Sommelier' },
      { id: 'mega_brewer', label: { cs: '🍺 Pivovarník / Sládek', en: '🍺 Brewer' }, tag: '🍺 Sládek' },
      { id: 'mega_winemaker', label: { cs: '🍇 Vinař', en: '🍇 Winemaker' }, tag: '🍇 Vinař' },
      { id: 'mega_flight_disp', label: { cs: '🛫 Letový dispečer', en: '🛫 Air Traffic Controller' }, tag: '🛫 Letový dispečer' },
      { id: 'mega_shoemaker', label: { cs: '👞 Švec / Obuvník', en: '👞 Shoemaker' }, tag: '👞 Švec' },
      { id: 'mega_zookeeper', label: { cs: '🦒 Ošetřovatel v ZOO', en: '🦒 Zookeeper' }, tag: '🦒 Ošetřovatel v ZOO' },
      { id: 'mega_croupier', label: { cs: '🎰 Krupiér v kasinu', en: '🎰 Casino Dealer' }, tag: '🎰 Krupiér' },
      { id: 'mega_surgeon', label: { cs: '⚕️ Chirurg', en: '⚕️ Surgeon' }, tag: '⚕️ Chirurg' },
      { id: 'mega_pediatrician', label: { cs: '👶 Pediatr', en: '👶 Pediatrician' }, tag: '👶 Pediatr' },
      { id: 'mega_psychiatrist', label: { cs: '🧠 Psychiatr', en: '🧠 Psychiatrist' }, tag: '🧠 Psychiatr' },
      { id: 'mega_eye_doctor', label: { cs: '👁️ Oční lékař', en: '👁️ Ophthalmologist' }, tag: '👁️ Oční lékař' },
      
      { id: 'mega_cafe_owner', label: { cs: '☕ Majitel kavárny / Kavárník', en: '☕ Cafe Owner' }, tag: '☕ Majitel kavárny' },
      { id: 'mega_food_critic', label: { cs: '🍲 Food Kritik / Foodblogger', en: '🍲 Food Critic' }, tag: '🍲 Food Kritik' },
      { id: 'mega_restaurant_owner', label: { cs: '🍽️ Restauratér', en: '🍽️ Restaurateur' }, tag: '🍽️ Restauratér' },
      { id: 'mega_sous_chef', label: { cs: '🔪 Sous-chef', en: '🔪 Sous-chef' }, tag: '🔪 Sous-chef' },
      
      { id: 'mega_prosecutor', label: { cs: '⚖️ Státní zástupce', en: '⚖️ Prosecutor' }, tag: '⚖️ Státní zástupce' },
      { id: 'mega_paralegal', label: { cs: '📝 Advokátní koncipient', en: '📝 Paralegal / Trainee' }, tag: '📝 Advokátní koncipient' },
      
      { id: 'mega_lathe', label: { cs: '⚙️ Soustružník / Frézař', en: '⚙️ Turner / Miller' }, tag: '⚙️ Soustružník / Frézař' },
      { id: 'mega_metallurgist', label: { cs: '🔥 Hutník', en: '🔥 Metallurgist' }, tag: '🔥 Hutník' },
      { id: 'mega_surveyor', label: { cs: '📐 Geodet / Zeměměřič', en: '📐 Surveyor' }, tag: '📐 Geodet' },
      { id: 'mega_urbanist', label: { cs: '🏙️ Urbanista', en: '🏙️ Urban Planner' }, tag: '🏙️ Urbanista' },
      { id: 'mega_heli_pilot', label: { cs: '🚁 Pilot vrtulníku', en: '🚁 Helicopter Pilot' }, tag: '🚁 Pilot vrtulníku' },
      
      { id: 'mega_tattoo', label: { cs: '🖋️ Tatér / Piercer', en: '🖋️ Tattoo Artist / Piercer' }, tag: '🖋️ Tatér' },
      
      { id: 'networking', label: { cs: '💼 Networking / Workoholik', en: '💼 Networking / Workaholic' }, tag: '💼 Networking' }
    ]
  },
  {
    id: 'services_gigs',
    icon: Wrench,
    title: { cs: 'Služby, Brigády a Výpomoc', en: 'Services, Gigs & Help' },
    description: { cs: 'Hlídání dětí, úklid, hodinoví manželé a brigády.', en: 'Babysitting, cleaning, handymen and gigs.' },
    color: 'border-teal-500 text-teal-500 bg-teal-500/10',
    subOptions: [
      { id: 'part_time', label: { cs: '💰 Brigády a Přivýdělek', en: '💰 Part-time & Gigs' }, tag: '💰 Brigáda' },
      { id: 'camps', label: { cs: '🏕️ Tábory a Vedoucí', en: '🏕️ Camps & Counselors' }, tag: '🏕️ Tábory' },
      { id: 'babysitting', label: { cs: '👶 Hlídání dětí', en: '👶 Babysitting' }, tag: '👶 Hlídání dětí' },
      { id: 'petsitting', label: { cs: '🐕 Hlídání mazlíčků', en: '🐕 Pet sitting' }, tag: '🐕 Hlídání mazlíčků' },
      { id: 'handyman', label: { cs: '🛠️ Hodinový manžel', en: '🛠️ Handyman' }, tag: '🛠️ Hodinový manžel' },
      { id: 'handywoman', label: { cs: '🧹 Hodinová manželka / Úklid', en: '🧹 Handywoman / Cleaning' }, tag: '🧹 Hodinová manželka' },
      { id: 'tutoring', label: { cs: '📚 Doučování', en: '📚 Tutoring' }, tag: '📚 Doučování' },
      { id: 'moving', label: { cs: '📦 Stěhování a Přeprava', en: '📦 Moving & Transport' }, tag: '📦 Stěhování' },
      { id: 'gardening', label: { cs: '🌱 Zahrada a Údržba', en: '🌱 Gardening & Maintenance' }, tag: '🌱 Zahrada a Údržba' },
      { id: 'events_staff', label: { cs: '🎉 Výpomoc na akcích', en: '🎉 Event Staff' }, tag: '🎉 Výpomoc na akcích' }
    ]
  },
  {
    id: 'history',
    icon: Crown,
    title: { cs: 'Historie a Paměti', en: 'History & Memories' },
    description: { cs: 'Heraldika, genealogie a vášeň pro dějiny.', en: 'Heraldry, genealogy, and passion for history.' },
    color: 'border-purple-500 text-purple-500 bg-purple-500/10',
    subOptions: [
      { id: 'heraldry', label: { cs: '🛡️ Heraldika', en: '🛡️ Heraldry' }, tag: '🛡️ Heraldika' },
      { id: 'genealogy', label: { cs: '📜 Genealogie', en: '📜 Genealogy' }, tag: '📜 Genealogie' },
      { id: 'history_buff', label: { cs: '🏰 Nadšenec do historie', en: '🏰 History buff' }, tag: '🏰 Historie' },
      { id: 'archaeology', label: { cs: '🏺 Archeologie', en: '🏺 Archaeology' }, tag: '🏺 Archeologie' },
      { id: 'reenactment', label: { cs: '⚔️ Šerm a reenactment', en: '⚔️ Reenactment' }, tag: '⚔️ Šerm' }
    ]
  },
  {
    id: 'pets',
    icon: PawPrint,
    title: { cs: 'Domácí mazlíčci', en: 'Pets' },
    description: { cs: 'Psi, kočky a exotika.', en: 'Dogs, cats and exotic animals.' },
    color: 'border-green-500 text-green-500 bg-green-500/10',
    subOptions: [
      { id: 'pet_breed', label: { cs: '❤️ Krytí / Páření', en: '❤️ Breeding' }, tag: '❤️ Krytí / Páření' },
      { id: 'pet_play', label: { cs: '🎾 Společné venčení', en: '🎾 Playdate / Walking' }, tag: '🎾 Společné venčení' },
      { id: 'dog', label: { cs: '🐕 Pejskař', en: '🐕 Dog person' }, tag: '🐕 Pejskař' },
      { id: 'cat', label: { cs: '🐈 Kočičí člověk', en: '🐈 Cat person' }, tag: '🐈 Kočičí člověk' },
      { id: 'exotic', label: { cs: '🦎 Exotika', en: '🦎 Exotic' }, tag: '🦎 Exotika' },
      { id: 'horse', label: { cs: '🐎 Koňák', en: '🐎 Horse lover' }, tag: '🐎 Koňák' },
      { id: 'bird', label: { cs: '🦜 Ptactvo', en: '🦜 Bird lover' }, tag: '🦜 Ptactvo' }
    ]
  },
  {
    id: 'hobbies',
    icon: Gamepad2,
    title: { cs: 'Koníčky a Zájmy', en: 'Hobbies & Interests' },
    description: { cs: 'Hráči, sportovci a milovníci umění.', en: 'Gamers, athletes and art lovers.' },
    color: 'border-purple-500 text-purple-500 bg-purple-500/10',
    subOptions: [
      { id: 'gamer', label: { cs: '🎮 Gamer', en: '🎮 Gamer' }, tag: '🎮 Gamer' },
      { id: 'fitness', label: { cs: '💪 Fitness závislák', en: '💪 Fitness addict' }, tag: '💪 Fitness závislák' },
      { id: 'cars', label: { cs: '🚗 Autíčkář', en: '🚗 Car lover' }, tag: '🚗 Autíčkář' },
      { id: 'art', label: { cs: '🎨 Umělec', en: '🎨 Artist' }, tag: '🎨 Umělec' },
      { id: 'music', label: { cs: '🎸 Muzikant', en: '🎸 Musician' }, tag: '🎸 Muzikant' },
      { id: 'movies', label: { cs: '🎬 Filmový maniak', en: '🎬 Movie maniac' }, tag: '🎬 Filmový maniak' },
      { id: 'foodie', label: { cs: '🍔 Fastfood lover', en: '🍔 Fastfood lover' }, tag: '🍔 Fastfood lover' },
      { id: 'vegan', label: { cs: '🌱 Vegan/Vege', en: '🌱 Vegan/Vege' }, tag: '🌱 Vegan/Vege' },
      { id: 'wine', label: { cs: '🍷 Vínař', en: '🍷 Wine lover' }, tag: '🍷 Vínař' }
    ]
  },
  {
    id: 'gaming',
    icon: Gamepad2,
    title: { cs: 'Herní Doupě', en: 'Gaming Lair' },
    description: { cs: 'Hráči PC, konzolí a deskovek.', en: 'PC, console and board gamers.' },
    color: 'border-indigo-500 text-indigo-500 bg-indigo-500/10',
    subOptions: [
      { id: 'pc_master', label: { cs: '💻 PC Master Race', en: '💻 PC Master Race' }, tag: '💻 PC Hráč' },
      { id: 'playstation', label: { cs: '🎮 PlayStation fanda', en: '🎮 PlayStation fan' }, tag: '🎮 PlayStation' },
      { id: 'xbox', label: { cs: '❌ Xbox srdcař', en: '❌ Xbox lover' }, tag: '❌ Xbox' },
      { id: 'nintendo', label: { cs: '🍄 Nintendo & Switch', en: '🍄 Nintendo & Switch' }, tag: '🍄 Nintendo' },
      { id: 'rpg', label: { cs: '🐉 RPG & Fantasy', en: '🐉 RPG & Fantasy' }, tag: '🐉 RPG Hráč' },
      { id: 'fps', label: { cs: '🔫 Střílečky (FPS)', en: '🔫 Shooters (FPS)' }, tag: '🔫 Střílečky' },
      { id: 'mmo', label: { cs: '🌍 MMO & Kooperace', en: '🌍 MMO & Co-op' }, tag: '🌍 MMO Hráč' },
      { id: 'boardgames', label: { cs: '🎲 Deskovky a D&D', en: '🎲 Boardgames & D&D' }, tag: '🎲 Deskovky' },
      { id: 'sim', label: { cs: '🏎️ Závody & Simulátory', en: '🏎️ Racing & Sims' }, tag: '🏎️ Simulátory' },
      { id: 'retro', label: { cs: '🕹️ Retro & Arkády', en: '🕹️ Retro & Arcades' }, tag: '🕹️ Retro Hráč' }
    ]
  },
  {
    id: 'travel',
    icon: Plane,
    title: { cs: 'Cestování a Výlety', en: 'Travel & Trips' },
    description: { cs: 'Letušky, průzkumníci a dobrodruzi na horách i pláži.', en: 'Flight attendants, explorers and adventurers on mountains and beaches.' },
    color: 'border-cyan-500 text-cyan-500 bg-cyan-500/10',
    subOptions: [
      { id: 'traveler', label: { cs: '🌍 Cestovatel', en: '🌍 Traveler' }, tag: '🌍 Cestovatel' },
      { id: 'flight', label: { cs: '✈️ Letuška / Pilot', en: '✈️ Flight Attendant / Pilot' }, tag: '✈️ Letuška / Pilot' },
      { id: 'woods', label: { cs: '🏕️ Zálesák', en: '🏕️ Woodsman' }, tag: '🏕️ Zálesák' },
      { id: 'mountains', label: { cs: '🏔️ Horolezec', en: '🏔️ Mountaineer' }, tag: '🏔️ Horolezec' },
      { id: 'beach', label: { cs: '🏖️ Plážový typ', en: '🏖️ Beach bum' }, tag: '🏖️ Plážový typ' },
      { id: 'trip', label: { cs: '🧗‍♀️ Výletník', en: '🧗‍♀️ Tripper' }, tag: '🧗‍♀️ Výletník' },
      { id: 'explorer', label: { cs: '🗺️ Průzkumník', en: '🗺️ Explorer' }, tag: '🗺️ Průzkumník' },
      { id: 'roadtrip', label: { cs: '🚗 Roadtripper', en: '🚗 Roadtripper' }, tag: '🚗 Roadtripper' },
      { id: 'backpack', label: { cs: '🎒 Batůžkář', en: '🎒 Backpacker' }, tag: '🎒 Batůžkář' }
    ]
  },
  {
    id: 'religion',
    icon: Sparkles,
    title: { cs: 'Víra a Náboženství', en: 'Beliefs & Religion' },
    description: { cs: 'Hledám někoho se stejným vyznáním nebo hodnotami.', en: 'Looking for someone with the same beliefs or values.' },
    color: 'border-fuchsia-500 text-fuchsia-500 bg-fuchsia-500/10',
    subOptions: [
      { id: 'christian', label: { cs: '✝️ Křesťan / Katolík', en: '✝️ Christian / Catholic' }, tag: '✝️ Křesťan' },
      { id: 'muslim', label: { cs: '☪️ Islám / Muslim', en: '☪️ Islam / Muslim' }, tag: '☪️ Muslim' },
      { id: 'buddhist', label: { cs: '☸️ Buddhismus', en: '☸️ Buddhism' }, tag: '☸️ Buddhismus' },
      { id: 'atheist', label: { cs: '🚫 Ateista / Bez vyznání', en: '🚫 Atheist / No religion' }, tag: '🚫 Ateista' },
      { id: 'agnostic', label: { cs: '❓ Agnostik', en: '❓ Agnostic' }, tag: '❓ Agnostik' },
      { id: 'spiritual', label: { cs: '🔮 Spiritualita / Esoterika', en: '🔮 Spirituality' }, tag: '🔮 Spiritualita' },
      { id: 'jewish', label: { cs: '✡️ Judaismus', en: '✡️ Judaism' }, tag: '✡️ Judaismus' },
      { id: 'hindu', label: { cs: '🕉️ Hinduismus', en: '🕉️ Hinduism' }, tag: '🕉️ Hinduismus' }
    ]
  },
  {
    id: 'appearance',
    icon: Eye,
    title: { cs: 'Etnikum a Vzhled', en: 'Ethnicity & Appearance' },
    description: { cs: 'Různé typy postavy, etnika a styly.', en: 'Various body types, ethnicities and styles.' },
    color: 'border-amber-500 text-amber-500 bg-amber-500/10',
    subOptions: [
      { id: 'caucasian', label: { cs: '👱🏻‍♂️ Kavkazský typ / Běloch', en: '👱🏻‍♂️ Caucasian / White' }, tag: '👱🏻‍♂️ Běloch' },
      { id: 'black', label: { cs: '🏾 Tmavší pleti / Černoch', en: '🏾 Darker skin / Black' }, tag: '🏾 Tmavší pleti' },
      { id: 'asian', label: { cs: '⛩️ Asiat / Orient', en: '⛩️ Asian / Oriental' }, tag: '⛩️ Asiat' },
      { id: 'latino', label: { cs: '💃🏽 Latino / Hispánec', en: '💃🏽 Latino / Hispanic' }, tag: '💃🏽 Latino' },
      { id: 'mixed', label: { cs: '🌍 Míšenec / Multikulturní', en: '🌍 Mixed / Multicultural' }, tag: '🌍 Míšenec' },
      { id: 'ginger', label: { cs: '🦊 Zrzek / Zrzka', en: '🦊 Ginger / Redhead' }, tag: '🦊 Zrzek' },
      { id: 'inked', label: { cs: '🖋️ Potetovaný / Alternativní', en: '🖋️ Inked / Alternative' }, tag: '🖋️ Potetovaný' },
      { id: 'curvy', label: { cs: '🍑 Curvy / Krev a mlíko', en: '🍑 Curvy / Plus size' }, tag: '🍑 Curvy' },
      { id: 'tall', label: { cs: '🦒 Vysoká postava', en: '🦒 Tall' }, tag: '🦒 Vysoká postava' }
    ]
  },
  {
    id: 'culture',
    icon: Music,
    title: { cs: 'Kultura a Společnost', en: 'Culture & Society' },
    description: { cs: 'Hudba, festivaly, umění a akce.', en: 'Music, festivals, art and events.' },
    color: 'border-pink-500 text-pink-500 bg-pink-500/10',
    subOptions: [
      { id: 'festival', label: { cs: '🎪 Festivalový nadšenec', en: '🎪 Festival lover' }, tag: '🎪 Festivaly' },
      { id: 'techno', label: { cs: '🎧 Klubová scéna / Techno', en: '🎧 Club scene / Techno' }, tag: '🎧 Techno/Klub' },
      { id: 'rap', label: { cs: '🎤 Rap & Hip-Hop', en: '🎤 Rap & Hip-Hop' }, tag: '🎤 Rap & Hip-Hop' },
      { id: 'metal', label: { cs: '🎸 Metal & Rock', en: '🎸 Metal & Rock' }, tag: '🎸 Metal & Rock' },
      { id: 'classical', label: { cs: '🎻 Klasická hudba / Opera', en: '🎻 Classical / Opera' }, tag: '🎻 Klasika' },
      { id: 'theatre', label: { cs: '🎭 Divadelní fanda', en: '🎭 Theatre fan' }, tag: '🎭 Divadlo' },
      { id: 'books', label: { cs: '📚 Knihomol / Literatura', en: '📚 Bookworm / Lit' }, tag: '📚 Knihomol' },
      { id: 'museum', label: { cs: '🏛️ Muzea a Galerie', en: '🏛️ Museums & Galleries' }, tag: '🏛️ Muzea' },
      { id: 'kpop', label: { cs: '✨ K-Pop & Anime', en: '✨ K-Pop & Anime' }, tag: '✨ K-Pop & Anime' }
    ]
  },
  {
    id: 'services_work',
    icon: Briefcase,
    title: { cs: 'Služby a Práce', en: 'Services & Work' },
    description: { cs: 'Sekání trávy, brigády, řemesla a pomoc.', en: 'Lawn mowing, part-time jobs, crafts and help.' },
    color: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
    subOptions: [
      { id: 'need_worker', label: { cs: '👷‍♂️ Hledám pracanta', en: '👷‍♂️ Need a worker' }, tag: '👷‍♂️ Hledám pracanta' },
      { id: 'need_job', label: { cs: '💼 Hledám brigádu', en: '💼 Looking for a job' }, tag: '💼 Hledám brigádu' },
      { id: 'mowing', label: { cs: '✂️ Sekání trávy', en: '✂️ Lawn mowing' }, tag: '✂️ Sekání trávy' },
      { id: 'babysitting', label: { cs: '👶 Hlídání dětí', en: '👶 Babysitting' }, tag: '👶 Hlídání dětí' },
      { id: 'crafting', label: { cs: '🛠️ Řemeslné práce', en: '🛠️ Crafts' }, tag: '🛠️ Řemeslo' }
    ]
  },
  {
    id: 'activities',
    icon: Calendar,
    title: { cs: 'Mám plán (Aktivity)', en: 'I have a plan' },
    description: { cs: 'Hledám parťáka na konkrétní událost.', en: 'Looking for a buddy for a specific event.' },
    color: 'border-orange-500 text-orange-500 bg-orange-500/10',
    subOptions: [
      { id: 'beer_today', label: { cs: '🍻 Dnes na pivo', en: '🍻 Beer today' }, tag: '🍻 Dnes na pivo' },
      { id: 'mountain_trip', label: { cs: '🏔️ Jdu na hory', en: '🏔️ Mountain trip' }, tag: '🏔️ Jdu na hory' },
      { id: 'cinema', label: { cs: '🎬 Hledám doprovod', en: '🎬 Need a +1' }, tag: '🎬 Doprovod' },
      { id: 'startup', label: { cs: '🚀 Lidi do startupu', en: '🚀 Startup team' }, tag: '🚀 Startup' },
      { id: 'band', label: { cs: '🎸 Zakládám kapelu', en: '🎸 Starting a band' }, tag: '🎸 Zakládám kapelu' }
    ]
  },
  {
    id: 'science',
    icon: Activity,
    title: { cs: 'Věda a Výzkum', en: 'Science & Research' },
    description: { cs: 'Vědci, vynálezci a inovátoři. Spojte mozky!', en: 'Scientists, inventors and innovators. Connect brains!' },
    color: 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
    subOptions: [
      { id: 'scientist', label: { cs: '🔬 Vědec / Výzkumník', en: '🔬 Scientist / Researcher' }, tag: '🔬 Vědec' },
      { id: 'inventor', label: { cs: '💡 Vynálezce', en: '💡 Inventor' }, tag: '💡 Vynálezce' },
      { id: 'tech_innovator', label: { cs: '⚙️ Tech Inovátor', en: '⚙️ Tech Innovator' }, tag: '⚙️ Inovátor' },
      { id: 'academic', label: { cs: '🎓 Akademik / Profesor', en: '🎓 Academic / Professor' }, tag: '🎓 Akademik' },
      { id: 'space', label: { cs: '🚀 Vesmír a Fyzika', en: '🚀 Space & Physics' }, tag: '🚀 Fyzika' }
    ]
  },
  {
    id: 'neighborhood',
    icon: Home,
    title: { cs: 'Sousedé a Rodiny', en: 'Neighbors & Families' },
    description: { cs: 'Propojujeme lidi z jedné čtvrti, maminky i tatínky.', en: 'Connecting people from the same hood, moms and dads.' },
    color: 'border-teal-500 text-teal-500 bg-teal-500/10',
    subOptions: [
      { id: 'neighbors', label: { cs: '👋 Hledám sousedy', en: '👋 Looking for neighbors' }, tag: '👋 Soused' },
      { id: 'moms', label: { cs: '👩‍👧 Maminky s dětmi', en: '👩‍👧 Moms with kids' }, tag: '👩‍👧 Maminky' },
      { id: 'dads', label: { cs: '👨‍👦 Tatínci s dětmi', en: '👨‍👦 Dads with kids' }, tag: '👨‍👦 Tatínci' },
      { id: 'dog_walking', label: { cs: '🐕 Společné venčení v okolí', en: '🐕 Neighborhood dog walking' }, tag: '🐕 Venčení' },
      { id: 'local_help', label: { cs: '🤝 Sousedská výpomoc', en: '🤝 Local help' }, tag: '🤝 Výpomoc' }
    ]
  },
  {
    id: 'objects_plants',
    icon: Leaf,
    title: { cs: 'Věci a Rostliny', en: 'Things & Plants' },
    description: { cs: 'Dej věcem nebo kytkám nový domov.', en: 'Give things or plants a new home.' },
    color: 'border-green-600 text-green-600 bg-green-600/10',
    subOptions: [
      { id: 'adopt_plant', label: { cs: '🪴 Daruji rostlinu', en: '🪴 Plant adoption' }, tag: '🪴 Daruji rostlinu' },
      { id: 'need_plant', label: { cs: '🌱 Chci kytku', en: '🌱 Want a plant' }, tag: '🌱 Chci kytku' },
      { id: 'give_object', label: { cs: '📦 Daruji/Prodám věc', en: '📦 Give/Sell object' }, tag: '📦 Daruji věc' },
      { id: 'need_object', label: { cs: '🔍 Hledám konkrétní věc', en: '🔍 Seeking an object' }, tag: '🔍 Hledám věc' }
    ]
  },
  {
    id: 'real_estate',
    icon: Home,
    title: { cs: 'Nemovitosti a Bydlení', en: 'Real Estate' },
    description: { cs: 'Spolubydlení, podnájem, nebo dům na hlídání.', en: 'Roommates, sublet, or house sitting.' },
    color: 'border-blue-500 text-blue-500 bg-blue-500/10',
    subOptions: [
      { id: 'roommate', label: { cs: '👥 Hledám spolubydlícího', en: '👥 Need roommate' }, tag: '👥 Hledám spolubydlícího' },
      { id: 'rent_room', label: { cs: '🛏️ Pronajmu pokoj', en: '🛏️ Rent a room' }, tag: '🛏️ Pronajmu pokoj' },
      { id: 'house_sitting', label: { cs: '🏡 House sitting', en: '🏡 House sitting' }, tag: '🏡 House sitting' },
      { id: 'find_flat', label: { cs: '🏢 Hledám byt', en: '🏢 Looking for flat' }, tag: '🏢 Hledám byt' }
    ]
  },
  {
    id: 'sports',
    icon: Activity,
    title: { cs: 'Sporty a Pohyb', en: 'Sports & Movement' },
    description: { cs: 'Aktivní životní styl, od gauče až po extrém.', en: 'Active lifestyle, from couch to extreme.' },
    color: 'border-red-500 text-red-500 bg-red-500/10',
    subOptions: [
      { id: 'athletics', label: { cs: '🏃 Atletika a Běh', en: '🏃 Athletics & Running' }, tag: '🏃 Atletika/Běh' },
      { id: 'combat', label: { cs: '🥊 Bojové sporty', en: '🥊 Combat sports' }, tag: '🥊 Bojové sporty' },
      { id: 'cycling', label: { cs: '🚴 Cyklistika', en: '🚴 Cycling' }, tag: '🚴 Cyklistika' },
      { id: 'extreme', label: { cs: '🧗 Extrémní sporty', en: '🧗 Extreme sports' }, tag: '🧗 Extrémní sporty' },
      { id: 'football', label: { cs: '⚽ Fotbal a Kolektivní hry', en: '⚽ Football & Team sports' }, tag: '⚽ Fotbal/Kolektiv' },
      { id: 'motorsport', label: { cs: '🏎️ Motorsport', en: '🏎️ Motorsport' }, tag: '🏎️ Motorsport' },
      { id: 'swimming', label: { cs: '🏊 Plavání a Vodní sporty', en: '🏊 Swimming & Water' }, tag: '🏊 Plavání/Vodní' },
      { id: 'racquet', label: { cs: '🎾 Raketové sporty', en: '🎾 Racquet sports' }, tag: '🎾 Raketové sporty' },
      { id: 'tv_sports', label: { cs: '📺 Televizní sporty / Fanoušek', en: '📺 TV Sports / Fan' }, tag: '📺 TV Sporty' },
      { id: 'winter', label: { cs: '⛷️ Zimní sporty', en: '⛷️ Winter sports' }, tag: '⛷️ Zimní sporty' }
    ]
  },
  {
    id: 'media_tech',
    icon: Music,
    title: { cs: 'Média, TV a Hi-Fi', en: 'Media, TV & Hi-Fi' },
    description: { cs: 'Zvuk, obraz a technologie.', en: 'Sound, vision and tech.' },
    color: 'border-blue-500 text-blue-500 bg-blue-500/10',
    subOptions: [
      { id: 'audiophile', label: { cs: '🎧 Audiofil / Hi-Fi', en: '🎧 Audiophile / Hi-Fi' }, tag: '🎧 Hi-Fi / Zvuk' },
      { id: 'smart_home', label: { cs: '🏠 Chytrá domácnost', en: '🏠 Smart home' }, tag: '🏠 Smart Home' },
      { id: 'movies_series', label: { cs: '🎬 Filmy a Seriály', en: '🎬 Movies & Series' }, tag: '🎬 Filmy/Seriály' },
      { id: 'podcasts', label: { cs: '🎙️ Podcasty', en: '🎙️ Podcasts' }, tag: '🎙️ Podcasty' },
      { id: 'tech_it', label: { cs: '💻 Technologie a IT', en: '💻 Tech & IT' }, tag: '💻 Technologie/IT' },
      { id: 'tv_broadcast', label: { cs: '📺 Televize a Vysílání', en: '📺 TV & Broadcasting' }, tag: '📺 Televize' }
    ]
  }
];

interface DiscoveryHubProps {
  currentFilters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClose: () => void;
  availableProfiles?: ProfileData[];
}

export function DiscoveryHub({ currentFilters, onApplyFilters, onClose, availableProfiles = [] }: DiscoveryHubProps) {
  const { lang } = useTranslation();
  
  // Local state for the wizard
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    CATEGORIES.find(c => c.id === currentFilters.category)?.id || null
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    currentFilters.subCategories || []
  );
  const [onlyIdVerified, setOnlyIdVerified] = useState<boolean>(
    currentFilters.onlyIdVerified || false
  );

  const activeCatObj = CATEGORIES.find(c => c.id === selectedCategory);

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategory,
      subCategories: selectedSubCategories,
      onlyIdVerified
    });
  };

  const handleClear = () => {
    onApplyFilters({ category: null, subCategories: [], onlyIdVerified: false });
  };

  const toggleSubCategory = (id: string) => {
    setSelectedSubCategories(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (selectedCategory) {
      const scrollIt = () => {
        const el = document.getElementById(`cat-btn-${selectedCategory}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      };
      
      const el = document.getElementById(`cat-btn-${selectedCategory}`);
      if (el) {
        scrollIt();
      } else {
        const timer = setTimeout(scrollIt, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-[200] w-full h-[100dvh] flex justify-center items-start pt-20 px-4 pb-24 bg-black/95 backdrop-blur-xl overflow-y-auto custom-scrollbar"
    >
      <div className="w-full max-w-5xl bg-mafia-dark border border-mafia-gold/30 shadow-[0_0_50px_rgba(197,160,89,0.15)] rounded-3xl flex flex-col shrink-0 mb-10 overflow-hidden">
        <div className="p-6 md:p-10 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-4">
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={16} className="text-white" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <Search size={24} />
                {lang === 'cs' ? 'Koho hledáš?' : 'Who are you looking for?'}
              </h2>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mt-1">
                {lang === 'cs' ? 'Discovery Hub' : 'Discovery Hub'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setOnlyIdVerified(!onlyIdVerified)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest transition-colors ${
                onlyIdVerified
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-black/40 border-white/20 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${onlyIdVerified ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
              {lang === 'cs' ? 'Pouze ověření' : 'Verified only'}
            </button>
            <button 
              onClick={handleApply}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:bg-mafia-gold/20 hover:border-mafia-gold hover:text-mafia-gold transition-colors text-white/70 text-xs font-mono uppercase tracking-widest"
            >
              <X size={16} />
              {lang === 'cs' ? 'Zpět na rybník' : 'Back to pond'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div 
                key="categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategories([]);
                    }}
                    className={`flex flex-col items-start text-left p-6 border transition-all duration-300 group ${
                      cat.id === currentFilters.category 
                        ? `${cat.color} scale-[1.02]` 
                        : 'border-white/10 bg-black/40 hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-4 border transition-colors ${
                      cat.id === currentFilters.category ? cat.color : 'border-white/10 text-white/50 group-hover:text-white'
                    }`}>
                      <cat.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{cat.title[lang as 'cs' | 'en']}</h3>
                    <p className="text-white/40 text-xs font-mono">{cat.description[lang as 'cs' | 'en']}</p>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="subcategories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                {/* Persistent Category Switcher Panel */}
                <div className="flex items-center gap-2 overflow-x-auto pt-4 px-2 pb-4 border-b border-white/5 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(197, 160, 89, 0.5) rgba(0, 0, 0, 0.2)' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      id={`cat-btn-${cat.id}`}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1 min-w-[80px] ${
                        selectedCategory === cat.id 
                          ? `${cat.color} bg-black/60 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105` 
                          : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                      title={cat.title[lang as 'cs' | 'en']}
                    >
                      <cat.icon size={24} />
                      <span className="text-[9px] font-mono uppercase tracking-wider text-center line-clamp-1 w-full px-1">{cat.title[lang as 'cs' | 'en']}</span>
                    </button>
                  ))}
                </div>

                <div className={`p-6 rounded-2xl border ${activeCatObj?.color} bg-black/60 flex items-center gap-4 shadow-inner`}>
                  {activeCatObj && <div className="p-3 bg-white/5 rounded-full"><activeCatObj.icon size={32} /></div>}
                  <div>
                    <h3 className="text-xl font-bold">{activeCatObj?.title[lang as 'cs' | 'en']}</h3>
                    <p className="text-sm font-mono opacity-80">{activeCatObj?.description[lang as 'cs' | 'en']}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest">
                      {lang === 'cs' ? 'Upřesněte výběr' : 'Specify your choice'}
                    </h4>
                    <button 
                      onClick={() => {
                        if (activeCatObj) {
                          const allIds = activeCatObj.subOptions.map(o => o.id);
                          const isAllSelected = activeCatObj.subOptions.every(o => selectedSubCategories.includes(o.id));
                          if (isAllSelected) {
                            setSelectedSubCategories([]);
                          } else {
                            setSelectedSubCategories(allIds);
                          }
                        }
                      }}
                      className="text-[10px] font-mono text-mafia-gold uppercase border border-mafia-gold/30 px-2 py-1 rounded hover:bg-mafia-gold/10 transition-colors"
                    >
                      {(() => {
                        const isAllSelected = activeCatObj ? activeCatObj.subOptions.every(o => selectedSubCategories.includes(o.id)) : false;
                        if (lang === 'cs') return isAllSelected ? 'Odznačit vše' : 'Vybrat vše';
                        return isAllSelected ? 'Deselect All' : 'Select All';
                      })()}
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {activeCatObj?.subOptions.map(opt => {
                      const isSelected = selectedSubCategories.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggleSubCategory(opt.id)}
                          className={`p-4 border text-left transition-all font-mono uppercase tracking-widest text-sm flex items-center justify-between ${
                            isSelected
                              ? 'border-mafia-gold text-mafia-gold bg-mafia-gold/10'
                              : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-black/40'
                          }`}
                        >
                          <span>{opt.label[lang as 'cs' | 'en']}</span>
                          {isSelected && <Heart size={16} className="text-mafia-gold fill-mafia-gold" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Preview Section */}
        {selectedCategory && selectedSubCategories.length > 0 && availableProfiles && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 border border-mafia-gold/30 bg-mafia-gold/5 rounded-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono text-mafia-gold uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> 
                {lang === 'cs' ? 'Živý náhled v síti' : 'Live Network Preview'}
              </h4>
              <span className="text-[10px] font-mono text-white/50">
                {availableProfiles.filter(p => {
                  const tagsToSearch = activeCatObj?.subOptions.filter(sub => selectedSubCategories.includes(sub.id)).map(sub => sub.tag) || [];
                  const pTags = p.categories || [];
                  const pInterests = p.interests || "";
                  return tagsToSearch.some(tag => pTags.includes(tag) || pInterests.includes(tag));
                }).length} {lang === 'cs' ? 'shod' : 'matches'}
              </span>
            </div>
            
            <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
              {availableProfiles.filter(p => {
                const tagsToSearch = activeCatObj?.subOptions.filter(sub => selectedSubCategories.includes(sub.id)).map(sub => sub.tag) || [];
                const pTags = p.categories || [];
                const pInterests = p.interests || "";
                return tagsToSearch.some(tag => pTags.includes(tag) || pInterests.includes(tag));
              }).map((profile, idx) => (
                <div key={idx} className="relative w-12 h-12 flex-shrink-0 rounded-full border border-mafia-gold/50 overflow-hidden group">
                  <img src={profile.photos?.[0] || '/placeholder-user.jpg'} alt={profile.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[8px] font-bold text-mafia-gold uppercase">{profile.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex gap-4 pt-4 border-t border-white/10 pb-8">
          <button
            onClick={handleClear}
            className="flex-1 py-4 border border-white/20 text-white/50 font-mono text-xs uppercase tracking-widest hover:border-white/50 hover:text-white transition-all"
          >
            {lang === 'cs' ? 'Zrušit filtry' : 'Clear filters'}
          </button>
          <button
            onClick={handleApply}
            className="flex-[2] py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(197,160,89,0.2)]"
          >
            {lang === 'cs' ? 'Aplikovat a hledat' : 'Apply & Search'}
          </button>
        </div>
        </div>
      </div>
    </motion.div>
  );
}
