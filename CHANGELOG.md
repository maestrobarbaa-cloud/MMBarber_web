# CHANGELOG — MMBarber Web

## [v3.5.0] — 2026-08-21

Velký update zahrnující nové funkcionality, přepracované komponenty a nové sekce webu.

---

### ✨ Nové stránky a sekce

- **`/seznamka`** — Kompletní barbershop seznamka: swipe systém, profily, shody (matches), zprávy, front systém, voucher systém, admin dashboard
- **`/zivotopisy`** — Rozšířená stránka životopisů (CV) s novými funkcemi a layoutem
- **`/rodina/elektrikari/roman-jakubcak`** — Přepracovaná stránka elektrikáře s novým designem
- **`/skryta-mista`** — Přepracovaná stránka skrytých míst
- **`/pribeh`** — Aktualizovaná stránka příběhu
- **`/komunita`** — Nová sekce komunity s projekty a chatem
- **`/komunita/chat`** — Komunitní chat
- **`/komunita/nabor`** — Nábor do komunity
- **`/barbershop-kunovice`**, **`/barbershop-napajedla`**, **`/barbershop-otrokovice`**, **`/barbershop-stare-mesto`** — SEO stránky pro jednotlivé pobočky
- **`/blog`** — Nová blogová sekce
- **`/jobs`** — Stránka pracovních nabídek
- **`/company/register`** — Registrace firem
- **`/dashboard`** — Uživatelský dashboard
- **`/donate-wall`** — Zeď dárků / donátorů
- **`/auth`** — Nový auth systém (NextAuth)

---

### 🔧 Nové API endpointy

- **`/api/appointments`** — Rezervační systém
- **`/api/auth`** — Autentizace (NextAuth)
- **`/api/barbers/availability`** — Dostupnost holičů
- **`/api/company`** — Správa firem
- **`/api/cron`** — Pravidelné cronjobs
- **`/api/cv-auth`** — CV autentizace
- **`/api/defender`** — Bezpečnostní endpoint
- **`/api/donations`** — Donace
- **`/api/electrician-prices`** — Ceny elektrikáře
- **`/api/events`** — Eventy/akce
- **`/api/jobs`** — Pracovní nabídky
- **`/api/matches`** — Shody (seznamka)
- **`/api/messages`** — Zprávy
- **`/api/profiles`** — Uživatelské profily
- **`/api/seznamka/*`** — Celý backend pro seznamku (auth, friends, link, match, profile, search, vouchers)
- **`/api/swipe`** — Swipe mechanismus
- **`/api/upload`** — Upload fotek
- **`/api/verify-salon`** — Ověření salonu
- **`/api/winners`** — Výherci
- **`/api/admin`** — Admin API (users, companies)

---

### 🎨 Komponenty — nové

- **`Providers`** — Session/NextAuth provider
- **`BookingModal`** — Modál pro rezervace
- **`InstallPrompt`** — PWA install prompt
- **`SlotMachine`** — Slot machine pro losování
- **`AntiTheft`** — Ochrana obsahu
- **`BookChaptersLayout`** — Layout pro knihu kapitol
- **`SEOHomepageContent`** — SEO obsah homepage
- **`seznamka/*`** — Celá sada komponent pro seznamku (Auth, ProfileSetup, Pond, Matches, LikedYou, OnboardingGuide, AdminDashboard, SearchPeople, UserSettings, LinkedAccountsSettings, ProfileCard...)
- **`booking/*`** — Komponenty rezervačního systému
- **`auth/*`** — Auth komponenty
- **`company/*`** — Komponenty pro firmy
- **`donate/*`** — Komponenty pro donace
- **`jobs/*`** — Komponenty pro pracovní nabídky

---

### 🔄 Přepracované komponenty

| Komponenta | Změny |
|---|---|
| `Header` | Nový design, mobilní menu, nové navigační položky |
| `Hero` | Aktualizovaný obsah a animace |
| `Profiles` | Rozšířené profily holičů |
| `Partners` | Nový layout, přidáni noví partneři |
| `Services` | Přepracované zobrazení služeb |
| `HolidayCountdown` | Kompletní přepis s novými funkcemi |
| `Intro` | Nové intro animace |
| `Contact` | Přepracovaný kontaktní formulář |
| `GraphicsSettingsModal` | Rozšířené grafické nastavení |
| `FloatingScissors` | Vylepšené animace |
| `ElitaGame` | Rozšířená hra |
| `TableOfContents` | Nový obsah |
| `CustomCursor` | Vylepšený cursor |
| `OptimizedImage` | Lepší optimalizace obrázků |
| `Gallery` | Aktualizovaná galerie |

---

### 🗄️ Databáze & Backend

- Přidán **Prisma ORM** s SQLite (development) databází
- **NextAuth** autentizace (Google OAuth + credentials)
- Schéma pro: Users, Profiles, Matches, Messages, Appointments, Companies, Jobs, Donations, Winners
- JSON databáze rozšířena o nicknames, ratings, status systém

---

### ⚙️ Konfigurace & Výkon

- `next.config.ts` — Omezení RAM pro build (`max-old-space-size=768`), optimalizace obrázků
- `package.json` — Nové závislosti: NextAuth, Prisma, bcryptjs, framer-motion, gsap, lucide-react, sharp
- `globals.css` — Přidány nové globální styly a CSS variables
- `robots.txt` — Přidána pravidla pro webové crawlery
- Middleware pro ochranu chráněných routes

---

### 🌐 Lokalizace

- Rozšířeny překlady (`translations.ts`)
- Přidán obsah pro magazín (`magazine_content.ts`)

---

*Generováno: 2026-08-21*
