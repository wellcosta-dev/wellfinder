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

## 🐳 Docker & Hostinger Telepítés (`wellfinder.hu`)

A projekt fel van készítve közvetlen Git alapú Hostinger VPS vagy Docker telepítésre a mellékelt multi-stage `Dockerfile`, `docker-compose.yml` és `nginx.conf` segítségével.

### 1. Domain & DNS beállítások (Hostinger hPanel)
A Hostinger hPanel DNS zóna kezelőjében állítsd be a következő rekordokat a domainhez:
| Típus | Név (Host) | Érték (Tartalom) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | *A Hostinger VPS szervered nyilvános IPv4 címe* | 14400 |
| **CNAME** | `www` | `wellfinder.hu` | 14400 |

### 2. Első telepítés a Hostinger VPS-en (SSH)
Lépj be SSH-n a VPS-re, majd hajtsd végre a következő lépéseket:

```bash
# 1. Frissítés és Docker telepítése (ha még nincs fent)
sudo apt update && sudo apt install -y git docker.io docker-compose-plugin

# 2. A git repository klónozása
git clone https://github.com/wellcosta-dev/wellfinder.git /var/www/wellfinder.hu
cd /var/www/wellfinder.hu

# 3. Konténer építése és indítása a háttérben
docker compose up -d --build
```

A weboldal azonnal elérhetővé válik a 80-as porton a `http://wellfinder.hu` címen.

### 3. Ingyenes SSL (HTTPS) beállítása (Certbot)
Ha közvetlenül a VPS-en szeretnél ingyenes Let's Encrypt SSL tanúsítványt:
```bash
sudo apt install -y certbot python3-certbot-nginx
# Vagy Cloudflare ingyenes SSL proxy esetén egyetlen kattintással aktiválható!
```

### 4. Frissítés élesítése új kód felküldése után (1 parancs)
Amikor helyi gépen frissíted a kódot és push-olod (`git push origin main`), a szerveren csak ezt kell futtatnod:
```bash
cd /var/www/wellfinder.hu && git pull && docker compose up -d --build
```


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
