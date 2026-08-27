export interface Pet {
  id: string;
  type: string;
  breed: string;
  name?: string;
  purpose?: 'walk' | 'breed' | 'none';
}

export interface School {
  id: string;
  name: string;
  yearFrom: string;
  yearTo: string;
  field?: string; // Obor nebo fakulta
}

export type AccountType = 'individual' | 'couple' | 'group' | 'family' | 'pet' | 'property' | 'object' | 'activity' | 'job';
export type SeekingType = 'male' | 'female' | 'both' | 'couple' | 'group' | 'family' | 'pet' | 'property' | 'object' | 'activity' | 'job' | 'any';

export type Importance = 'must_have' | 'prefer' | 'dont_care' | 'dislike';
export type TraitImportance = 'vubec' | 'trochu' | 'hodne' | 'zasadni';

export interface Preference<T> {
  value: T;
  importance: Importance;
}

// 1. Fyzická přitažlivost
export interface PhysicalAttractionPrefs {
  importance?: TraitImportance;
  prefHeight?: string;
  prefBodyType?: string | string[];
  prefBeard?: string;
  prefStyle?: string;
  careForLooks?: TraitImportance;
  neatness?: TraitImportance;
  sexImportance?: TraitImportance;
  attractionPreference?: 'physical' | 'psychological' | 'both';
  kinks?: string;
}

// 2. Konflikty
export interface ConflictPrefs {
  myReaction?: string; 
  iNeedFromPartner?: string[]; 
  apologyCapacity?: string; // Schopnost omluvit se
  stubbornness?: string; // Tvrdohlavost
  partnerSupport?: string; // Zastani partnera
}

// 3. Komunikace
export interface CommunicationPrefs {
  dailyTexting?: TraitImportance;
  contactFreq?: string;
  callsVsTexts?: string;
  lateRepliesBother?: TraitImportance;
  openFeelings?: TraitImportance;
  needCommunicativePartner?: TraitImportance;
}

// 4. Láska a pozornost
export interface LovePrefs {
  howIShowLove?: string[]; 
  whatINeed?: string[];
}

// 5. Náboženství, hodnoty a názory
export interface ValuesPrefs {
  religion?: string;
  faithImportance?: TraitImportance;
  politics?: string;
  traditionalVsModern?: string;
  genderRoles?: string;
  familyImportance?: TraitImportance;
  workAttitude?: string;
  moneyAttitude?: string;
  finance?: string;
  kidsAttitude?: string;
}

// 6. Společný život
export interface SharedLifePrefs {
  idealWeekend?: string[];
  idealHoliday?: string[];
}

// 7. Bydlení
export interface HousingPrefs {
  locationPref?: string; 
  typePref?: string; 
  wantToMove?: string;
  moveForPartner?: string;
  wantToLiveAlone?: string;
  wantHouseOneDay?: string;
  distanceFromFamily?: string;
}

export interface HealthConditionsPrefs {
  visionHearing?: string[];
  mobility?: string[];
  chronic?: string[];
  neurodivergent?: string[];
  dietaryOrLifestyleConstraints?: string[];
}

// 8. Děti - podrobněji
export interface KidsPrefs {
  wantKids?: string;
  howMany?: string;
  when?: string;
  partnerWithKids?: string;
  sharedKids?: string;
  upbringingImportance?: TraitImportance;
  upbringingStyle?: string;
}

// 9. Zvířata
export interface AnimalPrefs {
  havePets?: string[]; 
  wantPets?: string;
  petsAtHomeBother?: string;
  allergies?: string;
  willingToCare?: string;
}

// 10. Životní návyky
export interface HabitsPrefs {
  smoking?: string;
  alcohol?: string;
  sport?: string;
  diet?: string;
  nightlife?: string;
  sleepSchedule?: string;
  tidiness?: string;
  cleaningFreq?: string;
  healthImportance?: TraitImportance;
}

// 11. Peníze
export interface MoneyPrefs {
  myAttitude?: string; 
  expectPartnerIndependent?: string;
  sharedAccount?: string;
  whoPaysDate?: string;
  incomeDiffBothers?: string;
}

export interface CharacterTraits {
  honesty?: TraitImportance;
  loyalty?: TraitImportance;
  humor?: TraitImportance;
  reliability?: TraitImportance;
  empathy?: TraitImportance;
  ambition?: TraitImportance;
  calmness?: TraitImportance;
  sociability?: TraitImportance;
  romance?: TraitImportance;
  independence?: TraitImportance;
  tolerance?: TraitImportance;
  communication?: TraitImportance;
  jealousy?: TraitImportance;
  familyOriented?: TraitImportance;
}

export interface LifestylePrefs {
  pace?: string;
  sport?: TraitImportance;
  travel?: TraitImportance;
  parties?: TraitImportance;
  nature?: TraitImportance;
  culture?: TraitImportance;
  work?: TraitImportance;
  homeTime?: TraitImportance;
  meetingFrequency?: string;
}

export interface FinancePrefs {
  careerImportance?: TraitImportance;
  partnerStability?: TraitImportance;
  financesSetup?: string;
  lifeStandard?: string;
  incomeDifference?: string;
}

export interface FuturePrefs {
  lookingFor?: string;
  kidsDesire?: string;
  movingIn?: string;
  wedding?: string;
  familyImportance?: TraitImportance;
  relationshipPace?: string;
}

export interface ExpectationsPrefs {
  initiative?: TraitImportance;
  attention?: TraitImportance;
  romance?: TraitImportance;
  loyalty?: TraitImportance;
  timeTogether?: TraitImportance;
  spaceForSelf?: TraitImportance;
  physicalCloseness?: TraitImportance;
  support?: TraitImportance;
  communication?: TraitImportance;
}

export interface GroupMember {
  id: string;
  name: string;
  age: string;
  gender: string;
  height: string;
  smoking: string;
  drinking: string;
  myTraits?: string[];
}

export interface ProfileData {
    boundaries?: { infidelityDef?: string; };
  id?: string;
  userId?: string;
  // Missing fields restored
  careerField?: string;
  gallupStrengths?: string[];
  coreMotivation?: string;
  workEnvironmentPref?: string;
  workConflictStyle?: string;
  
  lifeSatisfaction?: string;
  listenToAdvice?: string;
  trendsVsTested?: string;
  naiveVsOpinionated?: string;
  friendsCircle?: string;
  infidelityBoundaries?: string;
  publicAffection?: string;
  loyaltyApproach?: string;

  matchId?: string;
  messageRetentionDays?: number | null;
  schemaVersion?: number;
  protocolAgreed?: boolean;
  trustedRater?: boolean;
  trustedRatingsReceived?: number;
  distanceFromUser?: number;
  accountType?: AccountType;
  mmCoins?: number;
  autoConvertPoints?: boolean;
  subscription?: 'monthly' | 'quarterly' | 'halfyearly' | 'yearly' | 'none';
  members?: GroupMember[];
  linkedUserIds?: string[];
  photos: string[];
  name: string;
  lastName?: string;
  nickname?: string;
  showMutualFriends?: boolean;
  isPrivate?: boolean;
  isNinjaMode?: boolean;
  isBlurredMode?: boolean;
  isZenMode?: boolean;
  visibilityMode?: 'public' | 'serious_only' | 'b2b_only' | 'ghost';
  mutualFriendsCount?: number;
  age: string;
  birthDate?: string;
  gender: string;
  zodiac?: string;
  seeking: string | string[];
  seekingTags?: string[];
  city?: string;
  height: string;
  weight?: string; // Váha v kg (pro BMI)
  religion?: string; // Víra / Přesvědčení
  smoking: string;
  drinking: string;
  substances?: string[]; // Omamné látky a závislosti
  
  // Rodina a Minulost
  siblings?: string;
  childhoodEnvironment?: string;
  childhoodTraumas?: string[];
  caregiving?: string;
  
  // Hot Topics (Moderní témata)
  aiAttitude?: string;
  therapyAttitude?: string;
  dietEco?: string;
  workModel?: string;
  polarization?: string;
  interests: string;
  myTags?: string[];
  bio: string;
  education?: string; // legacy generic education
  
  // Kariéra a B2B (Headhunting)
  educationLevel?: string;
  educationGrades?: string;
  educationFinalExam?: string;
  workEthic?: string;
  familyLegacy?: string;
  legacyContinue?: string;
  employmentPreference?: string;
  contactEmail?: string;
  contactPhone?: string;
  b2bConsentAgreed?: boolean;
  openToJobOffers?: boolean;
  careerProgression?: string[];

  // Sociální Sítě a Vliv
  socialMediaRole?: 'consumer' | 'balance' | 'creator' | 'none';
  socialMediaTime?: number; // 0-100 posuvník

  // Sporty
  sportsPlayed?: string[];
  sportsWatching?: string[];

  energy?: string;
  matchStrategy?: string;
  firstDate?: string;
  isComplicated?: boolean;
  weekend?: string;
  lifeGoal?: string;
  familyStatus?: 'single' | 'taken' | 'married' | 'divorced' | 'widowed' | 'complicated';
  hasKids?: 'yes' | 'no';
  kidsCount?: number;
  kids?: string; // original kids preference/status
  prefKids?: { value: string, importance: string }; // user preference for kids
  kidsDetailed?: {
    partnerWithKids?: string;
  };
  pastPartnersCount?: number;
  pastPartnersReveal?: 'mutual' | 'hidden';
  redFlag?: string;
  loveLanguage?: string;
  lastOnline?: string;
  adminTags?: string[];
  negatives?: string;
  dateLikes?: number;
  icebreaker?: string;
  replyRate?: 'high' | 'medium' | 'low';
  isBookmarked?: boolean;
  locations?: { city: string, radiusKm: number }[];
  locationPrivacy?: 'local' | 'incognito' | 'any';
  categories?: string[];
  activeCategories?: string[];

  dietaryPrefs?: string[];
  healthManagement?: string; // Jak přistupuje ke zdraví
  activeModules?: string[];
  petDetails?: string;
  pets?: Pet[];
  schools?: School[];
  
  // Psychology
  // Psychology & Deep matching
  mbti?: string;
  temperament?: string;
  mindset?: string;
  mindsetContext?: string; // Pozitivni/Negativni v kontextu doby
  intelligence?: string;
  socialBattery?: string;
  attachmentStyle?: string;
  loveLanguages?: string[];
  enneagram?: string;
  chronotype?: string;
  jungArchetype?: string;
  darkTriad?: string;
  peacefulness?: string; // Pacifista, klidny, vybusny
  autoTags?: string[]; // Tagy generovane z odpovedi
  conflictStyle?: string;
  apologyLanguage?: string;
  brainHemisphere?: string;
  intimacyDynamic?: string;
  loveStyle?: string;
  dealbreakers?: string[];
  digitalLife?: string;
  guiltyPleasures?: string[];
  workLifeBalance?: string;
  housingStatus?: string;
  car?: string;
  assets?: string[];
  timeline?: {
    past?: string[];
    present?: string[];
    future?: string[];
  };
  parenting?: {
    vision?: string[];
    upbringing?: string[];
    relationshipPostKids?: string[];
    instinct?: string[];
    respectForElders?: string;
    familyRole?: string;
  };
  
  // Socials
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  snapchat?: string;
  spotify?: string;
  
  // Accessibility and Identity
  disability?: string;
  lgbtq?: boolean;
  pronouns?: string;
  
  // Physical Traits
  myHair?: string;
  myBodyType?: string;
  myEyeColor?: string;
  myTraits?: string[];
  
  // Partner Preferences
  prefAgeMin?: string;
  prefAgeMax?: string;
  prefHair?: string[];
  prefBodyType?: string[];
  partnerExpectedIncome?: string;

  // New Fields
  offersServices?: boolean;
  serviceVoucher?: {
    title: string;
    description: string;
    discount: string;
    code?: string;
  };
  livingStatus?: string;
  ownsHousing?: boolean;
  personalityDynamics?: string;
  rituals?: string[];
  termsAccepted?: boolean;
  linkedAccounts?: { email: string; status: 'pending' | 'accepted' }[];
  nsfwCategories?: string[];
  reportsCount?: number;
  reportsDetails?: string[];
  unreadMatches?: number;
  trustScore?: number;
  trustEndorsements?: { count: number; salonId: string; salonName: string }[];
  criticalWarnings?: string[];
  originSalonId?: string;
  voicePrompt?: { question: string; url: string };
  
  // New user requested fields
  disorders?: string[];
  famousAncestors?: string;
  
  // Advanced Premium Network Features
  salonVerified?: boolean;
  idVerified?: boolean;
  secretDesires?: string;
  secretDesiresReveal?: 'mutual' | 'hidden';
  currentStatus?: { text: string; expiresAt: number };
  wingmanEndorsements?: { author: string; text: string }[];
  dropMatch?: { expiresAt: number; isGold: boolean };
  
  // Fyzické ověření (Safe Spots)
  physicallyVerifiedAt?: string[];
  dateCheckins?: { locationId: string; photoUrl?: string }[];

  gamingPrefs?: {
    games?: string[];
    nickname?: string;
  };

  // ChatGPT Overhaul Fields
  maxDistance?: number;
  prefSmoking?: Preference<string>;
  prefDrinking?: Preference<string>;
  prefPets?: Preference<string>;
  prefDistance?: string; 
  
  characterTraits?: CharacterTraits;
  lifestylePrefs?: LifestylePrefs;
  financePrefs?: FinancePrefs;
  futurePrefs?: FuturePrefs;
  expectationsPrefs?: ExpectationsPrefs;
  
  // 11 new categories
  physicalAttraction?: PhysicalAttractionPrefs;
  conflicts?: ConflictPrefs;
  communication?: CommunicationPrefs;
  love?: LovePrefs;
  values?: ValuesPrefs;
  sharedLife?: SharedLifePrefs;
  housing?: HousingPrefs;
  animals?: AnimalPrefs;
  habits?: HabitsPrefs;
  moneyDetailed?: MoneyPrefs;
  healthConditions?: HealthConditionsPrefs;
  
  // Community / Groups Feature
  communityType?: 'entrance' | 'building' | 'street' | 'neighborhood';
  communityMembers?: {
    id: string; // The Profile ID of the member
    status: 'pending' | 'accepted';
    requestedAt: string;
  }[];
  
  // ChatGPT Extended Fields
  selfImprovementAreas?: string[];
  passions?: string[];
  healthyRelationshipDef?: string;
  problemSolvingSpeed?: string;
  comfortNeeds?: string[];
  spontaneityLevel?: string;
  allowedDifferences?: string[];
  infidelityDefinition?: string;
  exFriendship?: string;
  privacyLevel?: string;
  icebreakerPrompts?: { question: string, answer: string }[];
}
