const fs = require('fs');
const path = require('path');

const matchesPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Matches.tsx');
let content = fs.readFileSync(matchesPath, 'utf8');

// 1. Update chatHistory state type
const targetChatHistory = `const [chatHistory, setChatHistory] = useState<{sender: 'me' | 'them', senderName?: string, senderPhoto?: string, type?: 'text'|'image'|'audio', text?: string, url?: string, audioUrl?: string, isBlurred?: boolean, id?: string, isRead?: boolean, reaction?: string}[]>([]);`;
const newChatHistory = `const [chatHistory, setChatHistory] = useState<{sender: 'me' | 'them', senderName?: string, senderPhoto?: string, type?: 'text'|'image'|'audio', text?: string, url?: string, audioUrl?: string, isBlurred?: boolean, id?: string, isRead?: boolean, reaction?: string, status?: 'sent' | 'delivered' | 'read', timestamp?: string}[]>([]);
  const [chatActivity, setChatActivity] = useState<'offline' | 'online' | 'viewing' | 'typing'>('online');`;
content = content.replace(targetChatHistory, newChatHistory);

fs.writeFileSync(matchesPath, content);
console.log('Done patching state in Matches.tsx');
