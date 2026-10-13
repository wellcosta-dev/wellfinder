# 🌐 WellFinder (`wellfinder.hu`)

> **Prémium IP Intelligence, Kiberbiztonsági Elemző & Hálózati Diagnosztikai Rendszer**  
> Fejlesztette: [Wellcosta Development](https://wellcosta.dev)

![WellFinder Banner](https://img.shields.io/badge/WellFinder-v3.0_PRO-06b6d4?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Áttekintés

A **WellFinder** egy modern, ultragyors és nagy pontosságú IP intelligence és hálózati diagnosztikai webalkalmazás, amely a legújabb webes technológiákkal épült fel. Lehetővé teszi bármely IPv4 / IPv6 cím, illetve domain név azonnali feloldását, részletes földrajzi helymeghatározását, ASN hálózati útvonalának és biztonsági kockázatainak feltárását.

---

## ✨ Főbb Funkciók

### 1. 🎯 Irányítópult (Dashboard)
- **Azonnali Célpont Elemzés**: IP verzió (IPv4/IPv6), országbélyeg és zászló, város, megye/régió, irányítószám.
- **Helyi Időjárás és Valós Idejű Óra**: Célállomás időzónája szerinti másodperc-pontos óra és élő időjárás-jelentés (Open-Meteo API).
- **Hálózati & ASN Részletek**: Szolgáltató (ISP), Autonóm Rendszer (ASN), szervezet, helyi pénznem.

### 2. 🛡️ Kiberbiztonsági Kockázatelemzés (Threat Intel)
- **Csalási & Kockázati Pontszám (Fraud Score: 0–100)** grafikus dinamikus szintmérővel.
- **VPN & Proxy Észlelés**: Kereskedelmi VPN-ek és proxy-k azonosítása.
- **Tor Exit Node Detektálás**: Anonimizáló hálózati végpontok figyelése.
- **Adatközponti / Cloud Anycast Jelzés**: Tárhelyszolgáltatók (AWS, Cloudflare, Google, Hetzner stb.) szűrése lakossági kapcsolatokkal szemben.

### 3. ⚡ Élő Ping & Késleltetés Diagnosztika
- Valós idejű kerekítési válaszidő (RTT) mérés.
- Interaktív késleltetési oszlopdiagram animációval és hover buborékokkal.
- Minimum, maximum, átlagos késleltetés és csomagvesztési mutatók.

### 4. 🛰️ Interaktív Térkép (OpenStreetMap HUD)
- Éjszakai, sötét tónusú térképréteg beágyazva.
- Élő koordináta HUD (szélesség és hosszúság 4 tizedes pontossággal).
- Közvetlen mélyhivatkozás Google Térképre és OpenStreetMapre.

### 5. 📡 DNS Szonda (Cloudflare DoH Integráció)
- Valós idejű DNS zónalekérdezés: `A`, `AAAA`, `MX`, `TXT`, `NS`, `CNAME`, `PTR`.
- Cloudflare 1.1.1.1 DNS-over-HTTPS JSON API integráció.
- Típus szerinti szűrés és másolási funkció.

### 6. ⚖️ Két IP Cím Összehasonlítása (Split-View)
- Két szerver vagy hálózat egymás melletti összevetése (pl. Cloudflare vs. Google DNS).
- Szolgáltató, lokáció, ASN, időzóna és kockázati pontszámok összehasonlító táblázata.

### 7. 📑 Tömeges IP Elemző (Batch Processor)
- Akár 25 IP cím vagy domain név párhuzamos, soronkénti feldolgozása.
- Folyamatjelző sáv.
- Egykattintásos **CSV** és **JSON** exportálás.

### 8. 💻 Nyers JSON Adatstruktúra
- Teljes API válaszobjektum formázott, szintaxis-kiemelt megjelenítése.
- Vágólapra másolás és fájlletöltés egy kattintással.

### 9. 🌍 Kétnyelvű Támogatás (Bilingual i18n)
- Magyar 🇭🇺 és Angol 🇬🇧 azonnali nyelvváltó a fejlécben, `localStorage` alapú állapotmegőrzéssel.

---

## 🛠️ Telepítés és Futtatás

### Előfeltételek
- **Node.js**: v18+ (ajánlott: v20 vagy v24)
- **npm** vagy **pnpm**

### Fejlesztői szerver indítása
```bash
npm install
npm run dev
```
A szerver elérhető: `http://localhost:3000`

### Éles build készítése (Production)
```bash
npm run build
```
A lefordított, optimalizált és minimalizált állományok a `dist/` mappába kerülnek.

### Build előnézete
```bash
npm run preview
```

---

## 📂 Mappaszerkezet

```
wellfinder.hu/
├── index.html                   # Fő belépési HTML (SEO, Favicon, Meta adatok)
├── package.json                 # Csomagfüggőségek és parancsok
├── vite.config.ts               # Vite konfiguráció
├── tailwind.config.js           # Tailwind CSS beállítások és design tokenek
├── postcss.config.js            # PostCSS pluginok
├── tsconfig.json                # TypeScript konfiguráció
├── src/
│   ├── main.tsx                 # React gyökér komponens mountolása
│   ├── App.tsx                  # Fő alkalmazás komponens (fülek, állapotok)
│   ├── index.css                # Globális CSS, scrollbar, neon glow effektek
│   ├── types/
│   │   └── ip.ts                # TypeScript típusdefiníciók
│   ├── i18n/
│   │   └── translations.ts      # Magyar és angol fordítási szótár
│   ├── services/
│   │   ├── ipService.ts         # IP intelligence, cache és fallback motor
│   │   ├── dnsService.ts        # Cloudflare DoH valós DNS lekérdezések
│   │   ├── weatherService.ts    # Open-Meteo élő időjárás lekérdező
│   │   └── threatService.ts     # Kiberbiztonsági kockázati heurisztika
│   └── components/
│       ├── Header.tsx           # Fejléc, logó, fülek, nyelvválasztó
│       ├── SearchBar.tsx        # Keresőmező, gyorsválasztó gombok
│       ├── Footer.tsx           # Lábléc, Wellcosta fejlesztői adatok
│       ├── Dashboard/           # Irányítópult komponensek
│       │   ├── HeroBanner.tsx
│       │   ├── ThreatCard.tsx
│       │   ├── PingCard.tsx
│       │   ├── DnsCard.tsx
│       │   ├── MapCard.tsx
│       │   └── NetworkSpecsCard.tsx
│       ├── DnsInspector/        # DNS szonda nézet
│       │   └── DnsInspectorView.tsx
│       ├── Compare/             # Összehasonlító nézet
│       │   └── CompareView.tsx
│       ├── Batch/               # Tömeges elemző nézet
│       │   └── BatchView.tsx
│       └── RawJson/             # Nyers JSON nézet
│           └── RawJsonView.tsx
```

---

## 🔒 Biztonság és Adatvédelem

A WellFinder kliensoldali lekérdezéseket hajt végre, a keresési előzmények nem kerülnek mentésre vagy követésre harmadik fél számára.

Fejlesztette a **Wellcosta Development** csapata.
