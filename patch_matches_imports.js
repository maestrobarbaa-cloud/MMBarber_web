const fs = require('fs');
const path = require('path');

const matchesPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Matches.tsx');
let content = fs.readFileSync(matchesPath, 'utf8');

const targetImport = `import { MessageCircleHeart, X, Send, Heart, Star, ThumbsDown, Sparkles, MapPin, Camera, Clock } from "lucide-react";`;
const newImport = `import { MessageCircleHeart, X, Send, Heart, Star, ThumbsDown, Sparkles, MapPin, Camera, Clock, Check, CheckCheck, Eye } from "lucide-react";`;

content = content.replace(targetImport, newImport);
fs.writeFileSync(matchesPath, content);
console.log('Done patching imports in Matches.tsx');
