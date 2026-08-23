"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { 
  User, Calendar, Camera, MapPin, 
  Heart, Ruler, X, ImagePlus, 
  Cigarette, Wine, Sparkles, Target, Coffee, Check,
  Skull, Flag, MessageCircleHeart, Flame, GraduationCap, Zap, Bookmark, Instagram, Link, PawPrint, Search, ChevronRight, ChevronLeft, ShieldCheck, Users,
  Eye, Brain, Activity, Scale, Settings, Save, MessageSquare, EyeOff, Plus, Home, Leaf, Briefcase
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from 'react-easy-crop';
import { ProfileCard, ProfileData, Pet } from "./ProfileCard";
import { ANIMAL_TYPES, PET_BREEDS } from "@/lib/PetAtlas";
import { CATEGORIES } from "./DiscoveryHub";
import { CustomSelect } from "./CustomSelect";
import { PersonalityQuiz } from "./PersonalityQuiz";
import { PreferenceSelector, TraitSelector, InfoTooltip } from "./SetupHelpers";
import { Step2Physical, Step3Character, Step4Lifestyle, Step5CommLove, Step6FutureKids, Step7ValuesMoney, Step8Protocol, StepSchools } from "./ProfileSetupSteps";
import { PsychologyQuiz, MBTI_QUIZ, LOVE_LANGUAGE_QUIZ, ATTACHMENT_STYLE_QUIZ, CHRONOTYPE_QUIZ, TEMPERAMENT_QUIZ, ENNEAGRAM_QUIZ, CONFLICT_STYLE_QUIZ, APOLOGY_LANGUAGE_QUIZ, BRAIN_HEMISPHERE_QUIZ, INTIMACY_DYNAMIC_QUIZ, LOVE_STYLE_QUIZ, DARK_TRIAD_QUIZ, SPONTANEITY_QUIZ, INFIDELITY_BOUNDARY_QUIZ, QuizDef } from './PsychologyQuiz';


const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number }
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.95);
  });
}

interface ProfileSetupProps {
  initialData?: ProfileData | null;
  onFinish?: (data: ProfileData) => void;
  onDeleteAccount?: () => void;
  onReset?: () => void;
}

export function ProfileSetup({ initialData, onFinish, onDeleteAccount, onReset }: ProfileSetupProps) {
  const { lang } = useTranslation();
  
  const [formData, setFormData] = useState<ProfileData>(() => {
    if (initialData) return initialData;
    
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem('mmbarber_profile_draft');
      if (draft) {
        try {
          return JSON.parse(draft);
        } catch (e) {
          console.error('Failed to parse draft profile', e);
        }
      }
    }
    
    return {
      photos: [] as string[],
      name: "",
      age: "",
      gender: "",
      seeking: [],
      city: "",
      height: "",
      smoking: "",
      drinking: "",
      interests: "",
      bio: "",
      education: "",
      energy: "",
      matchStrategy: "",
      firstDate: "",
      isComplicated: false,
      weekend: "",
      lifeGoal: "",
      kids: "",
      redFlag: "",
      loveLanguage: "",
      negatives: "",
      categories: [],
      activeCategories: [],
      petDetails: "",
      pets: [],
      mbti: "",
      temperament: "",
      mindset: "",
      intelligence: "",
      socialBattery: "",
      livingStatus: "",
      ownsHousing: false,
      partnerExpectedIncome: "",
      personalityDynamics: "",
      characterTraits: {},
      lifestylePrefs: {},
      financePrefs: {},
      futurePrefs: {},
      expectationsPrefs: {},
      linkedUserIds: []
    };
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mmbarber_profile_draft', JSON.stringify(formData));
    }
  }, [formData]);

  const [error, setError] = useState("");
  const [newLinkedUser, setNewLinkedUser] = useState("");
  
  // Tab State
  const [activeTab, setActiveTab] = useState<string>('categories');
  const [activeQuiz, setActiveQuiz] = useState<QuizDef | null>(null);
  const [isPsychologyExpanded, setIsPsychologyExpanded] = useState<boolean>(false);

  const isDating = formData.activeCategories?.includes('relationships') || false;
  const isClassmates = formData.activeCategories?.includes('school') || false;
  const isHumanAccount = ['individual', 'couple', 'family', 'group'].includes(formData.accountType || 'individual');
  const activeModules = formData.activeModules || [];
  
  const wizardSteps = [
    { id: 'categories', label: lang === 'cs' ? 'Kategorie' : 'Categories' },
    { id: 'basic', label: lang === 'cs' ? 'Základní údaje' : 'Basic Info' },
    ...(isHumanAccount ? [
      { id: 'modules', label: lang === 'cs' ? 'Hlubší poznání' : 'Psychology' },
      ...(activeModules.includes('physical') ? [{ id: 'physical', label: lang === 'cs' ? 'Vzhled' : 'Physical' }] : []),
      ...(isDating && activeModules.includes('character') ? [{ id: 'character', label: lang === 'cs' ? 'Charakter' : 'Character' }] : []),
      ...(isDating && activeModules.includes('lifestyle') ? [{ id: 'lifestyle', label: lang === 'cs' ? 'Životní styl' : 'Lifestyle' }] : []),
      ...(isDating && activeModules.includes('love') ? [{ id: 'love', label: lang === 'cs' ? 'Láska' : 'Love' }] : []),
      ...(isDating && activeModules.includes('future') ? [{ id: 'future', label: lang === 'cs' ? 'Budoucnost' : 'Future' }] : []),
      ...(isDating && activeModules.includes('values') ? [{ id: 'values', label: lang === 'cs' ? 'Hodnoty' : 'Values' }] : []),
      ...(isDating && activeModules.includes('communication') ? [{ id: 'communication', label: lang === 'cs' ? 'Komunikace' : 'Communication' }] : []),
      ...(isDating && activeModules.includes('intimacy') ? [{ id: 'intimacy', label: lang === 'cs' ? 'Intimita' : 'Intimacy' }] : []),
      ...(isDating && activeModules.includes('intellect') ? [{ id: 'intellect', label: lang === 'cs' ? 'Intelekt' : 'Intellect' }] : []),
      ...(isDating && activeModules.includes('boundaries') ? [{ id: 'boundaries', label: lang === 'cs' ? 'Hranice' : 'Boundaries' }] : []),
      ...(isClassmates ? [{ id: 'schools', label: lang === 'cs' ? 'Školy' : 'Schools' }] : [])
    ] : []),
    { id: 'about', label: lang === 'cs' ? 'O mně (Bio)' : 'About me (Bio)' },
    { id: 'protocol', label: lang === 'cs' ? 'Pravidla' : 'Protocol' }
  ];

  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  
  // Pet Modal State
  const [showPetModal, setShowPetModal] = useState(false);
  const [petDraft, setPetDraft] = useState<Omit<Pet, 'id'>>({ type: 'dog', breed: '', name: '', purpose: 'none' });
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [breedSearch, setBreedSearch] = useState('');

  // Member Modal State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberDraft, setMemberDraft] = useState<Omit<import('./ProfileTypes').GroupMember, 'id'>>({ name: '', age: '', gender: 'male', height: '170', smoking: 'nepije', drinking: 'nepije', myTraits: [] });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const [showPreview, setShowPreview] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [editingMyCategory, setEditingMyCategory] = useState<string | null>(null);

  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [isComplicatedAnimating, setIsComplicatedAnimating] = useState(false);

  const handleBirthDateChange = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      setFormData(prev => ({ ...prev, birthDate: dateStr }));
      return;
    }
    const ageDifMs = Date.now() - d.getTime();
    const ageDate = new Date(ageDifMs);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970).toString();

    const month = d.getMonth() + 1;
    const day = d.getDate();
    let z = "";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) z = "aries";
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) z = "taurus";
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) z = "gemini";
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) z = "cancer";
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) z = "leo";
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) z = "virgo";
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) z = "libra";
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) z = "scorpio";
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) z = "sagittarius";
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) z = "capricorn";
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) z = "aquarius";
    else z = "pisces";

    setFormData(prev => ({ ...prev, birthDate: dateStr, age: calculatedAge, zodiac: z }));
    if (missingFields.includes('age')) {
      setMissingFields(prev => prev.filter(f => f !== 'age' && f !== 'birthDate'));
      setError("");
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("seznamka_draft", JSON.stringify(formData));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = 'auto';
      bioRef.current.style.height = `${bioRef.current.scrollHeight}px`;
    }
  }, [formData.bio, activeTab]);

  const validateStep1 = () => {
    const missing: string[] = [];
    const missingNames: string[] = [];
    let customError = "";

    if (formData.photos.length === 0) {
      missing.push('photos');
      missingNames.push(lang === 'cs' ? 'Fotka' : 'Photo');
    }
    if (!formData.name.trim()) {
      missing.push('name');
      missingNames.push(lang === 'cs' ? 'Jméno' : 'Name');
    }
    if (!formData.age) {
      missing.push('age');
      missingNames.push(lang === 'cs' ? 'Věk' : 'Age');
    } else if (parseInt(formData.age) < 18) {
      missing.push('age');
      customError = lang === 'cs' ? 'Tady je to jen pro dospělý, kámo. Musí ti být aspoň 18.' : 'Adults only, my friend. Must be 18+.';
    }

    if (missing.length > 0) {
      setMissingFields(missing);
      
      if (customError && missingNames.length === 0) setError(customError);
      else if (customError) setError(lang === 'cs' ? `Chybí: ${missingNames.join(', ')}. A pamatuj: ${customError}` : `Missing: ${missingNames.join(', ')}. And remember: ${customError}`);
      else setError(lang === 'cs' ? `Chybí povinné údaje: ${missingNames.join(', ')}` : `Missing required fields: ${missingNames.join(', ')}`);
      
      setTimeout(() => {
        const firstMissing = document.querySelector(`[data-field="${missing[0]}"]`);
        if (firstMissing) firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return false;
    }
    setError("");
    return true;
  };

  const validateForm = () => {
    return validateStep1();
  };

  const handleFinish = async () => {
    if (validateForm() && onFinish) {
      try {
        const response = await fetch('/api/profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mmbarber_profile_draft');
            localStorage.removeItem('mmbarber_profile_step');
          }
          onFinish(formData);
        } else {
          console.error('Failed to save profile');
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  const handleSavePet = () => {
    if (!petDraft.breed) return;
    if (editingPetId) {
      setFormData(prev => ({ ...prev, pets: prev.pets?.map(p => p.id === editingPetId ? { ...petDraft, id: editingPetId } : p) }));
    } else {
      setFormData(prev => ({ ...prev, pets: [...(prev.pets || []), { ...petDraft, id: Math.random().toString(36).substr(2, 9) }] }));
    }
    setShowPetModal(false);
  };

  const handleEditPet = (petId: string) => {
    const petToEdit = formData.pets?.find(p => p.id === petId);
    if (petToEdit) {
      setPetDraft({ type: petToEdit.type, breed: petToEdit.breed, name: petToEdit.name || '', purpose: petToEdit.purpose || 'none' });
      setEditingPetId(petId);
      setBreedSearch('');
      setShowPetModal(true);
    }
  };

  const handleDeletePet = (petId: string) => {
    setFormData(prev => ({ ...prev, pets: prev.pets?.filter(p => p.id !== petId) }));
  };

  const openNewPetModal = () => {
    setPetDraft({ type: 'dog', breed: '', name: '', purpose: 'none' });
    setEditingPetId(null);
    setBreedSearch('');
    setShowPetModal(true);
  };

  const handleSaveMember = () => {
    if (!memberDraft.name) return;
    if (editingMemberId) {
      setFormData(prev => ({ ...prev, members: prev.members?.map(m => m.id === editingMemberId ? { ...memberDraft, id: editingMemberId } : m) }));
    } else {
      setFormData(prev => ({ ...prev, members: [...(prev.members || []), { ...memberDraft, id: Math.random().toString(36).substr(2, 9) }] }));
    }
    setShowMemberModal(false);
  };

  const handleEditMember = (memberId: string) => {
    const memberToEdit = formData.members?.find(m => m.id === memberId);
    if (memberToEdit) {
      setMemberDraft({ name: memberToEdit.name, age: memberToEdit.age, gender: memberToEdit.gender, height: memberToEdit.height, smoking: memberToEdit.smoking, drinking: memberToEdit.drinking, myTraits: memberToEdit.myTraits || [] });
      setEditingMemberId(memberId);
      setShowMemberModal(true);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setFormData(prev => ({ ...prev, members: prev.members?.filter(m => m.id !== memberId) }));
  };

  const openNewMemberModal = () => {
    setMemberDraft({ name: '', age: '', gender: 'male', height: '170', smoking: 'nepije', drinking: 'nepije', myTraits: [] });
    setEditingMemberId(null);
    setShowMemberModal(true);
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onFinish) onFinish(formData);
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setActivePhoto(URL.createObjectURL(files[0]));
      e.target.value = ''; 
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!activePhoto || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(activePhoto, croppedAreaPixels);
      if (croppedImage) {
        setFormData(prev => ({ ...prev, photos: [...prev.photos, croppedImage].slice(0, 6) }));
        if (missingFields.includes('photos')) {
          setMissingFields(prev => prev.filter(f => f !== 'photos'));
          setError("");
        }
      }
      setActivePhoto(null);
    } catch (e) {
      console.error(e);
      setActivePhoto(null);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, index) => index !== indexToRemove) }));
  };

  return (
    <>
      <motion.form 
        noValidate
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto text-left w-full relative z-10"
      >
        {/* Fixed Save Button Top Left */}
        <div className="fixed top-24 left-4 md:left-8 z-50">
          <button 
            type="button" 
            onClick={() => {
              if (validateForm()) {
                handleSubmit(new Event('submit') as any);
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-105"
          >
            <Save size={18} />
            {lang === 'cs' ? 'Uložit profil' : 'Save profile'}
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-mafia-gold pl-4 bg-black/40 p-4 rounded-r-xl border-y border-r border-white/5">
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => {
                if (validateForm()) {
                  handleSubmit(new Event('submit') as any);
                }
              }}
              className="px-6 py-2 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors"
            >
              {lang === 'cs' ? 'Uložit profil' : 'Save profile'}
            </button>
            <button 
              type="button" 
              onClick={handleSaveDraft}
              className="px-4 py-2 hover:bg-white/10 transition-colors bg-white/5 rounded-full border border-white/10 hover:border-mafia-gold/50 flex items-center justify-center gap-2 text-[10px] font-mono uppercase text-white/70 tracking-widest"
              title={lang === 'cs' ? 'Uložit koncept' : 'Save draft'}
            >
              <Save size={14} /> {lang === 'cs' ? 'Koncept' : 'Draft'}
            </button>
          </div>

          <div className="text-right">
            <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-1">
              {lang === 'cs' ? "Tvůj Profil" : "Your Profile"}
            </h3>
            <p className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
              {lang === 'cs' 
                ? "Vyplň detaily, ať víme, s kým máme tu čest."
                : "Fill in the details so we know who we're dealing with."}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full items-start">
          {/* Navigation Tabs (Sidebar on Desktop) */}
          <div className="flex flex-row overflow-x-auto pb-4 gap-2 hide-scrollbar w-full lg:w-64 lg:flex-col lg:pb-0 lg:sticky lg:top-24 shrink-0">
            {wizardSteps.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center justify-center lg:justify-start gap-2 px-5 py-2.5 lg:py-4 rounded-full lg:rounded-xl transition-all duration-300 border lg:border-l-4 lg:border-y-0 lg:border-r-0 ${
                    isActive 
                      ? 'bg-mafia-gold/20 border-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.2)] lg:shadow-none' 
                      : 'bg-black/40 border-white/10 lg:border-transparent hover:bg-white/10 lg:hover:border-white/20'
                  }`}
                >
                  <span className={`font-mono text-[11px] lg:text-xs uppercase tracking-widest font-bold whitespace-nowrap ${isActive ? 'text-mafia-gold' : 'text-white/60'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0 relative">
            <AnimatePresence>
              {showSaveToast && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-12 left-1/2 -translate-x-1/2 z-[200] bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <Save size={14} />
                  {lang === 'cs' ? 'Koncept uložen' : 'Draft saved'}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-8 text-left min-h-[500px]">
              {error && (
                <div className="mb-6 p-4 border border-red-500/30 bg-red-900/20 text-red-400 text-xs font-mono rounded-lg">
                  {error}
                </div>
              )}

          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center mb-6">
                <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg flex items-center justify-center gap-2">
                  {lang === 'cs' ? 'Co tu vlastně hledáš?' : 'What are you looking for?'}
                  <InfoTooltip text={lang === 'cs' ? 'Vybráním kategorií se zařadíš do odpovídajících částí Sítě a zároveň se ti podle nich přizpůsobí další kroky tohoto dotazníku.' : 'By selecting categories, you join the respective parts of the Network, and the rest of this questionnaire adapts to your choices.'} />
                </h4>
                <p className="text-white/50 font-mono text-xs mt-2">{lang === 'cs' ? 'Zaškrtni oblasti, které tě zajímají. Tím se do nich zařadíš a rovnou si detailně vybereš, na čem ti záleží.' : 'Check the areas that interest you. This will include you in them and let you pick exactly what matters to you.'}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => {
                  const isActive = (formData.activeCategories || []).includes(cat.id);
                  const selectedTagsCount = cat.subOptions.filter(opt => (formData.categories || []).includes(opt.tag)).length;
                  return (
                    <button key={cat.id} type="button" onClick={() => {
                        if (!isActive) {
                          setFormData(prev => ({ ...prev, activeCategories: [...(prev.activeCategories || []), cat.id] }));
                        }
                        setEditingMyCategory(cat.id);
                    }} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all relative ${isActive ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_15px_rgba(197,160,89,0.15)]' : 'border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/30'}`}>
                      <div 
                        className="absolute top-2 right-2 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isActive) {
                            const tagsToRemove = cat.subOptions.map(opt => opt.tag);
                            setFormData(prev => ({ 
                              ...prev, 
                              activeCategories: (prev.activeCategories || []).filter(id => id !== cat.id),
                              categories: (prev.categories || []).filter(tag => !tagsToRemove.includes(tag))
                            }));
                          } else {
                            setFormData(prev => ({ ...prev, activeCategories: [...(prev.activeCategories || []), cat.id] }));
                            setEditingMyCategory(cat.id);
                          }
                        }}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isActive ? 'border-mafia-gold bg-mafia-gold text-black' : 'border-white/30 bg-black/50 text-transparent hover:border-mafia-gold'}`}>
                          <Check size={14} className={isActive ? 'opacity-100' : 'opacity-0'} />
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-full ${cat.color.split(' ')[2]} ${isActive ? 'scale-110 transition-transform' : ''}`}><cat.icon size={24} className={cat.color.split(' ')[1]} /></div>
                      <div className="text-center">
                        <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-mafia-gold' : 'text-white'}`}>{cat.title[lang as 'cs' | 'en']}</div>
                        {selectedTagsCount > 0 && <div className="text-[9px] font-mono text-mafia-gold/70 mt-1">{selectedTagsCount} {lang === 'cs' ? 'štítků' : 'tags'}</div>}
                        {!isActive && <div className="text-[9px] font-mono text-white/30 mt-1">{lang === 'cs' ? 'Nezařazeno' : 'Not included'}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'basic' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="mb-6 p-4 border border-white/5 bg-black/20 rounded-lg">
                <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-mafia-gold" />
                  {lang === 'cs' ? 'Typ účtu (Kdo tento profil spravuje?)' : 'Account Type (Who manages this profile?)'}
                  <InfoTooltip text={lang === 'cs' ? 'Zvol si, jestli hledáš sám za sebe, jako pár, nebo skupina. Tím se přizpůsobí další otázky a také to, s kým tě budeme propojovat.' : 'Choose if you seek for yourself, as a couple, or a group. This adjusts the questions and who you match with.'} />
                </label>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {[
                    { id: 'individual', icon: User, label: lang === 'cs' ? 'Jednotlivec' : 'Individual' },
                    { id: 'couple', icon: Heart, label: lang === 'cs' ? 'Pár' : 'Couple' },
                    { id: 'family', icon: Users, label: lang === 'cs' ? 'Rodina' : 'Family' },
                    { id: 'group', icon: Users, label: lang === 'cs' ? 'Skupina' : 'Group' },
                    { id: 'pet', icon: PawPrint, label: lang === 'cs' ? 'Zvíře' : 'Pet' },
                    { id: 'property', icon: Home, label: lang === 'cs' ? 'Nemovitost' : 'Property' },
                    { id: 'object', icon: Leaf, label: lang === 'cs' ? 'Věc/Rostlina' : 'Object/Plant' },
                    { id: 'activity', icon: Calendar, label: lang === 'cs' ? 'Aktivita' : 'Activity' },
                    { id: 'job', icon: Briefcase, label: lang === 'cs' ? 'Práce/Služba' : 'Work/Service' }
                  ].map(type => {
                    const isSelected = (formData.accountType || 'individual') === type.id;
                    return (
                      <button
                        key={type.id} type="button"
                        onClick={() => setFormData({ ...formData, accountType: type.id as any })}
                        className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                          isSelected 
                            ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                            : 'border-white/10 bg-black/40 text-white/50 hover:bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <type.icon size={16} className={`${isSelected ? 'scale-110' : ''} transition-transform`} />
                        <span className="text-[10px] md:text-xs font-mono uppercase font-bold tracking-normal whitespace-nowrap">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                {['couple', 'family', 'group'].includes(formData.accountType || '') && (
                  <div className="mt-6 p-4 border border-white/5 bg-black/40 rounded-lg">
                    <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                      <Users size={14} className="text-mafia-gold" />
                      {lang === 'cs' ? 'Propojit s dalším účtem' : 'Link with another account'}
                      <InfoTooltip text={lang === 'cs' ? 'Zadej jméno, uživatelské jméno nebo e-mail člena, se kterým chceš sdílet tento profil. Takto propojení členové na sebe nenarazí v Matchmakeru.' : 'Enter the name, username or email of the member you want to share this profile with. Linked members won\'t see each other in the Matchmaker.'} />
                    </label>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex gap-2 w-full max-w-md">
                        <input 
                          type="text" 
                          value={newLinkedUser}
                          onChange={(e) => setNewLinkedUser(e.target.value)}
                          placeholder={lang === 'cs' ? 'Jméno nebo email člena...' : 'Member name or email...'}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mafia-gold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newLinkedUser.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                linkedUserIds: [...(prev.linkedUserIds || []), newLinkedUser.trim()]
                              }));
                              setNewLinkedUser("");
                            }
                          }}
                          className="bg-mafia-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-mafia-gold/80 transition-colors"
                        >
                          {lang === 'cs' ? 'Přidat' : 'Add'}
                        </button>
                      </div>
                      
                      {formData.linkedUserIds && formData.linkedUserIds.length > 0 && (
                        <div className="w-full max-w-md space-y-2">
                          <h5 className="text-white/40 text-[10px] font-mono uppercase tracking-widest text-left mb-2">{lang === 'cs' ? 'Propojení členové' : 'Linked members'}</h5>
                          {formData.linkedUserIds.map((userId, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                              <span className="text-white text-sm">{userId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    linkedUserIds: (prev.linkedUserIds || []).filter((_, i) => i !== idx)
                                  }));
                                }}
                                className="text-red-500 hover:text-red-400"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-white/5">
                  <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                    <Target size={14} className="text-mafia-gold" />
                    {lang === 'cs' ? 'Koho chceš vidět? (Vyber jednu nebo více)' : 'Who do you want to see? (Select one or more)'}
                    <InfoTooltip text={lang === 'cs' ? 'Algoritmus funguje oboustranně – pokud ten, koho hledáš, nehledá tvůj typ účtu, v Síti se navzájem neuvidíte.' : 'The algorithm works both ways – if who you seek isn’t seeking your account type, you won’t see each other in the Network.'} />
                  </label>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { value: "female", icon: User, label: lang === 'cs' ? 'Ženy' : 'Women' },
                      { value: "male", icon: User, label: lang === 'cs' ? 'Muže' : 'Men' },
                      { value: "couple", icon: Heart, label: lang === 'cs' ? 'Páry' : 'Couples' },
                      { value: "family", icon: Users, label: lang === 'cs' ? 'Rodiny' : 'Families' },
                      { value: "group", icon: Users, label: lang === 'cs' ? 'Skupiny' : 'Groups' },
                      { value: "pet", icon: PawPrint, label: lang === 'cs' ? 'Zvířata' : 'Pets' },
                      { value: "property", icon: Home, label: lang === 'cs' ? 'Nemovitosti' : 'Properties' },
                      { value: "object", icon: Leaf, label: lang === 'cs' ? 'Věci/Rostliny' : 'Objects/Plants' },
                      { value: "activity", icon: Calendar, label: lang === 'cs' ? 'Aktivity' : 'Activities' },
                      { value: "job", icon: Briefcase, label: lang === 'cs' ? 'Služby' : 'Services' },
                      { value: "both", icon: Sparkles, label: lang === 'cs' ? 'Lidi (Vše)' : 'People (All)' },
                      { value: "any", icon: Target, label: lang === 'cs' ? 'Úplně cokoliv' : 'Absolutely anything' }
                    ].map(opt => {
                      const currentSeeking = Array.isArray(formData.seeking) ? formData.seeking : [];
                      const isSelected = currentSeeking.includes(opt.value);
                      
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            let newSeeking = [...currentSeeking];
                            if (opt.value === 'both') {
                              newSeeking = ['both'];
                            } else {
                              newSeeking = newSeeking.filter(v => v !== 'both');
                              if (isSelected) {
                                newSeeking = newSeeking.filter(v => v !== opt.value);
                              } else {
                                newSeeking.push(opt.value);
                              }
                            }
                            setFormData({ ...formData, seeking: newSeeking });
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-sans rounded-full transition-all duration-300 border ${
                            isSelected 
                              ? 'border-mafia-gold bg-mafia-gold/20 text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                              : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-black/40'
                          }`}
                        >
                          <opt.icon size={14} className={isSelected ? 'text-mafia-gold' : 'text-white/40'} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg text-[10px] md:text-xs font-mono text-white/60 flex items-start gap-2 max-w-xl mx-auto">
                    <ShieldCheck size={14} className="text-mafia-gold shrink-0 mt-0.5" />
                    <p>{lang === 'cs' ? 'Důležité: Algoritmus zobrazuje shody vzájemně. Uvidíš jen ty uživatele (nebo skupiny), kteří mají aktivně nastaveno, že hledají právě tvůj typ účtu.' : 'Important: The algorithm matches mutually. You will only see users (or groups) who are actively looking for your account type.'}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-sm p-4 text-center rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div id="field-photos" className={`space-y-4 p-4 -mx-4 rounded-sm transition-colors duration-500 ${missingFields.includes('photos') ? 'bg-red-900/20 border border-red-500/50' : 'border border-transparent'}`}>
                <label className={`block text-xs font-mono uppercase tracking-widest flex items-center justify-between ${missingFields.includes('photos') ? 'text-red-400' : 'text-mafia-gold'}`}>
                  <span>{lang === 'cs' ? 'Fotografie *' : 'Photos *'}</span>
                  <span className="text-white/30 text-[10px]">{formData.photos.length} / 6</span>
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {formData.photos.map((photoUrl, idx) => (
                      <motion.div 
                        key={photoUrl + idx}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square border border-mafia-gold/30 bg-black/40 group overflow-hidden"
                      >
                        <img src={photoUrl} alt={`Upload ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <button type="button" onClick={() => removePhoto(idx)} className="absolute top-2 right-2 bg-black/60 text-white p-1 hover:text-red-500 hover:bg-black transition-colors z-20"><X size={14} /></button>
                        {idx === 0 && <div className="absolute bottom-0 left-0 w-full bg-mafia-gold/80 text-black text-[10px] font-mono text-center py-1 font-bold uppercase z-10">{lang === 'cs' ? 'Hlavní' : 'Main'}</div>}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {formData.photos.length < 6 && (
                    <div className="relative aspect-square border border-dashed border-white/20 hover:border-mafia-gold/50 bg-black/20 group cursor-pointer transition-colors flex flex-col items-center justify-center">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handlePhotoUpload} />
                      <ImagePlus size={24} className="text-white/30 group-hover:text-mafia-gold/70 mb-2 transition-colors" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-mafia-gold/70">{lang === 'cs' ? 'Přidat' : 'Add'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="field-name" className={`p-4 -mx-4 rounded-sm transition-colors duration-500 ${missingFields.includes('name') ? 'bg-red-900/20 border border-red-500/50' : 'border border-transparent'}`}>
                  <label className={`block text-xs font-mono uppercase tracking-widest mb-2 flex items-center ${missingFields.includes('name') ? 'text-red-400' : 'text-white/40'}`}>
                    {lang === 'cs' 
                      ? (formData.accountType === 'group' ? 'Název skupiny *' : formData.accountType === 'couple' ? 'Vaše jména *' : formData.accountType === 'family' ? 'Název rodiny *' : formData.accountType === 'pet' ? 'Jméno zvířete *' : formData.accountType === 'activity' ? 'Název akce / plánu *' : formData.accountType === 'job' ? 'Název služby / práce *' : formData.accountType === 'object' ? 'Co nabízíš / hledáš (Věc/Rostlina) *' : formData.accountType === 'property' ? 'Název Komunity (Místa) *' : 'Jméno / Přezdívka *') 
                      : (formData.accountType === 'group' ? 'Group Name *' : formData.accountType === 'couple' ? 'Your Names *' : formData.accountType === 'family' ? 'Family Name *' : formData.accountType === 'pet' ? 'Pet Name *' : formData.accountType === 'activity' ? 'Event / Plan Name *' : formData.accountType === 'job' ? 'Service / Job Name *' : formData.accountType === 'object' ? 'What (Object/Plant) *' : formData.accountType === 'property' ? 'Community (Place) Name *' : 'Name / Nickname *')}
                    <InfoTooltip text={lang === 'cs' ? 'Jak se chceš v Matchmakeru prezentovat.' : 'How you want to present yourself in the Matchmaker.'} />
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                      {['family', 'group'].includes(formData.accountType || '') ? <Users size={16} /> : formData.accountType === 'couple' ? <Heart size={16} /> : <User size={16} />}
                    </div>
                    <input
                      type="text" value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (missingFields.includes('name')) { setMissingFields(prev => prev.filter(f => f !== 'name')); setError(""); } }}
                      className={`w-full bg-black/40 border py-3 pl-12 pr-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors font-sans text-sm ${missingFields.includes('name') ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-mafia-gold'}`}
                      placeholder={lang === 'cs' 
                        ? (formData.accountType === 'group' ? 'Název vaší skupiny' : formData.accountType === 'couple' ? 'Karel a Jana' : formData.accountType === 'family' ? 'Rodina Novákova' : formData.accountType === 'property' ? 'Např. Ulice Mírová 44' : 'Tvé jméno') 
                        : (formData.accountType === 'group' ? 'Your group name' : formData.accountType === 'couple' ? 'Carl and Jane' : formData.accountType === 'family' ? 'The Smiths' : formData.accountType === 'property' ? 'e.g. Baker Street 221B' : 'Your name')}
                    />
                  </div>
                </div>

                {(!formData.accountType || formData.accountType === 'individual') && (
                  <>
                    <div className="p-4 -mx-4 rounded-sm border border-transparent">
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">
                        {lang === 'cs' ? 'Příjmení (Volitelné)' : 'Last Name (Optional)'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                          <User size={16} />
                        </div>
                        <input
                          type="text" value={formData.lastName || ''}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus:border-mafia-gold transition-colors font-sans text-sm"
                          placeholder={lang === 'cs' ? 'Např. Novák' : 'e.g. Smith'}
                        />
                      </div>
                    </div>

                    <div className="p-4 -mx-4 rounded-sm border border-transparent">
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">
                        {lang === 'cs' ? 'Přezdívka (Volitelné)' : 'Nickname (Optional)'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                          <span className="font-serif italic font-bold">"</span>
                        </div>
                        <input
                          type="text" value={formData.nickname || ''}
                          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus:border-mafia-gold transition-colors font-sans text-sm"
                          placeholder={lang === 'cs' ? 'Např. Rychlonožka' : 'e.g. Speedy'}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div id="field-age" className={`p-4 -mx-4 rounded-sm transition-colors duration-500 ${missingFields.includes('age') ? 'bg-red-900/20 border border-red-500/50' : 'border border-transparent'}`}>
                  <label className={`block text-xs font-mono uppercase tracking-widest mb-2 flex items-center ${missingFields.includes('age') ? 'text-red-400' : 'text-white/40'}`}>
                    {lang === 'cs' 
                      ? (formData.accountType === 'group' ? 'Věkové rozmezí (např. 20-30) *' : formData.accountType === 'couple' ? 'Váš věk (např. 25 a 27) *' : formData.accountType === 'family' ? 'Průměrný věk (dospělí) *' : formData.accountType === 'pet' ? 'Věk zvířete *' : 'Datum narození *') 
                      : (formData.accountType === 'group' ? 'Age range (e.g. 20-30) *' : formData.accountType === 'couple' ? 'Your ages (e.g. 25 and 27) *' : formData.accountType === 'family' ? 'Average age (adults) *' : formData.accountType === 'pet' ? 'Pet Age *' : 'Date of Birth *')}
                    <InfoTooltip text={lang === 'cs' ? 'Pomáhá algoritmu spojit tě s lidmi v odpovídajícím věku a určit znamení.' : 'Helps the algorithm match you with people of appropriate age and determine zodiac.'} />
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20"><Calendar size={16} /></div>
                    {(!formData.accountType || formData.accountType === 'individual') ? (
                      <input
                        type="date" max="2010-01-01" value={formData.birthDate || ''}
                        onChange={(e) => handleBirthDateChange(e.target.value)}
                        className={`w-full bg-black/40 border py-3 pl-12 pr-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors font-sans text-sm ${missingFields.includes('age') ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-mafia-gold'}`}
                      />
                    ) : (
                      <input
                        type="text" value={formData.age}
                        onChange={(e) => { setFormData({ ...formData, age: e.target.value }); if (missingFields.includes('age')) { setMissingFields(prev => prev.filter(f => f !== 'age')); setError(""); } }}
                        className={`w-full bg-black/40 border py-3 pl-12 pr-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors font-sans text-sm ${missingFields.includes('age') ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-mafia-gold'}`}
                        placeholder="Např. 25"
                      />
                    )}
                  </div>
                  {(!formData.accountType || formData.accountType === 'individual') && formData.age && (
                    <div className="text-white/40 text-[10px] mt-1 italic pl-2">
                      {lang === 'cs' ? `Vypočítaný věk: ${formData.age} let` : `Calculated age: ${formData.age} years`}
                    </div>
                  )}
                </div>

                {(!formData.accountType || formData.accountType === 'individual') && (
                  <>
                    <div id="field-gender">
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center">
                        {lang === 'cs' ? 'Jsem *' : 'I am *'}
                        <InfoTooltip text={lang === 'cs' ? 'Důležité pro to, abychom tě správně zařadili do vyhledávání.' : 'Important for us to place you correctly in searches.'} />
                      </label>
                      <CustomSelect
                        value={formData.gender}
                        onChange={(val) => setFormData({ ...formData, gender: val })}
                        placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'}
                        options={[
                          { value: "male", label: lang === 'cs' ? 'Muž' : 'Man' },
                          { value: "female", label: lang === 'cs' ? 'Žena' : 'Woman' },
                          { value: "other", label: lang === 'cs' ? 'Nechci uvádět (Tajný agent)' : 'Prefer not to say (Secret Agent)' }
                        ]}
                      />
                    </div>

                    <div id="field-zodiac">
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center">
                        {lang === 'cs' ? 'Znamení' : 'Zodiac'}
                        <InfoTooltip text={lang === 'cs' ? 'Klíčové pro astroligický algoritmus shody.' : 'Key for astrological match algorithm.'} />
                      </label>
                      <CustomSelect
                        value={formData.zodiac || ""}
                        onChange={(val) => setFormData({ ...formData, zodiac: val })}
                        placeholder={lang === 'cs' ? 'Zvolte znamení...' : 'Select zodiac...'}
                        options={[
                          { value: "aries", label: lang === 'cs' ? 'Beran' : 'Aries' },
                          { value: "taurus", label: lang === 'cs' ? 'Býk' : 'Taurus' },
                          { value: "gemini", label: lang === 'cs' ? 'Blíženci' : 'Gemini' },
                          { value: "cancer", label: lang === 'cs' ? 'Rak' : 'Cancer' },
                          { value: "leo", label: lang === 'cs' ? 'Lev' : 'Leo' },
                          { value: "virgo", label: lang === 'cs' ? 'Panna' : 'Virgo' },
                          { value: "libra", label: lang === 'cs' ? 'Váhy' : 'Libra' },
                          { value: "scorpio", label: lang === 'cs' ? 'Štír' : 'Scorpio' },
                          { value: "sagittarius", label: lang === 'cs' ? 'Střelec' : 'Sagittarius' },
                          { value: "capricorn", label: lang === 'cs' ? 'Kozoroh' : 'Capricorn' },
                          { value: "aquarius", label: lang === 'cs' ? 'Vodnář' : 'Aquarius' },
                          { value: "pisces", label: lang === 'cs' ? 'Ryby' : 'Pisces' }
                        ]}
                      />
                    </div>

                    <div id="field-height">
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center">
                        {lang === 'cs' ? 'Výška (cm)' : 'Height (cm)'}
                        <InfoTooltip text={lang === 'cs' ? 'Pomáhá ostatním získat lepší představu.' : 'Helps others get a better picture.'} />
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20"><Ruler size={16} /></div>
                        <input type="number" min="100" max="250" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="w-full bg-black/40 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus:border-mafia-gold transition-colors font-sans text-sm" placeholder="180" />
                      </div>
                    </div>
                  </>
                )}

                <div className="col-span-1 md:col-span-2 pt-6 border-t border-white/5 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm flex items-center gap-2">
                      <MapPin size={16} />
                      {lang === 'cs' ? 'Místa výskytu (Až 2 lokace)' : 'Locations (Up to 2)'}
                    </h4>
                    {(formData.locations || []).length < 2 && (
                      <button type="button" onClick={() => setFormData({ ...formData, locations: [...(formData.locations || []), { city: '', radiusKm: 20 }] })} className="px-3 py-1.5 bg-mafia-gold/10 text-mafia-gold hover:bg-mafia-gold hover:text-black transition-colors font-mono text-[10px] uppercase font-bold rounded-md border border-mafia-gold/30 flex items-center gap-1">
                        <Plus size={12} /> {lang === 'cs' ? 'Přidat' : 'Add'}
                      </button>
                    )}
                  </div>
                  
                  {(!formData.locations || formData.locations.length === 0) ? (
                    <div className="p-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center">
                      <p className="text-white/40 text-xs font-mono mb-2">{lang === 'cs' ? 'Zatím nemáš zadanou žádnou lokaci.' : 'No locations added yet.'}</p>
                      <button type="button" onClick={() => setFormData({ ...formData, locations: [{ city: '', radiusKm: 20 }] })} className="text-mafia-gold text-xs underline">
                        {lang === 'cs' ? 'Přidat hlavní lokaci' : 'Add main location'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.locations.map((loc, idx) => (
                        <div key={idx} className="p-4 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl relative transition-all">
                          <button type="button" onClick={() => {
                            const newLocs = [...formData.locations!];
                            newLocs.splice(idx, 1);
                            setFormData({ ...formData, locations: newLocs });
                          }} className="absolute top-2 right-2 p-1 text-white/30 hover:text-red-500 transition-colors"><X size={14} /></button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">{lang === 'cs' ? 'Město' : 'City'}</label>
                              <input 
                                type="text" value={loc.city} 
                                onChange={(e) => {
                                  const newLocs = [...formData.locations!];
                                  newLocs[idx] = { ...loc, city: e.target.value };
                                  setFormData({ ...formData, locations: newLocs });
                                }} 
                                className="w-full bg-black/50 border border-white/10 rounded-sm py-2 px-3 text-white focus:outline-none focus:border-mafia-gold hover:border-white/30 transition-all text-sm shadow-inner"
                                placeholder={lang === 'cs' ? 'Např. Praha' : 'e.g. Prague'} 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-white/40 uppercase mb-1 flex justify-between">
                                <span>{lang === 'cs' ? 'Okruh hledání' : 'Search Radius'}</span>
                                <span className="text-mafia-gold font-bold">{loc.radiusKm >= 100 ? (lang === 'cs' ? 'Celá ČR / Neomezeně' : 'Unlimited') : `+ ${loc.radiusKm} km`}</span>
                              </label>
                              <input 
                                type="range" min="5" max="100" step="5" value={loc.radiusKm} 
                                onChange={(e) => {
                                  const newLocs = [...formData.locations!];
                                  newLocs[idx] = { ...loc, radiusKm: parseInt(e.target.value) };
                                  setFormData({ ...formData, locations: newLocs });
                                }} 
                                className="w-full mt-2 accent-mafia-gold" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Location privacy removed and moved to UserSettings */}
                </div>                {formData.accountType && formData.accountType !== 'individual' && formData.accountType !== 'pet' && (
                  <div className="col-span-1 md:col-span-2 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm flex items-center gap-2">
                        <Users size={16} />
                        {lang === 'cs' ? 'Členové profilu' : 'Profile Members'}
                      </h4>
                      <button type="button" onClick={openNewMemberModal} className="px-4 py-2 bg-mafia-gold/10 text-mafia-gold hover:bg-mafia-gold hover:text-black transition-colors font-mono text-xs uppercase font-bold rounded-lg border border-mafia-gold/30">
                        {lang === 'cs' ? '+ Přidat člena' : '+ Add Member'}
                      </button>
                    </div>
                    
                    {(formData.members && formData.members.length > 0) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.members.map(member => (
                          <div key={member.id} className="p-4 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl flex justify-between items-center transition-all">
                            <div>
                              <div className="font-bold text-white text-sm">{member.name} <span className="text-white/50 text-xs font-mono font-normal">({member.age})</span></div>
                              <div className="text-white/40 text-xs mt-1">{member.gender === 'male' ? (lang === 'cs' ? 'Muž' : 'Man') : member.gender === 'female' ? (lang === 'cs' ? 'Žena' : 'Woman') : ''} • {member.height} cm</div>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => handleEditMember(member.id)} className="p-2 text-white/40 hover:text-mafia-gold bg-white/5 hover:bg-mafia-gold/10 rounded-full transition-colors"><User size={14} /></button>
                              <button type="button" onClick={() => handleDeleteMember(member.id)} className="p-2 text-white/40 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-full transition-colors"><X size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center">
                        <Users size={24} className="text-white/20 mb-3" />
                        <p className="text-white/40 text-xs font-mono">{lang === 'cs' ? 'Zatím jste nepřidali žádné členy.' : 'No members added yet.'}</p>
                        <p className="text-white/30 text-[10px] mt-1">{lang === 'cs' ? 'Přidejte členy, aby ostatní viděli, kdo tvoří váš profil.' : 'Add members so others can see who is in your profile.'}</p>
                      </div>
                    )}
                  </div>
                )}
                {formData.accountType === 'pet' && (
                  <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center">
                        {lang === 'cs' ? 'Druh zvířete *' : 'Pet Type *'}
                      </label>
                      <CustomSelect
                        value={(formData.pets && formData.pets.length > 0) ? formData.pets[0].type : 'dog'}
                        onChange={(val) => {
                          const currentPet = formData.pets?.[0] || { id: 'main', type: 'dog', breed: '', purpose: 'none' };
                          setFormData({ ...formData, pets: [{ ...currentPet, type: val }] });
                        }}
                        placeholder={lang === 'cs' ? 'Druh...' : 'Type...'}
                        options={ANIMAL_TYPES.map(t => ({ value: t.id, label: `${t.icon} ${t.label[lang as 'cs' | 'en']}` }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center">
                        {lang === 'cs' ? 'Plemeno' : 'Breed'}
                      </label>
                      <input
                        type="text"
                        value={(formData.pets && formData.pets.length > 0) ? formData.pets[0].breed || '' : ''}
                        onChange={(e) => {
                          const currentPet = formData.pets?.[0] || { id: 'main', type: 'dog', breed: '', purpose: 'none' };
                          setFormData({ ...formData, pets: [{ ...currentPet, breed: e.target.value }] });
                        }}
                        className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus:border-mafia-gold transition-colors font-sans text-sm"
                        placeholder={lang === 'cs' ? 'Např. Zlatý retrívr' : 'e.g. Golden Retriever'}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center">
                        {lang === 'cs' ? 'Proč tu zvíře je?' : 'Purpose on app?'}
                      </label>
                      <CustomSelect
                        value={(formData.pets && formData.pets.length > 0) ? formData.pets[0].purpose || 'none' : 'none'}
                        onChange={(val) => {
                          const currentPet = formData.pets?.[0] || { id: 'main', type: 'dog', breed: '', purpose: 'none' };
                          setFormData({ ...formData, pets: [{ ...currentPet, purpose: val }] });
                        }}
                        placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'}
                        options={[
                          { value: 'none', label: lang === 'cs' ? 'Jen se chceme ukázat' : 'Just to show off' },
                          { value: 'walk', label: lang === 'cs' ? 'Hledáme parťáka na venčení' : 'Looking for walking buddy' },
                          { value: 'breed', label: lang === 'cs' ? 'Hledáme partnera k páření / křížení' : 'Looking for mating partner' }
                        ]}
                      />
                    </div>
                  </div>
                )}
                {formData.accountType === 'property' && (
                  <div className="pt-6 border-t border-white/5 grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Home size={14} className="text-mafia-gold" />
                        {lang === 'cs' ? 'Typ komunity (Nemovitosti) *' : 'Community Type (Property) *'}
                      </label>
                      <CustomSelect
                        value={formData.communityType || 'building'}
                        onChange={(val) => setFormData({ ...formData, communityType: val as any })}
                        placeholder={lang === 'cs' ? 'Typ komunity...' : 'Community Type...'}
                        options={[
                          { value: 'entrance', label: lang === 'cs' ? 'Vchod (Méně lidí, společná chodba)' : 'Entrance (Few people, shared hall)' },
                          { value: 'building', label: lang === 'cs' ? 'Celá Budova / Bytový dům' : 'Building / Apartment Block' },
                          { value: 'street', label: lang === 'cs' ? 'Ulice / Sousedství' : 'Street / Neighborhood' },
                          { value: 'neighborhood', label: lang === 'cs' ? 'Čtvrť' : 'City District / Quarter' }
                        ]}
                      />
                      <p className="text-[10px] font-mono text-white/30 mt-2">
                        {lang === 'cs' ? 'Ostatní mohou požádat o vstup do této komunity. Po tvém schválení získají přístup do společného chatu.' : 'Others can request to join this community. Upon approval, they get access to the group chat.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(!formData.accountType || formData.accountType === 'individual') && (
                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm mb-4">
                    {lang === 'cs' ? 'Můj vzhled' : 'My Appearance'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Vlasy' : 'Hair'}</label>
                      <CustomSelect value={formData.myHair || ""} onChange={(val) => setFormData({ ...formData, myHair: val })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "secret", label: lang === 'cs' ? 'Nechci uvádět' : 'Rather not say' }, { value: "blonde", label: lang === 'cs' ? 'Blond' : 'Blonde' }, { value: "brunette", label: lang === 'cs' ? 'Bruneta / Hnědé' : 'Brunette / Brown' }, { value: "black", label: lang === 'cs' ? 'Černé' : 'Black' }, { value: "red", label: lang === 'cs' ? 'Zrzavé' : 'Red' }, { value: "colored", label: lang === 'cs' ? 'Barevné' : 'Colored' }, { value: "bald", label: lang === 'cs' ? 'Holohlavý / Bez vlasů' : 'Bald' }]} />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Postava' : 'Body Type'}</label>
                      <CustomSelect value={formData.myBodyType || ""} onChange={(val) => setFormData({ ...formData, myBodyType: val })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "secret", label: lang === 'cs' ? 'Nechci uvádět' : 'Rather not say' }, { value: "slim", label: lang === 'cs' ? 'Štíhlá' : 'Slim' }, { value: "athletic", label: lang === 'cs' ? 'Sportovní' : 'Athletic' }, { value: "average", label: lang === 'cs' ? 'Normální' : 'Average' }, { value: "curvy", label: lang === 'cs' ? 'Plnější / Křivky' : 'Curvy / Plus size' }, { value: "muscular", label: lang === 'cs' ? 'Svalnatá' : 'Muscular' }]} />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Oči' : 'Eyes'}</label>
                      <CustomSelect value={formData.myEyeColor || ""} onChange={(val) => setFormData({ ...formData, myEyeColor: val })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "secret", label: lang === 'cs' ? 'Nechci uvádět' : 'Rather not say' }, { value: "blue", label: lang === 'cs' ? 'Modré' : 'Blue' }, { value: "green", label: lang === 'cs' ? 'Zelené' : 'Green' }, { value: "brown", label: lang === 'cs' ? 'Hnědé' : 'Brown' }, { value: "grey", label: lang === 'cs' ? 'Šedé' : 'Grey' }, { value: "other", label: lang === 'cs' ? 'Jiné' : 'Other' }]} />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center mb-6">
                <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg mb-2">
                  {lang === 'cs' ? 'Co dalšího o sobě prozradíš?' : 'What else will you reveal?'}
                </h4>
                <p className="text-white/50 text-xs font-mono max-w-md mx-auto">
                  {lang === 'cs' ? 'Vyplnění těchto sekcí není povinné, ale čím víc toho o sobě prozradíš, tím lepší shody ti algoritmus najde.' : 'These sections are optional, but the more you reveal, the better matches the algorithm finds.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'physical', icon: Eye, label: lang === 'cs' ? 'Vzhled a tělo' : 'Appearance', desc: lang === 'cs' ? 'Jak vypadám a co mě přitahuje' : 'How I look and what I like' },
                  { id: 'character', icon: Brain, label: lang === 'cs' ? 'Charakter' : 'Character', desc: lang === 'cs' ? 'Moje povaha a vlastnosti' : 'My personality traits' },
                  { id: 'lifestyle', icon: Activity, label: lang === 'cs' ? 'Životní styl' : 'Lifestyle', desc: lang === 'cs' ? 'Jak trávím volný čas' : 'How I spend my time' },
                  { id: 'love', icon: Heart, label: lang === 'cs' ? 'Láska a vztah' : 'Love & Relationship', desc: lang === 'cs' ? 'Co od vztahu očekávám' : 'What I expect from a relationship' },
                  { id: 'future', icon: Target, label: lang === 'cs' ? 'Budoucnost' : 'Future Plans', desc: lang === 'cs' ? 'Děti, svatba a životní cíle' : 'Kids, marriage and goals' },
                  { id: 'values', icon: Scale, label: lang === 'cs' ? 'Hodnoty a peníze' : 'Values & Money', desc: lang === 'cs' ? 'Životní standard a víra' : 'Living standard and faith' },
                  { id: 'communication', icon: MessageSquare, label: lang === 'cs' ? 'Komunikace' : 'Communication', desc: lang === 'cs' ? 'Řešení konfliktů' : 'Conflict resolution' },
                  { id: 'intimacy', icon: Flame, label: lang === 'cs' ? 'Intimita a emoce' : 'Intimacy & Emotion', desc: lang === 'cs' ? 'Citové vazby a potřeby' : 'Emotional attachments' },
                  { id: 'intellect', icon: Brain, label: lang === 'cs' ? 'Intelekt' : 'Intellect', desc: lang === 'cs' ? 'Způsob rozhodování' : 'Decision making style' },
                  { id: 'boundaries', icon: ShieldCheck, label: lang === 'cs' ? 'Hranice' : 'Boundaries', desc: lang === 'cs' ? 'Vztahové limity a nevěra' : 'Relationship limits & infidelity' }
                ].map(mod => {
                  if (!isDating && mod.id !== 'physical') return null;
                  const isActive = (formData.activeModules || []).includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => {
                        const newModules = isActive 
                          ? (formData.activeModules || []).filter(m => m !== mod.id)
                          : [...(formData.activeModules || []), mod.id];
                        setFormData({ ...formData, activeModules: newModules });
                      }}
                      className={`flex items-start gap-4 p-4 border rounded-xl text-left transition-all ${
                        isActive
                          ? 'border-mafia-gold bg-mafia-gold/10'
                          : 'border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className={`p-3 rounded-full shrink-0 ${isActive ? 'bg-mafia-gold text-black' : 'bg-white/5 text-white/40'}`}>
                        <mod.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-heading font-black uppercase tracking-widest text-sm mb-1 ${isActive ? 'text-mafia-gold' : 'text-white'}`}>{mod.label}</div>
                        <div className="text-[10px] font-mono text-white/40">{mod.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-2 ${isActive ? 'border-mafia-gold bg-mafia-gold text-black' : 'border-white/30 bg-black/50 text-transparent'}`}>
                        <Check size={14} className={isActive ? 'opacity-100' : 'opacity-0'} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Nové: Psychologické testy (Accordion) */}
              <div className="mt-12 border-t border-white/10 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsPsychologyExpanded(!isPsychologyExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-mafia-dark border border-mafia-gold/30 rounded-xl hover:bg-mafia-gold/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-mafia-gold/20 rounded-full text-mafia-gold">
                      <Brain size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">
                        {lang === 'cs' ? 'Psychologický profil' : 'Psychological Profile'}
                      </h4>
                      <p className="text-white/50 text-[10px] font-mono">
                        {lang === 'cs' ? 'Doplňující testy pro maximální shodu' : 'Additional tests for maximum match'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-mafia-gold transition-transform duration-300 ${isPsychologyExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight size={24} />
                  </div>
                </button>

                <AnimatePresence>
                  {isPsychologyExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="text-center mb-6">
                        <p className="text-white/50 text-xs font-mono max-w-md mx-auto">
                          {lang === 'cs' 
                            ? 'Vyplň svůj typ, nebo si udělej náš rychlý test. Pomůže nám to najít ti perfektní shodu na hlubší úrovni.' 
                            : 'Select your type or take our quick test to help us find you a perfect match on a deeper level.'}
                        </p>
                      </div>

                <div className="space-y-4">
                  {/* MBTI */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'MBTI Typologie (16 osobností)' : 'MBTI Typology (16 personalities)'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.mbti ? `${lang === 'cs' ? 'Tvůj výsledek:' : 'Your result:'} ${formData.mbti}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.mbti || ""}
                        onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber typ...' : 'Select type...'}</option>
                        {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(MBTI_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Jazyky Lásky */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? '5 Jazyků Lásky' : '5 Love Languages'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.loveLanguages?.[0] ? `${lang === 'cs' ? 'Tvůj primární:' : 'Your primary:'} ${formData.loveLanguages[0]}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.loveLanguages?.[0] || ""}
                        onChange={(e) => setFormData({ ...formData, loveLanguages: [e.target.value] })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber jazyk...' : 'Select language...'}</option>
                        {['Slova ujištění', 'Pozornost', 'Dárky', 'Skutky', 'Fyzický kontakt'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(LOVE_LANGUAGE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Typ Citové vazby */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Typ citové vazby' : 'Attachment Style'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.attachmentStyle ? `${lang === 'cs' ? 'Tvůj styl:' : 'Your style:'} ${formData.attachmentStyle}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.attachmentStyle || ""}
                        onChange={(e) => setFormData({ ...formData, attachmentStyle: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber styl...' : 'Select style...'}</option>
                        {['Bezpečná', 'Úzkostná', 'Vyhýbavá', 'Desorganizovaná'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(ATTACHMENT_STYLE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Chronotyp */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Chronotyp (Spánek a Energie)' : 'Chronotype'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.chronotype ? `${lang === 'cs' ? 'Tvůj chronotyp:' : 'Your chronotype:'} ${formData.chronotype}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.chronotype || ""}
                        onChange={(e) => setFormData({ ...formData, chronotype: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber typ...' : 'Select type...'}</option>
                        {['Ranní skřivan', 'Noční sova', 'Medvěd', 'Delfín'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(CHRONOTYPE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Temperament */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Temperament' : 'Temperament'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.temperament ? `${lang === 'cs' ? 'Tvůj temperament:' : 'Your temperament:'} ${formData.temperament}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.temperament || ""}
                        onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber typ...' : 'Select type...'}</option>
                        {['Sangvinik', 'Cholerik', 'Flegmatik', 'Melancholik'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(TEMPERAMENT_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Enneagram */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Enneagram' : 'Enneagram'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.enneagram ? `${lang === 'cs' ? 'Tvůj výsledek:' : 'Your result:'} ${formData.enneagram}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.enneagram || ""}
                        onChange={(e) => setFormData({ ...formData, enneagram: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber typ...' : 'Select type...'}</option>
                        {['Typ 1 (Perfekcionista)', 'Typ 2 (Dárce)', 'Typ 3 (Dosahovač)', 'Typ 4 (Individualista)', 'Typ 5 (Pozorovatel)', 'Typ 6 (Loajalista)', 'Typ 7 (Epikurejec)', 'Typ 8 (Bojovník)', 'Typ 9 (Mírotvůrce)'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(ENNEAGRAM_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>
                  {/* Způsob řešení konfliktů */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Řešení konfliktů' : 'Conflict Style'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.conflictStyle ? `${lang === 'cs' ? 'Tvůj styl:' : 'Your style:'} ${formData.conflictStyle}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.conflictStyle || ""}
                        onChange={(e) => setFormData({ ...formData, conflictStyle: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber styl...' : 'Select style...'}</option>
                        {['Vyhýbavý (Avoidant)', 'Soutěživý (Competitive)', 'Přizpůsobivý (Accommodating)', 'Kompromisní (Compromising)', 'Spolupracující (Collaborative)'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(CONFLICT_STYLE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Jazyk omluvy */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Jazyk omluvy' : 'Apology Language'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.apologyLanguage ? `${lang === 'cs' ? 'Tvůj jazyk:' : 'Your language:'} ${formData.apologyLanguage}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.apologyLanguage || ""}
                        onChange={(e) => setFormData({ ...formData, apologyLanguage: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber jazyk...' : 'Select language...'}</option>
                        {['Vyjádření lítosti', 'Přijetí zodpovědnosti', 'Nabídka nápravy', 'Upřímné pokání', 'Žádost o odpuštění'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(APOLOGY_LANGUAGE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Dominantní hemisféra */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Dominantní hemisféra' : 'Brain Hemisphere'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.brainHemisphere ? `${lang === 'cs' ? 'Tvůj výsledek:' : 'Your result:'} ${formData.brainHemisphere}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.brainHemisphere || ""}
                        onChange={(e) => setFormData({ ...formData, brainHemisphere: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber typ...' : 'Select type...'}</option>
                        {['Levá hemisféra (Logika)', 'Pravá hemisféra (Kreativita)'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(BRAIN_HEMISPHERE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Intimní dynamika */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Intimní dynamika' : 'Intimacy Dynamic'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.intimacyDynamic ? `${lang === 'cs' ? 'Tvůj archetyp:' : 'Your archetype:'} ${formData.intimacyDynamic}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.intimacyDynamic || ""}
                        onChange={(e) => setFormData({ ...formData, intimacyDynamic: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber typ...' : 'Select type...'}</option>
                        {['Dominantní', 'Submisivní', 'Přepínač (Switch)', 'Pečující (Giver)', 'Průzkumník'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(INTIMACY_DYNAMIC_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Styl lásky */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Styl lásky (Lee)' : 'Love Style'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.loveStyle ? `${lang === 'cs' ? 'Tvůj styl:' : 'Your style:'} ${formData.loveStyle}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.loveStyle || ""}
                        onChange={(e) => setFormData({ ...formData, loveStyle: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber styl...' : 'Select style...'}</option>
                        {['Eros (Romantická)', 'Storge (Přátelská)', 'Ludus (Hravá)', 'Pragma (Logická)', 'Agape (Obětavá)'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(LOVE_STYLE_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                  {/* Temná triáda */}
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">
                        {lang === 'cs' ? 'Temná triáda' : 'Dark Triad'}
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        {formData.darkTriad ? `${lang === 'cs' ? 'Tvůj profil:' : 'Your profile:'} ${formData.darkTriad}` : (lang === 'cs' ? 'Zatím nevyplněno' : 'Not filled yet')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.darkTriad || ""}
                        onChange={(e) => setFormData({ ...formData, darkTriad: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                      >
                        <option value="">{lang === 'cs' ? 'Vyber profil...' : 'Select profile...'}</option>
                        {['Nezávislý rebel', 'Charismatický stratég', 'Středobod vesmíru', 'Běžný smrtelník'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setActiveQuiz(DARK_TRIAD_QUIZ)}
                        className="px-4 py-2 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-white hover:text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        {lang === 'cs' ? 'Spustit Test' : 'Take Test'}
                      </button>
                    </div>
                  </div>

                </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {activeQuiz && (
                <PsychologyQuiz
                  quiz={activeQuiz}
                  onClose={() => setActiveQuiz(null)}
                  onComplete={(result) => {
                    if (activeQuiz.id === 'mbti') setFormData({ ...formData, mbti: result });
                    if (activeQuiz.id === 'lovelang') setFormData({ ...formData, loveLanguages: [result] });
                    if (activeQuiz.id === 'attachment') setFormData({ ...formData, attachmentStyle: result });
                    if (activeQuiz.id === 'chronotype') setFormData({ ...formData, chronotype: result });
                    if (activeQuiz.id === 'temperament') setFormData({ ...formData, temperament: result });
                    if (activeQuiz.id === 'enneagram') setFormData({ ...formData, enneagram: result });
                    if (activeQuiz.id === 'conflictStyle') setFormData({ ...formData, conflictStyle: result });
                    if (activeQuiz.id === 'apologyLanguage') setFormData({ ...formData, apologyLanguage: result });
                    if (activeQuiz.id === 'brainHemisphere') setFormData({ ...formData, brainHemisphere: result });
                    if (activeQuiz.id === 'intimacyDynamic') setFormData({ ...formData, intimacyDynamic: result });
                    if (activeQuiz.id === 'loveStyle') setFormData({ ...formData, loveStyle: result });
                    if (activeQuiz.id === 'darkTriad') setFormData({ ...formData, darkTriad: result });
                    if (activeQuiz.id === 'spontaneity') setFormData({ ...formData, spontaneityLevel: result });
                    if (activeQuiz.id === 'infidelityBoundary') setFormData({ ...formData, infidelityDefinition: result });
                    setActiveQuiz(null);
                  }}
                />
              )}
            </motion.div>
          )}


{activeTab === 'physical' && <Step2Physical formData={formData} setFormData={setFormData} lang={lang} />}
          {activeTab === 'character' && (
              <div className="space-y-8">
                <Step3Character formData={formData} setFormData={setFormData} lang={lang} />
                <div className="p-4 border border-white/10 bg-black/40 rounded-xl">
                  <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-2">{lang === 'cs' ? 'Na čem bych chtěl/a zapracovat' : 'Self-Improvement Areas'}</div>
                  <div className="text-[10px] font-mono text-white/50 mb-4">{lang === 'cs' ? 'Vyber vlastnosti, na kterých aktivně pracuješ.' : 'Select traits you are actively working on.'}</div>
                  <div className="flex flex-wrap gap-2">
                    {['Trpělivost', 'Komunikace', 'Sebevědomí', 'Naslouchání', 'Zranitelnost', 'Time-management', 'Asertivita'].map(trait => (
                      <button
                        key={trait}
                        onClick={() => {
                          const current = formData.selfImprovementAreas || [];
                          if (current.includes(trait)) {
                            setFormData({ ...formData, selfImprovementAreas: current.filter(t => t !== trait) });
                          } else {
                            if (current.length < 3) setFormData({ ...formData, selfImprovementAreas: [...current, trait] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${(formData.selfImprovementAreas || []).includes(trait) ? 'bg-mafia-gold text-black' : 'bg-black/50 border border-white/20 text-white hover:border-mafia-gold/50'}`}
                      >
                        {trait}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          {activeTab === 'lifestyle' && (
              <div className="space-y-8">
                <Step4Lifestyle formData={formData} setFormData={setFormData} lang={lang} />
                <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Spontánnost vs. Plánování' : 'Spontaneity vs. Planning'}</div>
                    <div className="text-[10px] font-mono text-white/50">{formData.spontaneityLevel ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.spontaneityLevel}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                  </div>
                  <button type="button" onClick={() => setActiveQuiz(SPONTANEITY_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                    {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                  </button>
                </div>
              </div>
            )}
          {activeTab === 'love' && <Step5CommLove formData={formData} setFormData={setFormData} lang={lang} />}
          {activeTab === 'future' && <Step6FutureKids formData={formData} setFormData={setFormData} lang={lang} />}
            {activeTab === 'values' && <Step7ValuesMoney formData={formData} setFormData={setFormData} lang={lang} />}
            {activeTab === 'communication' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-mafia-gold mb-2">{lang === 'cs' ? 'Komunikace a Konflikt' : 'Communication'}</h3>
                  <p className="text-xs font-mono text-white/50">{lang === 'cs' ? 'Jak řešíš problémy a nedorozumění?' : 'How do you handle conflict?'}</p>
                </div>
                <div className="space-y-6">
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Styl Řešení konfliktů' : 'Conflict Style'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.conflictStyle ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.conflictStyle}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(CONFLICT_STYLE_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Jazyk Omluvy' : 'Apology Language'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.apologyLanguage ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.apologyLanguage}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(APOLOGY_LANGUAGE_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'intimacy' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-mafia-gold mb-2">{lang === 'cs' ? 'Emoce a Intimita' : 'Emotion & Intimacy'}</h3>
                  <p className="text-xs font-mono text-white/50">{lang === 'cs' ? 'Tvoje citové potřeby a hluboké vazby.' : 'Emotional needs and attachments.'}</p>
                </div>
                <div className="space-y-6">
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Typ citové vazby' : 'Attachment Style'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.attachmentStyle ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.attachmentStyle}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(ATTACHMENT_STYLE_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Dynamika Intimity' : 'Intimacy Dynamic'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.intimacyDynamic ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.intimacyDynamic}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(INTIMACY_DYNAMIC_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Milostný Styl' : 'Love Style'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.loveStyle ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.loveStyle}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(LOVE_STYLE_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'intellect' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-mafia-gold mb-2">{lang === 'cs' ? 'Intelekt a Rozhodování' : 'Intellect & Decision Making'}</h3>
                  <p className="text-xs font-mono text-white/50">{lang === 'cs' ? 'Systém 1 nebo Systém 2? Jak uvažuješ.' : 'System 1 or System 2?'}</p>
                </div>
                <div className="space-y-6">
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Mozková hemisféra' : 'Brain Hemisphere'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.brainHemisphere ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.brainHemisphere}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(BRAIN_HEMISPHERE_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Mindset (Myšlení)' : 'Mindset'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.mindset ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.mindset}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <div className="flex gap-2">
                      <select value={formData.mindset || ""} onChange={(e) => setFormData({...formData, mindset: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none">
                        <option value="">{lang === 'cs' ? 'Vyber...' : 'Select...'}</option>
                        <option value="Fixed Mindset">Fixed Mindset</option>
                        <option value="Growth Mindset">Growth Mindset</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          
            {activeTab === 'boundaries' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-mafia-gold mb-2">{lang === 'cs' ? 'Hranice a Vztahové Limity' : 'Boundaries & Limits'}</h3>
                  <p className="text-xs font-mono text-white/50">{lang === 'cs' ? 'Definuj, přes co u tebe nejede vlak.' : 'Define your absolute dealbreakers.'}</p>
                </div>
                <div className="space-y-6">
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Kde máš hranici nevěry?' : 'Infidelity Boundaries'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.infidelityDefinition ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.infidelityDefinition}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <button type="button" onClick={() => setActiveQuiz(INFIDELITY_BOUNDARY_QUIZ)} className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 border border-mafia-gold/50 text-mafia-gold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors whitespace-nowrap">
                      {lang === 'cs' ? 'Nevíš? Spusť si Kvíz' : 'Take the Quiz'}
                    </button>
                  </div>
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Přátelství s EX partnery' : 'Friendship with EX'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.exFriendship ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.exFriendship}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <div className="flex gap-2">
                      <select value={formData.exFriendship || ""} onChange={(e) => setFormData({...formData, exFriendship: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none">
                        <option value="">{lang === 'cs' ? 'Vyber...' : 'Select...'}</option>
                        <option value="Zcela v pohodě">Zcela v pohodě</option>
                        <option value="Jen známí">Jen známí</option>
                        <option value="Absolutní ne">Absolutní ne</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 border border-white/10 bg-black/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-heading font-black uppercase tracking-widest text-white text-sm mb-1">{lang === 'cs' ? 'Soukromí telefonu' : 'Phone Privacy'}</div>
                      <div className="text-[10px] font-mono text-white/50">{formData.privacyLevel ? `${lang === 'cs' ? 'Vybráno:' : 'Selected:'} ${formData.privacyLevel}` : (lang === 'cs' ? 'Nevyplněno' : 'Not filled')}</div>
                    </div>
                    <div className="flex gap-2">
                      <select value={formData.privacyLevel || ""} onChange={(e) => setFormData({...formData, privacyLevel: e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none">
                        <option value="">{lang === 'cs' ? 'Vyber...' : 'Select...'}</option>
                        <option value="Otevřená kniha (známe hesla)">Otevřená kniha</option>
                        <option value="Absolutní soukromí">Absolutní soukromí</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          {activeTab === 'schools' && <StepSchools formData={formData} setFormData={setFormData} lang={lang} />}
          {activeTab === 'protocol' && <Step8Protocol formData={formData} setFormData={setFormData} lang={lang} />}
          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span className="flex items-center text-white/40">
                    {formData.accountType === 'property' ? (lang === 'cs' ? 'Pravidla a Popis (Bio)' : 'Rules & Description (Bio)') : (lang === 'cs' ? 'Něco o tobě (Bio)' : 'About you (Bio)')}
                    <InfoTooltip text={formData.accountType === 'property' ? (lang === 'cs' ? 'Popište komunitu, pravidla pro členy nebo důvod vzniku.' : 'Describe the community, member rules or its purpose.') : (lang === 'cs' ? 'Lidi, co čtou bio, hledají něco navíc. Ukaž jim, čím jsi jedinečný(á).' : 'People who read bios look for something extra. Show them what makes you unique.')} />
                  </span>
                  <span className={`text-[10px] font-mono tracking-widest ${formData.bio.length >= 1000 ? 'text-red-500 font-bold' : 'text-white/30'}`}>{formData.bio.length} / 1000</span>
                </label>
                <textarea ref={bioRef} value={formData.bio} maxLength={1000} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus:border-mafia-gold transition-colors font-sans text-sm resize-none overflow-hidden" placeholder={formData.accountType === 'property' ? (lang === 'cs' ? 'Napiš pravidla nebo popis místa...' : 'Write rules or place description...') : (lang === 'cs' ? 'Napiš něco krátkého o sobě...' : 'Write something short about yourself...')} />
              </div>

              <div>
                <label className="block text-xs font-mono text-mafia-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> {lang === 'cs' ? 'Icebreakers (Lehčí otázky)' : 'Icebreakers'}
                </label>
                <p className="text-[10px] font-mono text-white/40 mb-3 leading-relaxed">
                  {lang === 'cs' ? 'Vyber si jednu otázku a odpověz. Pomůže to lidem začít konverzaci.' : 'Pick a question and answer it to help others start a conversation.'}
                </p>
                <div className="flex gap-2">
                  <select 
                    value={formData.icebreakerPrompts?.[0]?.question || ""} 
                    onChange={(e) => setFormData({...formData, icebreakerPrompts: [{ question: e.target.value, answer: formData.icebreakerPrompts?.[0]?.answer || '' }]})} 
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-mafia-gold outline-none"
                  >
                    <option value="">{lang === 'cs' ? 'Vyber otázku...' : 'Select a question...'}</option>
                    <option value="Jaký je tvůj perfect day?">Jaký je tvůj perfect day?</option>
                    <option value="Jaká maličkost ti zaručeně udělá radost?">Jaká maličkost ti zaručeně udělá radost?</option>
                    <option value="Co by tě dokázalo rozesmát i ve špatný den?">Co by tě dokázalo rozesmát i ve špatný den?</option>
                    <option value="Jaké jídlo miluješ ze všeho nejvíc?">Jaké jídlo miluješ ze všeho nejvíc?</option>
                  </select>
                </div>
                {formData.icebreakerPrompts?.[0]?.question && (
                  <input 
                    type="text" 
                    value={formData.icebreakerPrompts[0].answer} 
                    onChange={(e) => setFormData({...formData, icebreakerPrompts: [{ question: formData.icebreakerPrompts![0].question, answer: e.target.value }]})} 
                    placeholder={lang === 'cs' ? 'Tvoje odpověď...' : 'Your answer...'} 
                    className="mt-2 w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mafia-gold focus:border-mafia-gold transition-colors font-sans text-sm rounded-lg"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-xs font-mono text-mafia-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> {lang === 'cs' ? 'Moje štítky' : 'My Tags'}
                </label>
                <p className="text-[10px] font-mono text-white/40 mb-3 leading-relaxed">
                  {lang === 'cs' 
                    ? 'Vyber štítky, které tě nejlépe vystihují. Zvyšují šanci na nalezení lidí s podobnými zájmy.' 
                    : 'Select tags that best describe you. They increase the chance of finding people with similar interests.'}
                </p>
                <CustomSelect 
                  isMulti={true}
                  value={formData.myTags || []} 
                  onChange={(val) => setFormData({ ...formData, myTags: val })} 
                  placeholder={lang === 'cs' ? 'Vyber štítky...' : 'Select tags...'} 
                  options={Array.from(new Map(CATEGORIES.flatMap(c => c.subOptions.map(opt => [
                    opt.tag, 
                    { 
                      value: opt.tag, 
                      label: typeof opt.label === 'string' ? opt.label : opt.label[lang] || opt.label['en'] 
                    }
                  ]))).values())} 
                />
              </div>

              {formData.accountType !== 'pet' && (
                <>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-mono text-red-500 uppercase tracking-widest flex items-center gap-2"><Flag size={12} /> {lang === 'cs' ? 'Moje stinné stránky / Red flags' : 'My Red Flags / Negatives'}</label>
                      <span className={`text-[10px] font-mono tracking-widest ${(formData.negatives?.length || 0) >= 300 ? 'text-red-500 font-bold' : 'text-white/30'}`}>{(formData.negatives?.length || 0)} / 300</span>
                    </div>
                    <textarea value={formData.negatives || ""} maxLength={300} onChange={(e) => setFormData({ ...formData, negatives: e.target.value })} rows={2} className="w-full bg-red-950/20 border border-red-900/50 py-3 px-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus:border-red-500 transition-colors font-sans text-sm resize-none" placeholder={lang === 'cs' ? 'Přiznej barvu! (např. Chrápu, v neděli nevstávám z postele...)' : 'Be honest! (e.g. I snore...)'} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2"><Flag size={14} className="text-red-400" />{lang === 'cs' ? 'Moje mouchy (Red Flag)' : 'My biggest "Red Flag"'}</label>
                      <CustomSelect value={formData.redFlag || ""} onChange={(val) => setFormData({ ...formData, redFlag: val })} placeholder={lang === 'cs' ? 'Přiznej barvu...' : 'Confess...'} error={true} options={[{ value: "slow", label: lang === 'cs' ? 'Odepisuju hrozně pomalu' : 'I text back really slowly' }, { value: "snore", label: lang === 'cs' ? 'Hrozně chrápu' : 'I snore terribly' }, { value: "phone", label: lang === 'cs' ? 'Jsem závislý/á na telefonu' : 'Always on my phone' }, { value: "cook", label: lang === 'cs' ? 'Neumím uvařit ani čaj' : 'I can\'t even cook tea' }]} />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageCircleHeart size={14} className="text-mafia-gold" />{lang === 'cs' ? 'Jazyk lásky' : 'Love Language'}</label>
                      <CustomSelect value={formData.loveLanguage || ""} onChange={(val) => setFormData({ ...formData, loveLanguage: val })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "touch", label: lang === 'cs' ? 'Fyzický kontakt (obejmutí, dotyky)' : 'Physical touch' }, { value: "gifts", label: lang === 'cs' ? 'Pozornosti a dárky' : 'Receiving gifts' }, { value: "time", label: lang === 'cs' ? 'Kvalitně strávený společný čas' : 'Quality time' }, { value: "words", label: lang === 'cs' ? 'Slova ujištění a podpora' : 'Words of affirmation' }]} />
                    </div>
                  </div>
                </>
              )}

              <div className="mt-8 pb-8">
                <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2 mb-6">
                  <Link size={16} className="text-mafia-gold" />
                  <h3 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">{lang === 'cs' ? 'Sociální sítě' : 'Social Networks'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2"><Instagram size={12} className="inline mr-1 text-pink-500" /> Instagram</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">@</span><input type="text" value={formData.instagram || ""} onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace('@', '') })} className="w-full bg-black/40 border border-white/10 py-3 pl-8 pr-4 text-white focus:border-mafia-gold" /></div></div>
                  <div><label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2"><Link size={12} className="inline mr-1" /> TikTok</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">@</span><input type="text" value={formData.tiktok || ""} onChange={(e) => setFormData({ ...formData, tiktok: e.target.value.replace('@', '') })} className="w-full bg-black/40 border border-white/10 py-3 pl-8 pr-4 text-white focus:border-mafia-gold" /></div></div>
                  {formData.accountType !== 'pet' && (
                    <>
                      <div><label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Facebook (Odkaz)</label><input type="text" value={formData.facebook || ""} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} className="w-full bg-black/40 border border-white/10 p-3 text-white focus:border-mafia-gold" /></div>
                      <div><label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">LinkedIn (Odkaz)</label><input type="text" value={formData.linkedin || ""} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-black/40 border border-white/10 p-3 text-white focus:border-mafia-gold" /></div>
                      <div><label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">X / Twitter (Uživatelské jméno)</label><input type="text" value={formData.twitter || ""} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className="w-full bg-black/40 border border-white/10 p-3 text-white focus:border-mafia-gold" /></div>
                      <div><label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Spotify (Odkaz)</label><input type="text" value={formData.spotify || ""} onChange={(e) => setFormData({ ...formData, spotify: e.target.value })} className="w-full bg-black/40 border border-white/10 p-3 text-white focus:border-mafia-gold" /></div>
                    </>
                  )}
                </div>
              </div>

              {formData.accountType !== 'pet' && (
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2"><PawPrint size={12} />{lang === 'cs' ? 'Moji mazlíčci' : 'My Pets'}</label>
                  <div className="flex flex-col gap-3 mb-4">
                    {formData.pets?.map(pet => {
                      const typeIcon = ANIMAL_TYPES.find(t => t.id === pet.type)?.icon || '🐾';
                      return (
                        <div key={pet.id} className="flex items-center justify-between p-3 border border-mafia-gold/30 bg-mafia-gold/5">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{typeIcon}</span>
                            <div>
                              <div className="font-heading font-black text-white">{pet.breed}</div>
                              {pet.name && <div className="text-xs font-mono text-mafia-gold">{pet.name}</div>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleEditPet(pet.id)} className="p-1.5 text-white/50 hover:text-white">Upravit</button>
                            <button type="button" onClick={() => handleDeletePet(pet.id)} className="p-1.5 text-red-500/50 hover:text-red-500"><X size={16} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" onClick={openNewPetModal} className="w-full py-3 border border-dashed border-white/20 text-white/50 font-mono text-sm hover:border-mafia-gold hover:text-mafia-gold transition-colors flex items-center justify-center gap-2"><PawPrint size={16} />{lang === 'cs' ? '+ Přidat mazlíčka' : '+ Add pet'}</button>
                </div>
              )}

              <div className="mt-8 p-6 bg-red-950/20 border border-red-900/50 rounded-xl space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <input type="checkbox" id="terms" checked={formData.termsAccepted || false} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} className="w-5 h-5 accent-red-500 cursor-pointer" />
                  </div>
                  <div>
                    <label htmlFor="terms" className="text-white/80 text-xs leading-relaxed font-sans cursor-pointer block">
                      {lang === 'cs' 
                        ? <><strong className="text-red-500 uppercase tracking-widest text-[10px] block mb-1">Bezpečnost a Podmínky</strong> Jdu sem zcela dobrovolně. Zavazuji se, že do profilu nevložím <strong>žádné citlivé údaje</strong>, které by mě mohly poškodit (např. při úniku dat). Aplikace nesbírá skrytá data a neručí za to, koho zde potkám. <strong>Jsem dospělý(á) a zodpovídám za sebe.</strong></>
                        : <><strong className="text-red-500 uppercase tracking-widest text-[10px] block mb-1">Safety & Terms</strong> I am here voluntarily. I commit to NOT upload any <strong>sensitive data</strong> that could harm me. The app does not collect hidden data and is not liable for who I meet. <strong>I am an adult and responsible for myself.</strong></>
                      }
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      </div>

      {/* Action Buttons */}
        <div className="pt-6 mt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-end items-center">
          <button type="button" onClick={handlePreview} className="w-full md:w-auto py-3 px-6 bg-black border border-mafia-gold/50 text-mafia-gold font-mono uppercase tracking-widest hover:bg-mafia-gold/10 transition-colors">
            {lang === 'cs' ? 'Náhled' : 'Preview'}
          </button>
          <button type="button" onClick={() => { if (validateForm()) handleSubmit(new Event('submit') as any); }} disabled={!formData.termsAccepted || !formData.protocolAgreed} className={`w-full md:w-auto py-3 px-8 text-black font-heading font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${(formData.termsAccepted && formData.protocolAgreed) ? 'bg-mafia-gold hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-mafia-gold/30 cursor-not-allowed text-black/50'}`}>
            {formData.isComplicated ? <Flame size={18} className={(formData.termsAccepted && formData.protocolAgreed) ? 'text-black' : 'text-black/50'} /> : null}
            {lang === 'cs' ? 'Dokončit profil' : 'Finish Profile'}
          </button>
        </div>
      </motion.form>

      {/* Modals */}
      <AnimatePresence>
        {showQuiz && (
          <PersonalityQuiz lang={lang} onClose={() => setShowQuiz(false)} onComplete={(results) => { setFormData({ ...formData, ...results }); setShowQuiz(false); }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMemberModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-black border border-mafia-gold/30 p-6 md:p-8 shadow-[0_0_50px_rgba(197,160,89,0.1)] relative max-h-[90vh] h-[90vh] md:h-auto flex flex-col rounded-xl">
              <button onClick={() => setShowMemberModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 rounded-full p-2"><X size={20} /></button>
              <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-2"><User size={24} />{editingMemberId ? (lang === 'cs' ? 'Upravit člena' : 'Edit Member') : (lang === 'cs' ? 'Přidat člena' : 'Add Member')}</h3>
              
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Jméno' : 'Name'}</label>
                  <input type="text" value={memberDraft.name} onChange={(e) => setMemberDraft({ ...memberDraft, name: e.target.value })} placeholder={lang === 'cs' ? 'Např. Jana' : 'e.g. Jane'} className="w-full bg-black border border-white/20 p-3 text-white focus:border-mafia-gold focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Věk' : 'Age'}</label>
                    <input type="number" value={memberDraft.age} onChange={(e) => setMemberDraft({ ...memberDraft, age: e.target.value })} placeholder="25" className="w-full bg-black border border-white/20 p-3 text-white focus:border-mafia-gold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Výška (cm)' : 'Height (cm)'}</label>
                    <input type="number" value={memberDraft.height} onChange={(e) => setMemberDraft({ ...memberDraft, height: e.target.value })} placeholder="170" className="w-full bg-black border border-white/20 p-3 text-white focus:border-mafia-gold focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Pohlaví' : 'Gender'}</label>
                    <CustomSelect value={memberDraft.gender} onChange={(val) => setMemberDraft({ ...memberDraft, gender: val })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "male", label: lang === 'cs' ? 'Muž' : 'Man' }, { value: "female", label: lang === 'cs' ? 'Žena' : 'Woman' }, { value: "other", label: lang === 'cs' ? 'Nechci uvádět' : 'Other' }]} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Kouření' : 'Smoking'}</label>
                    <CustomSelect value={memberDraft.smoking} onChange={(val) => setMemberDraft({ ...memberDraft, smoking: val })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "nepije", label: lang === 'cs' ? 'Nekuřák' : 'Non-smoker' }, { value: "pije", label: lang === 'cs' ? 'Příležitostně' : 'Occasionally' }, { value: "pravidelne", label: lang === 'cs' ? 'Pravidelně' : 'Regularly' }, { value: "vape", label: lang === 'cs' ? 'Vape / Iqos' : 'Vape / Iqos' }]} />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <button type="button" disabled={!memberDraft.name} onClick={handleSaveMember} className="w-full py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all">{lang === 'cs' ? 'Uložit člena' : 'Save member'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-mafia-dark border border-mafia-gold/30 w-full max-w-lg overflow-hidden flex flex-col h-[70vh] md:h-[600px] shadow-[0_0_40px_rgba(197,160,89,0.15)] relative">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
                <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm">{lang === 'cs' ? 'Upravit fotku' : 'Crop Photo'}</h4>
                <button onClick={() => setActivePhoto(null)} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 relative bg-black touch-none">
                <Cropper image={activePhoto} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} classes={{ containerClassName: 'absolute inset-0' }} />
              </div>
              <div className="p-6 bg-black/60 border-t border-white/5 space-y-4">
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-2">{lang === 'cs' ? 'Přiblížení' : 'Zoom'}</label>
                  <input type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-mafia-gold" />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setActivePhoto(null)} className="flex-1 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/30 font-mono text-xs uppercase tracking-widest transition-colors">{lang === 'cs' ? 'Zrušit' : 'Cancel'}</button>
                  <button onClick={handleCropConfirm} className="flex-1 py-3 bg-mafia-gold text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"><Check size={16} />{lang === 'cs' ? 'Potvrdit' : 'Confirm'}</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-black border border-mafia-gold/30 p-6 md:p-8 shadow-[0_0_50px_rgba(197,160,89,0.1)] relative max-h-[90vh] h-[90vh] md:h-auto flex flex-col rounded-xl">
              <button onClick={() => setShowPetModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 rounded-full p-2"><X size={20} /></button>
              <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase mb-6 flex items-center gap-2"><PawPrint size={24} />{editingPetId ? (lang === 'cs' ? 'Upravit mazlíčka' : 'Edit Pet') : (lang === 'cs' ? 'Přidat mazlíčka' : 'Add Pet')}</h3>
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-3">{lang === 'cs' ? 'Druh zvířete' : 'Animal Type'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ANIMAL_TYPES.map(type => (
                      <button key={type.id} type="button" onClick={() => { setPetDraft({ ...petDraft, type: type.id, breed: '' }); setBreedSearch(''); }} className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-3 transition-all ${petDraft.type === type.id ? 'border-mafia-gold bg-mafia-gold/20 text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white bg-white/5'}`}>
                        <span className="text-3xl">{type.icon}</span><span className="text-xs font-mono text-center leading-tight font-bold">{type.label[lang as 'cs' | 'en']}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Plemeno (Povinné)' : 'Breed (Required)'}</label>
                  <input type="text" value={breedSearch} onChange={(e) => { setBreedSearch(e.target.value); setPetDraft({ ...petDraft, breed: e.target.value }); }} placeholder={lang === 'cs' ? 'Hledat nebo napsat vlastní...' : 'Search or type your own...'} className="w-full bg-black border border-white/20 p-3 text-white focus:border-mafia-gold focus:outline-none mb-2" />
                  <div className="max-h-40 overflow-y-auto border border-white/10 bg-white/5 rounded-sm p-1">
                    {PET_BREEDS[petDraft.type].filter(b => b.toLowerCase().includes(breedSearch.toLowerCase())).map(breed => (
                      <button key={breed} type="button" onClick={() => { setPetDraft({ ...petDraft, breed }); setBreedSearch(breed); }} className={`w-full text-left px-3 py-2 text-sm transition-colors ${petDraft.breed === breed ? 'bg-mafia-gold text-black font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>{breed}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Jméno' : 'Name'}</label>
                  <input type="text" value={petDraft.name} onChange={(e) => setPetDraft({ ...petDraft, name: e.target.value })} placeholder={lang === 'cs' ? 'Např. Max' : 'e.g. Max'} className="w-full bg-black border border-white/20 p-3 text-white focus:border-mafia-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{lang === 'cs' ? 'Co pro mazlíčka hledáte?' : 'What are you looking for?'}</label>
                  <CustomSelect dropUp={true} value={petDraft.purpose || "none"} onChange={(val) => setPetDraft({ ...petDraft, purpose: val as 'walk' | 'breed' | 'none' })} placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} options={[{ value: "none", label: lang === 'cs' ? 'Jen se chlubím (Nehledám nic)' : 'Just showing off' }, { value: "walk", label: lang === 'cs' ? '🎾 Parťáka na společné venčení' : '🎾 Playdate' }, { value: "breed", label: lang === 'cs' ? '❤️ Partnera na krytí / páření' : '❤️ Breeding partner' }]} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <button type="button" disabled={!petDraft.breed} onClick={handleSavePet} className="w-full py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all">{lang === 'cs' ? 'Uložit mazlíčka' : 'Save pet'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingMyCategory && (() => {
          const cat = CATEGORIES.find(c => c.id === editingMyCategory);
          if (!cat) return null;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-lg bg-black border border-white/10 p-6 rounded-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <div className={`p-3 rounded-full ${cat.color.split(' ')[2]}`}><cat.icon size={24} className={cat.color.split(' ')[1]} /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-heading font-black uppercase tracking-widest text-lg">{cat.title[lang as 'cs' | 'en']}</h3>
                      <button 
                        onClick={() => {
                          const allTags = cat.subOptions.map(o => o.tag);
                          const isAllSelected = cat.subOptions.every(o => (formData.categories || []).includes(o.tag));
                          if (isAllSelected) {
                            setFormData({ ...formData, categories: (formData.categories || []).filter(t => !allTags.includes(t)) });
                          } else {
                            const newTags = new Set([...(formData.categories || []), ...allTags]);
                            setFormData({ ...formData, categories: Array.from(newTags) });
                          }
                        }}
                        className="text-[10px] font-mono text-mafia-gold uppercase border border-mafia-gold/30 px-2 py-1 rounded hover:bg-mafia-gold/10 transition-colors"
                      >
                        {lang === 'cs' ? 'Označit vše' : 'Select All'}
                      </button>
                    </div>
                    <p className="text-white/40 text-xs font-mono mt-1">{lang === 'cs' ? 'Moje štítky' : 'My tags'}</p>
                  </div>

                  {/* DYNAMIC CATEGORY QUESTIONS */}
                  {editingMyCategory === 'real_estate' && (
                    <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
                      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Doplňující dotazy k bydlení</h4>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Kouření</label>
                        <CustomSelect value={formData.smoking || ""} onChange={(v) => setFormData({...formData, smoking: v as string})} options={[{value:'no', label:'Nekuřák'}, {value:'yes', label:'Kuřák'}, {value:'outside', label:'Kouřím jen venku'}]} placeholder="Vyber..." />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Domácí mazlíčci</label>
                        <CustomSelect value={formData.pets?.length ? "yes" : "no"} onChange={(v) => {
                          if (v === 'yes' && (!formData.pets || formData.pets.length === 0)) {
                            setFormData({...formData, pets: [{id: Date.now().toString(), type: 'Nespecifikováno', breed: '', purpose: 'none'}]})
                          } else if (v === 'no') {
                            setFormData({...formData, pets: []})
                          }
                        }} options={[{value:'no', label:'Nemám zvířata'}, {value:'yes', label:'Mám zvíře'}]} placeholder="Vyber..." />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Běžný režim (Chronotyp)</label>
                        <CustomSelect value={formData.temperament || ""} onChange={(v) => setFormData({...formData, temperament: v as string})} options={[{value:'Ranní ptáče', label:'Ranní ptáče'}, {value:'Sova', label:'Noční sova'}, {value:'Flexibilní', label:'Něco mezi'}]} placeholder="Vyber..." />
                      </div>
                    </div>
                  )}

                  {editingMyCategory === 'services_work' && (
                    <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
                      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Pracovní Profil</h4>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Work-Life Balance</label>
                        <CustomSelect value={formData.workLifeBalance || ""} onChange={(v) => setFormData({...formData, workLifeBalance: v as string})} options={[{value:'Hustle kultura (Kariéra na 1. místě)', label:'Hustle kultura (Kariéra na 1. místě)'}, {value:'Vyvážený', label:'Vyvážený střed'}, {value:'Pracuji, abych žil(a)', label:'Pracuji, abych žil(a)'}]} placeholder="Vyber..." />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Přístup k penězům</label>
                        <CustomSelect value={formData.moneyDetailed?.myAttitude || ""} onChange={(v) => setFormData({...formData, moneyDetailed: {...(formData.moneyDetailed || {}), myAttitude: v as string}})} options={[{value:'Spořím a investuji', label:'Spořím a investuji'}, {value:'Užívám si a utrácím', label:'Užívám si a utrácím'}, {value:'Zlatá střední cesta', label:'Zlatá střední cesta'}]} placeholder="Vyber..." />
                      </div>
                    </div>
                  )}

                  {editingMyCategory === 'friends' && (
                    <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
                      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Přátelský Profil</h4>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Sociální Baterie</label>
                        <CustomSelect value={formData.socialBattery || ""} onChange={(v) => setFormData({...formData, socialBattery: v as string})} options={[{value:'Introvert', label:'Introvert (Dobíjim o samotě)'}, {value:'Extrovert', label:'Extrovert (Dobíjim s lidmi)'}, {value:'Ambivert', label:'Něco mezi'}]} placeholder="Vyber..." />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Spontánnost</label>
                        <CustomSelect value={formData.spontaneityLevel || ""} onChange={(v) => setFormData({...formData, spontaneityLevel: v as string})} options={[{value:'Extrémně spontánní', label:'Extrémně spontánní'}, {value:'Rád plánuji dopředu', label:'Plánovač'}, {value:'Flexibilní', label:'Něco mezi'}]} placeholder="Vyber..." />
                      </div>
                    </div>
                  )}
                  
                  {editingMyCategory === 'relationships' && (
                    <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
                      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Romantické Preference</h4>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Jazyk Lásky (Love Language)</label>
                        <CustomSelect value={formData.loveLanguage || ""} onChange={(v) => setFormData({...formData, loveLanguage: v as string})} options={[{value:'touch', label:'Fyzický kontakt'}, {value:'words', label:'Slova ujištění'}, {value:'acts', label:'Skutky a pomoc'}, {value:'gifts', label:'Dárky'}, {value:'time', label:'Společný čas'}]} placeholder="Vyber..." />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Hranice Nevěry</label>
                        <CustomSelect value={(formData as any).boundaries?.infidelityDef || ""} onChange={(v) => setFormData({...formData, boundaries: {...((formData as any).boundaries || {}), infidelityDef: v as string}})} options={[{value:'Už flirtování je moc', label:'Už flirtování je moc'}, {value:'Fyzický kontakt', label:'Fyzický kontakt'}, {value:'Citové sblížení', label:'Citové sblížení s jiným'}]} placeholder="Vyber..." />
                      </div>
                    </div>
                  )}

                  <button onClick={() => {
                    const hasTags = cat.subOptions.some(opt => (formData.categories || []).includes(opt.tag));
                    if (!hasTags) {
                      setFormData(prev => ({ ...prev, activeCategories: (prev.activeCategories || []).filter(id => id !== editingMyCategory) }));
                    }
                    setEditingMyCategory(null);
                  }} className="p-2 text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-wrap gap-2 mb-6 content-start">
                  {cat.subOptions.map(opt => {
                    const catTag = opt.tag;
                    const isSelected = (formData.categories || []).includes(catTag);
                    const colorClasses = cat.color.split(' ');
                    const borderColor = colorClasses.find(c => c.startsWith('border-'));
                    const textColor = colorClasses.find(c => c.startsWith('text-'));
                    const bgColor = colorClasses.find(c => c.startsWith('bg-'));

                    return (
                      <button key={opt.id} type="button" onClick={() => {
                        const current = formData.categories || [];
                        const updated = isSelected ? current.filter(t => t !== catTag) : [...current, catTag];
                        setFormData({ ...formData, categories: updated });
                      }} className={`px-4 py-2 text-sm font-sans rounded-full transition-all duration-300 border ${isSelected ? `${borderColor} ${bgColor} ${textColor} shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-black/40'}`}>
                        {opt.tag}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => {
                  const hasTags = cat.subOptions.some(opt => (formData.categories || []).includes(opt.tag));
                  if (!hasTags) {
                    setFormData(prev => ({ ...prev, activeCategories: (prev.activeCategories || []).filter(id => id !== editingMyCategory) }));
                  }
                  setEditingMyCategory(null);
                }} className="w-full py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest rounded-lg hover:bg-white transition-colors">{lang === 'cs' ? 'Uložit a zavřít' : 'Save and Close'}</button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center p-4 pt-12 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => {
                  setShowQuickSettings(false);

                }} 
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-mafia-gold hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-black border border-white/10 p-6 md:p-8 rounded-xl space-y-8 my-auto">
              <div className="text-center mb-6 border-b border-white/5 pb-4">
                <h3 className="text-white font-heading font-black uppercase tracking-widest text-xl mb-1 flex items-center justify-center gap-2">
                  <Settings size={20} className="text-mafia-gold" />
                  {lang === 'cs' ? 'Rychlé nastavení' : 'Quick Settings'}
                </h3>
                <p className="text-white/40 text-xs font-mono">{lang === 'cs' ? 'Změň si základní nastavení bez nutnosti klikat "Zpět"' : 'Change base settings without going back'}</p>
              </div>

              {/* Typ uctu */}
              <div>
                <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm mb-3">{lang === 'cs' ? 'Typ účtu' : 'Account Type'}</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { id: 'individual', icon: User, label: lang === 'cs' ? 'Jednotlivec' : 'Individual' },
                    { id: 'couple', icon: Heart, label: lang === 'cs' ? 'Pár' : 'Couple' },
                    { id: 'family', icon: Users, label: lang === 'cs' ? 'Rodina' : 'Family' },
                    { id: 'group', icon: Users, label: lang === 'cs' ? 'Skupina' : 'Group' },
                    { id: 'pet', icon: PawPrint, label: lang === 'cs' ? 'Zvíře' : 'Pet' }
                  ].map(type => {
                    const isSelected = (formData.accountType || 'individual') === type.id;
                    return (
                      <button
                        key={type.id} type="button"
                        onClick={() => setFormData({ ...formData, accountType: type.id as any })}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-xl transition-all ${
                          isSelected ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold' : 'border-white/10 bg-black/40 text-white/50 hover:bg-white/5'
                        }`}
                      >
                        <type.icon size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-normal whitespace-nowrap">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Co hledam */}
              <div>
                <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm mb-3">{lang === 'cs' ? 'Vibe (Kategorie)' : 'Vibe (Categories)'}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => {
                    const isActive = (formData.activeCategories || []).includes(cat.id);
                    return (
                      <button
                        key={cat.id} type="button"
                        onClick={() => {
                          if (isActive) {
                            const tagsToRemove = cat.subOptions.map(opt => opt.tag);
                            setFormData(prev => ({ 
                              ...prev, 
                              activeCategories: (prev.activeCategories || []).filter(id => id !== cat.id),
                              categories: (prev.categories || []).filter(tag => !tagsToRemove.includes(tag))
                            }));
                          } else {
                            setFormData(prev => ({ ...prev, activeCategories: [...(prev.activeCategories || []), cat.id] }));
                          }
                        }}
                        className={`flex items-center gap-2 p-3 border rounded-xl transition-all ${
                          isActive ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold' : 'border-white/10 bg-black/40 text-white/50 hover:bg-white/5'
                        }`}
                      >
                        <cat.icon size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest truncate">{cat.title[lang as 'cs' | 'en']}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Moduly */}
              {formData.accountType !== 'pet' && (
                <div>
                  <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm mb-3">{lang === 'cs' ? 'Volitelné sekce' : 'Optional Modules'}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { id: 'physical', label: lang === 'cs' ? 'Vzhled' : 'Appearance' },
                      { id: 'character', label: lang === 'cs' ? 'Charakter' : 'Character' },
                      { id: 'lifestyle', label: lang === 'cs' ? 'Styl' : 'Lifestyle' },
                      { id: 'love', label: lang === 'cs' ? 'Láska' : 'Love' },
                      { id: 'future', label: lang === 'cs' ? 'Budoucnost' : 'Future' },
                      { id: 'values', label: lang === 'cs' ? 'Hodnoty' : 'Values' }
                    ].map(mod => {
                      const isActive = (formData.activeModules || []).includes(mod.id);
                      return (
                        <button
                          key={mod.id} type="button"
                          onClick={() => {
                            const newModules = isActive 
                              ? (formData.activeModules || []).filter(m => m !== mod.id)
                              : [...(formData.activeModules || []), mod.id];
                            setFormData({ ...formData, activeModules: newModules });
                          }}
                          className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                            isActive ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold' : 'border-white/10 bg-black/40 text-white/50 hover:bg-white/5'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-widest">{mod.label}</span>
                          <Check size={14} className={isActive ? 'opacity-100' : 'opacity-0'} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  setShowQuickSettings(false);

                }}
                className="w-full py-4 mt-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
              >
                {lang === 'cs' ? 'Hotovo, pokračovat' : 'Done, continue'}
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="absolute top-4 right-4 z-50">
              <button onClick={() => setShowPreview(false)} className="w-12 h-12 rounded-full bg-mafia-gold/20 border border-mafia-gold text-mafia-gold flex items-center justify-center hover:bg-mafia-gold hover:text-black transition-colors"><X size={24} /></button>
            </div>
            <div className="w-full max-w-sm mb-4 text-center">
              <h3 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">{lang === 'cs' ? 'Takhle tě uvidí ostatní' : 'How others see you'}</h3>
              <p className="text-white/50 text-xs font-mono mt-1">{lang === 'cs' ? 'Klikni na info nebo potáhni fotku pro detaily.' : 'Tap info or swipe for details.'}</p>
            </div>
            <ProfileCard profile={formData} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
