const fs = require('fs');
const path = require('path');
const file = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'ProfileCard.tsx');

let content = fs.readFileSync(file, 'utf8');

// Strip out whatever mess replace_file_content made at the top
const contentLines = content.split('\n');
const firstValidLineIndex = contentLines.findIndex(l => l.includes('if (isNaN(date.getTime()))'));

if (firstValidLineIndex > -1) {
  content = contentLines.slice(firstValidLineIndex - 2).join('\n');
}

// The fuzzy matcher deleted the first 10 lines. We prepend them back.
const header = `import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Ruler, Cigarette, Wine, Sparkles, Info, X, Skull, Flag, MessageCircleHeart, Coffee, Target, GraduationCap, Zap, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Camera, Heart, Instagram, Link, PawPrint, Facebook, Linkedin, Twitter, Music, PlaySquare, MessageSquare, EyeOff, Users, Home, Leaf, Calendar, Briefcase, Gamepad2, ShieldCheck, BadgeCheck, Lock, ShieldAlert, AlertTriangle
} from "lucide-react";
import { ANIMAL_TYPES } from "@/lib/PetAtlas";
import { useTranslation } from "@/hooks/useTranslation";

import { ProfileData } from "./ProfileTypes";
export * from "./ProfileTypes";
import { MatchVoucherCard, VoucherData } from "./MatchVoucherCard";
import { AccordionSection } from "./AccordionSection";
import { DsaReportModal } from "./DsaReportModal";

const formatRelativeTime = (timeStr: string, lang: 'cs' | 'en') => {
  if (!timeStr || !timeStr.includes('T')) return timeStr;

  const date = new Date(timeStr);
`;

content = header + content;

fs.writeFileSync(file, content);
console.log('Fixed header');
