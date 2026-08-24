const fs = require('fs');
const path = require('path');

const matchesPath = path.join('c:', 'Users', 'micka', 'Documents', 'MMBarber_web', 'src', 'components', 'seznamka', 'Matches.tsx');
let content = fs.readFileSync(matchesPath, 'utf8');

// Header Patch
const targetHeader = `                <div>
                  <h3 className="font-heading font-black text-white uppercase tracking-wider">{activeChat.name}</h3>
                  <p className={\`text-[9px] font-mono uppercase tracking-widest \${activeChat.accountType === 'property' ? 'text-blue-400' : 'text-green-500'}\`}>
                    {activeChat.accountType === 'property' ? (lang === 'cs' ? 'Komunitní Chat' : 'Community Chat') : 'Online'}
                  </p>
                </div>`;
const newHeader = `                <div>
                  <h3 className="font-heading font-black text-white uppercase tracking-wider">{activeChat.name}</h3>
                  <p className={\`flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest \${activeChat.accountType === 'property' ? 'text-blue-400' : (chatActivity === 'online' ? 'text-green-500' : 'text-white/60')}\`}>
                    {activeChat.accountType === 'property' ? (lang === 'cs' ? 'Komunitní Chat' : 'Community Chat') : 
                      chatActivity === 'typing' ? (
                        <>
                          <span className="flex gap-[2px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-bounce" style={{animationDelay: '0ms'}} />
                            <span className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-bounce" style={{animationDelay: '150ms'}} />
                            <span className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-bounce" style={{animationDelay: '300ms'}} />
                          </span>
                          <span className="ml-1 text-mafia-gold">{lang === 'cs' ? 'Píše...' : 'Typing...'}</span>
                        </>
                      ) : chatActivity === 'viewing' ? (
                        <>
                          <Eye size={10} className="text-white/60" />
                          <span>{lang === 'cs' ? 'Prohlíží si chat' : 'Viewing chat'}</span>
                        </>
                      ) : 'Online'}
                  </p>
                </div>`;

// Message Bottom Patch
const targetMessageBottom = `                    {/* Přečteno / Odesláno (Read Receipts) */}
                    {msg.sender === 'me' && (
                      <div className="absolute bottom-1 right-2 text-[8px] flex items-center">
                        <span className={msg.isRead ? "text-blue-400" : "text-white/40"}>
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      </div>
                    )}
                  </motion.div>`;
const newMessageBottom = `                    {/* Timestamp & Read Receipts */}
                    <div className={\`flex items-center gap-1 mt-1 \${msg.sender === 'me' ? 'justify-end' : 'justify-start'}\`}>
                      {msg.timestamp && (
                        <span className="text-[9px] font-mono text-white/40">{msg.timestamp}</span>
                      )}
                      {msg.sender === 'me' && (
                        <span className={\`flex items-center \${msg.status === 'read' ? 'text-mafia-gold' : 'text-white/40'}\`}>
                          {msg.status === 'sent' && <Check size={12} />}
                          {msg.status === 'delivered' && <CheckCheck size={12} />}
                          {msg.status === 'read' && <CheckCheck size={12} />}
                          {/* Fallback */}
                          {!msg.status && (msg.isRead ? <CheckCheck size={12} className="text-mafia-gold" /> : <Check size={12} />)}
                        </span>
                      )}
                    </div>
                  </motion.div>`;

content = content.replace(targetHeader, newHeader);
content = content.replace(targetMessageBottom, newMessageBottom);

fs.writeFileSync(matchesPath, content);
console.log('Done patching UI in Matches.tsx');
