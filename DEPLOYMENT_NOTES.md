# 📋 DEPLOYMENT NOTES — MMBarber v3.5.0
**Datum:** 16. září 2026  
**Branch:** `v3.5.0-dev` → mergnutá do `main`  
**Prostředí serveru:** aaPanel (Linux, Node v20.20.2, npm 11.13.0)

---

## 🎯 Cíl

Dostat novou verzi webu (`v3.5.0-dev`) na produkční server místo staré verze z května.  
Nová verze přidává vylepšení hlavní stránky, přičemž **Seznamka** je dočasně skryta veřejnosti (stále existuje v kódu, ale není dostupná přes navigaci – jen přesměrování na `/`).

---

## 🔄 Co bylo změněno oproti původní (staré) verzi

### 1. Odebrán barber "Nella"
- **Soubor:** `src/data/barbers.ts`
- Profilová karta barbery "Nelly" byla odstraněna z pole `barbers[]`.
- Zůstal pouze barber **Tomáš**.

### 2. Skryta navigace na Seznamku
- **Soubor:** `src/components/Intro.tsx`
- Menu položka "Seznamka" byla odstraněna z navigačního menu.
- **Soubor:** `src/components/Services.tsx`
- Sekce Seznamka je zakomentována.
- **Soubor:** `next.config.ts`
- Přidána přesměrování: `/seznamka` a `/seznamka/:path*` → `/` (permanent: false).
- Kód Seznamky zůstal v repozitáři, ale veřejnost se k ní nedostane.

### 3. Přidány chybějící závislosti (balíčky)
- **Soubor:** `package.json`
- Chybějící balíčky oproti původní verzi (byly ztraceny při kopírování/mergu):
  ```
  @auth/prisma-adapter
  @google/genai
  @react-three/drei
  @react-three/fiber
  @react-three/rapier
  bcryptjs
  next-auth
  react-easy-crop
  recharts
  stripe
  three
  @types/bcryptjs (devDependencies)
  @types/three (devDependencies)
  ```

### 4. Opravena verze Prisma (prevence rozbití buildu)
- **Soubor:** `package.json`
- Přidána **pevná** závislost `"prisma": "^6.19.3"` a `"@prisma/client": "^6.19.3"`.
- Problém: Server dříve neměl Prismu v `package.json`, takže při `npx prisma generate` stáhl automaticky **Prisma v7**, která je nekompatibilní se starým `schema.prisma`.
- Řešení: Pevná verze 6.x zabrání auto-upgradu na v7.

### 5. Opraven syntax error v barbers.ts
- **Soubor:** `src/data/barbers.ts`
- Chyběla uzavírací složená závorka `}` u objektu barbera Tomáše v poli – způsobovalo chybu `Expected ',', got ']'` při buildu.

### 6. Odstraněn balíček `sharp`
- **Soubor:** `package.json`
- `sharp` byl odebrán z dependencies.
- Důvod: `sharp` vyžaduje kompilaci nativních C++ binárií při `npm install`, což na slabším serveru trvalo zbytečně dlouho a prodlužovalo deployment.
- Next.js funguje bez `sharp` – jen použije základní WebP optimalizaci místo pokročilé.

---

## 🏗️ Nová strategie deploymentu (DŮLEŽITÉ!)

### Problém se serverem
aaPanel má **timeout 120 sekund** na celý update proces:
- `git clone` → ~10s
- `npm install` → ~45s (se všemi novými balíčky)
- `next build` → potřebuje ~90–120s

Celkem **přes 2 minuty** → server spojení přeruší.

### Řešení: Pre-built deployment

**Aplikace se builduje lokálně na vývojářském PC a výsledek `.next/` se commituje do Gitu.**

Server pak jen:
1. Naklonuje repo (obsahuje hotový `.next/`)
2. Spustí `npm install`
3. Spustí `prisma generate` (rychlé, ~2s)
4. Přeskočí `next build` (nic nebuilduje!)
5. Spustí `next start` → okamžitě servíruje

### Změny v souborech pro novou strategii

#### `package.json` — nový build skript
```json
"scripts": {
  "dev": "next dev",
  "build": "npx prisma generate && echo 'Pre-built .next directory is shipped with the repo - skipping next build on server.'",
  "build:local": "npx prisma generate && node scripts/build.mjs",
  "start": "next start",
  "lint": "eslint"
}
```
- `npm run build` → použije server (jen Prisma + echo, žádný Next.js build)
- `npm run build:local` → pro vývojáře lokálně (plný Next.js build)

#### `.gitignore` — povolení `.next/` v Gitu
```
# Původní (zakazovalo celé .next/):
/.next/

# Nové (povoluje server+static, zakazuje jen obří složky):
/.next/cache/
/.next/node_modules/
/.next/standalone/
/.next/build/
/.next/dev/
/.next/diagnostics/
/.next/types/
/out/
```

#### Co je commitnuté v `.next/`
- `.next/server/` (~86 MB) — server-side JS bundly
- `.next/static/` (~10 MB) — client-side chunks, CSS, fonty
- `.next/BUILD_ID`, `.next/build-manifest.json`, `.next/routes-manifest.json`, `.next/prerender-manifest.json` a dalších 11 manifest souborů v kořeni `.next/` — bez nich `next start` hlásí "Could not find a production build"

---

## 🔁 Jak provést update webu do budoucna

> **Pokaždé, když chceš nasadit novou verzi na server, musíš nejdřív zbuildovat lokálně:**

```bash
# 1. Proveď změny v kódu

# 2. Zbuilduj lokálně
npm run build:local

# 3. Commitni hotový build + zdrojové soubory
git add -A
git commit -m "feat: popis zmeny (pre-built)"

# 4. Pushnout
git push origin main

# 5. Kliknout na "Update" v aaPanel
```

---

## 🚨 Jak se vrátit na starou (funkční) verzi z května

Pokud by se něco pokazilo a bylo třeba se vrátit na **starší fungující verzi** (bez Nelly, bez nových features), stačí:

```bash
# Na GitHubu existují commity z doby, kdy web fungoval
# Najdi hash starého funkčního commitu přes:
git log --oneline

# Vrátit lokálně na starý commit:
git checkout <HASH_STARE_VERZE>

# Nebo vytvořit nový branch ze starého commitu a pushnout na main:
git checkout -b rollback-old-version <HASH_STARE_VERZE>
git push origin rollback-old-version:main --force
```

> ⚠️ **Pozor:** Stará verze neobsahuje `.next/` v Gitu, takže pro ni by bylo potřeba buď:
> - Zbuildovat lokálně a přidat `.next/` (jako jsme to udělali teď)
> - Nebo mít přístup k SSH/terminálu serveru a buildovat přímo tam (pokud dostaneme přístup)

---

## 📊 Timeline chyb a oprav (16.9.2026)

| Čas | Chyba | Řešení |
|-----|-------|--------|
| ~12:36 | `EBADENGINE` – Prisma v7 auto-install | Přidána pevná Prisma ^6 do package.json |
| ~12:45 | `P1012` – Prisma schema validation error | Vyřešeno správnou verzí Prisma |
| ~13:05 | `Connection lost` – 120s timeout | Odstraněn `sharp`, zvýšen taskset na 4 jádra |
| ~13:11 | `Connection lost` – stále timeout | Build trvá i na 4 jádrech příliš dlouho |
| ~13:16 | `Module not found` – 82 chyb | Nainstalované všechny chybějící balíčky |
| ~13:16 | `Expected ',', got ']'` – syntax error | Opravena závorka v barbers.ts |
| ~13:27 | `Connection lost` – timeout i po opravách | Nová strategie: pre-built deployment |
| ~13:33 | ✅ `Update complete!` | Pre-built `.next/` v Gitu |
| ~13:36 | `Could not find a production build` | Chyběly manifest soubory v kořeni `.next/` |
| ~13:38 | ✅ Vše commitnuté | Přidáno 15 manifest souborů do Gitu |

---

## 🗂️ Přehled klíčových souborů

| Soubor | Co dělá |
|--------|---------|
| `package.json` | Závislosti + build skripty (build vs build:local) |
| `.gitignore` | Povoluje `.next/server` a `.next/static` v Gitu |
| `scripts/build.mjs` | Build script s taskset CPU limitem (pro server, nyní nevyužíván) |
| `next.config.ts` | Přesměrování Seznamky, výkon, bezpečnostní hlavičky |
| `src/data/barbers.ts` | Seznam barberů (Nella odstraněna) |
| `src/components/Intro.tsx` | Navigace (Seznamka skryta) |
| `src/components/Services.tsx` | Sekce služeb (Seznamka zakomentována) |
| `prisma/schema.prisma` | Databázové schéma (kompatibilní s Prisma v6) |
| `.next/` | Pre-built výstup Next.js (server + static + manifesty) |

---

*Dokument vytvořen: 16. 9. 2026*  
*Autor: Antigravity IDE (AI asistent)*
