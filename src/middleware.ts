import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting store
// V produkci by tohle mělo běžet ideálně přes Redis, ale pro začátek to stačí v paměti Node.js procesu.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minuta
const MAX_REQUESTS_PER_WINDOW = 60 // 60 dotazů za minutu

// --- VIRTUAL WAITING ROOM (Queue System) ---
const activeUsers = new Map<string, number>() // IP -> last seen timestamp
const waitingQueue = new Array<string>() // IPs in queue
let MAX_ACTIVE_USERS = 100 // Default kapacita, lze snížit přes ?test_queue=1 pro otestování
const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minut neaktivity = vyhození z activeUsers

export function middleware(request: NextRequest) {
  // Aplikujeme jen na API cesty
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Ignorujeme vnitřní (lokální) požadavky bez jasné IP
    if (ip !== 'unknown') {
      const now = Date.now()
      const windowStart = now - RATE_LIMIT_WINDOW_MS
      
      let rateData = rateLimitMap.get(ip)

      // Vyčištění starých dat
      if (!rateData || rateData.lastReset < windowStart) {
        rateData = { count: 0, lastReset: now }
      }

      rateData.count++
      rateLimitMap.set(ip, rateData)

      // Ochrana proti spamu/botům (Rate Limiting)
      if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
        console.warn(`[SECURITY] Rate limit překročen pro IP: ${ip}`)
        return NextResponse.json(
          { error: 'Too Many Requests (Ochrana proti botům)' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
    }
  }

  const url = request.nextUrl.clone()
  const path = url.pathname.toLowerCase()
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  // Otestování fronty
  if (url.searchParams.get('test_queue') === '1') {
    MAX_ACTIVE_USERS = 1;
  }
  if (url.searchParams.get('test_queue') === '0') {
    MAX_ACTIVE_USERS = 100;
  }

  // --- ZÁCHRANNÁ BRZDA (Anti-Lockout) ---
  if (url.searchParams.get('override_auth') === 'matrix_neo') {
    const res = NextResponse.redirect(new URL('/seznamka', request.url))
    res.cookies.set('anti_lockout', 'true', { maxAge: 60 * 60 * 24 }) // 24h imunita
    return res
  }

  // Má uživatel imunitu?
  const hasImmunity = request.cookies.has('anti_lockout')
  
  if (!hasImmunity) {
    // --- VIRTUAL QUEUE LOGIC ---
    if (path.startsWith('/seznamka') && path !== '/seznamka/fronta') {
      const now = Date.now();
      
      // Úklid neaktivních uživatelů
      for (const [activeIp, lastSeen] of activeUsers.entries()) {
        if (now - lastSeen > SESSION_TIMEOUT_MS) {
          activeUsers.delete(activeIp);
        }
      }

      if (activeUsers.has(ip)) {
        activeUsers.set(ip, now); // Aktualizace aktivity
      } else {
        if (activeUsers.size < MAX_ACTIVE_USERS) {
          // Je místo, pusť ho dovnitř
          activeUsers.set(ip, now);
          // Pokud byl ve frontě, vymaž ho z ní
          const qIndex = waitingQueue.indexOf(ip);
          if (qIndex > -1) waitingQueue.splice(qIndex, 1);
        } else {
          // Není místo, jde do fronty
          if (!waitingQueue.includes(ip)) {
            waitingQueue.push(ip);
          }
          return NextResponse.redirect(new URL('/seznamka/fronta', request.url));
        }
      }
    }

    // Endpoint pro polling z čekárny
    if (path === '/api/queue/status') {
      const now = Date.now();
      // Úklid
      for (const [activeIp, lastSeen] of activeUsers.entries()) {
        if (now - lastSeen > SESSION_TIMEOUT_MS) {
          activeUsers.delete(activeIp);
        }
      }

      if (activeUsers.has(ip)) {
        return NextResponse.json({ status: 'active' });
      }

      const qIndex = waitingQueue.indexOf(ip);
      if (qIndex === -1) waitingQueue.push(ip); // Pro jistotu přidáme, kdyby vypadl

      // Zkusíme pustit další lidi
      if (activeUsers.size < MAX_ACTIVE_USERS && waitingQueue[0] === ip) {
        waitingQueue.shift();
        activeUsers.set(ip, now);
        return NextResponse.json({ status: 'active' });
      }

      // Stále čeká
      return NextResponse.json({ status: 'waiting', position: waitingQueue.indexOf(ip) + 1 });
    }

    // --- AI DEFENDER CORE (Třída S) ---
  
  // 1. Signatury botů a skenerů
  const isMaliciousBot = 
    userAgent.includes('sqlmap') || 
    userAgent.includes('nikto') || 
    userAgent.includes('nmap') ||
    userAgent.includes('python-requests') ||
    userAgent.includes('curl') && !path.startsWith('/api/') || // curl na frontend je divný
    userAgent.includes('wget');

  // 2. Hledáme typické vektory útoku nebo skenování
  const isSuspiciousPath = 
    path.includes('.env') || 
    path.includes('.php') || 
    path.includes('wp-admin') || 
    path.includes('wp-login') || 
    path.includes('%27') || // SQLi (apostrof)
    path.includes('union+select') || // SQLi
    path.includes('<script>') || // XSS
    path.includes('%3cscript%3e') || // XSS URL encoded
    path.includes('javascript:') || // XSS
    path.includes('../') || // LFI (Local File Inclusion)
    path.includes('..%2f') || // LFI
    path.includes('/etc/passwd') || // LFI
    path.includes('.git/') || // Source Code Exposure
    path.includes('/admin/config') ||
    path.includes('/admin/db-config') // náš honeypot

  const isSuspicious = isMaliciousBot || isSuspiciousPath;

  if (isSuspicious && !path.startsWith('/api/defender')) {
    // Přesměrujeme útočníka na chytrého Defendera, aby s ním hrál hru
    url.pathname = '/api/defender'
    
    // Předáme mu originální URL a další info
    url.searchParams.set('threatPath', path)
    if (isMaliciousBot) url.searchParams.set('bot', 'true')
    
    return NextResponse.rewrite(url)
  }
  // --- KONEC DEFENDERA ---
  }

  // Přidání bezpečnostních hlaviček
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  // Chceme to chytat všude kromě statických souborů
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}
