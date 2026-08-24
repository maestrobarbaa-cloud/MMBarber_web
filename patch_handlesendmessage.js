const fs = require('fs');
const path = require('path');

const matchesPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Matches.tsx');
let content = fs.readFileSync(matchesPath, 'utf8');

const targetHandleSendMessage = `  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    const textToSend = message;
    setMessage(""); // Optimistic UI clear
    
    // Optimistic insert
    setChatHistory(prev => [...prev, { sender: 'me', text: textToSend, id: 'temp-' + Date.now() }]);

    if (activeChat.matchId?.startsWith('mock-')) {
      // Simulate an artificial response delay
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { sender: 'them', text: 'Haha, to je super! Rozumím.', id: 'temp-reply-' + Date.now() }]);
      }, 2500);
      return;
    }

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: activeChat.userId,
          text: textToSend
        })
      });
    } catch (err) {
      console.error("Chyba při odesílání", err);
    }
  };`;

const newHandleSendMessage = `  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    const textToSend = message;
    setMessage(""); // Optimistic UI clear
    
    const messageId = 'temp-' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Optimistic insert
    setChatHistory(prev => [...prev, { sender: 'me', text: textToSend, id: messageId, status: 'sent', timestamp }]);

    if (activeChat.matchId?.startsWith('mock-')) {
      // Simulate read receipts and typing sequence
      
      // 1. Delivered
      setTimeout(() => {
        setChatHistory(prev => prev.map(m => m.id === messageId ? { ...m, status: 'delivered' } : m));
      }, 800);
      
      // 2. Read and Viewing
      setTimeout(() => {
        setChatHistory(prev => prev.map(m => m.id === messageId ? { ...m, status: 'read' } : m));
        setChatActivity('viewing');
      }, 2000);
      
      // 3. Typing
      setTimeout(() => {
        setChatActivity('typing');
        setIsTyping(true);
      }, 3500);

      // 4. Reply
      setTimeout(() => {
        setIsTyping(false);
        setChatActivity('online');
        setChatHistory(prev => [...prev, { sender: 'them', text: 'Haha, to je super! Rozumím.', id: 'temp-reply-' + Date.now(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }, 6000);
      return;
    }

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: activeChat.userId,
          text: textToSend
        })
      });
    } catch (err) {
      console.error("Chyba při odesílání", err);
    }
  };`;

content = content.replace(targetHandleSendMessage, newHandleSendMessage);

fs.writeFileSync(matchesPath, content);
console.log('Done patching handleSendMessage in Matches.tsx');
