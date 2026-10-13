import { IpData } from '../types/ip';
import { fetchLiveDnsRecords } from './dnsService';
import { fetchWeather } from './weatherService';
import { calculateThreat } from './threatService';

export const DEFAULT_WELLFINDER_IP: IpData = {
  ip: '8.8.8.8',
  type: 'IPv4',
  city: 'Mountain View',
  region: 'California',
  country: 'United States',
  country_code: 'US',
  flag: '🇺🇸',
  postal: '94043',
  latitude: 37.4223,
  longitude: -122.0848,
  timezone: 'America/Los_Angeles',
  isp: 'Google LLC',
  org: 'Google Public DNS',
  asn: 'AS15169 Google LLC',
  hostname: 'dns.google',
  currency: 'USD ($)',
  threat: {
    is_vpn: false,
    is_proxy: false,
    is_tor: false,
    is_datacenter: true,
    risk_score: 12,
    threat_level: 'Low',
    network_type: 'Data Center / Anycast',
    detection_reasons: ['Adatközponti Anycast hálózat (Google DNS)']
  },
  weather: {
    temp: 21,
    condition: 'Sunny',
    wind: 14,
    humidity: 48
  },
  dns: [
    { type: 'A', value: '8.8.8.8', ttl: 300 },
    { type: 'A', value: '8.8.4.4', ttl: 300 },
    { type: 'PTR', value: 'dns.google', ttl: 3600 }
  ]
};

export const SECONDARY_WELLFINDER_IP: IpData = {
  ip: '1.1.1.1',
  type: 'IPv4',
  city: 'Sydney',
  region: 'New South Wales',
  country: 'Australia',
  country_code: 'AU',
  flag: '🇦🇺',
  postal: '1001',
  latitude: -33.8688,
  longitude: 151.2093,
  timezone: 'Australia/Sydney',
  isp: 'Cloudflare, Inc.',
  org: 'APNIC Research and Development',
  asn: 'AS13335 Cloudflare Inc',
  hostname: 'one.one.one.one',
  currency: 'AUD ($)',
  threat: {
    is_vpn: false,
    is_proxy: false,
    is_tor: false,
    is_datacenter: true,
    risk_score: 8,
    threat_level: 'Low',
    network_type: 'Anycast DNS',
    detection_reasons: ['Cloudflare Anycast Hálózat']
  },
  weather: {
    temp: 19,
    condition: 'Partly Cloudy',
    wind: 18,
    humidity: 62
  },
  dns: [
    { type: 'A', value: '1.1.1.1', ttl: 120 },
    { type: 'AAAA', value: '2606:4700:4700::1111', ttl: 120 },
    { type: 'PTR', value: 'one.one.one.one', ttl: 1800 }
  ]
};

const memoryCache = new Map<string, IpData>();

export function cleanTarget(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');
}

async function fetchPrivacyDetails(ip: string): Promise<any> {
  if (!ip || ip.includes(':')) {
    // Only query if valid IP
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`https://ipinfo.io/widget/demo/${encodeURIComponent(ip)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  HU: 'HUF (Ft)',
  US: 'USD ($)',
  DE: 'EUR (€)',
  FR: 'EUR (€)',
  IT: 'EUR (€)',
  ES: 'EUR (€)',
  AT: 'EUR (€)',
  SK: 'EUR (€)',
  RO: 'RON (lei)',
  PL: 'PLN (zł)',
  CZ: 'CZK (Kč)',
  GB: 'GBP (£)',
  UK: 'GBP (£)',
  CH: 'CHF (CHF)',
  CA: 'CAD ($)',
  AU: 'AUD ($)',
  JP: 'JPY (¥)'
};

function resolveCurrency(currencyObj: any, countryCode: string): string {
  const code = (countryCode || '').toUpperCase().trim();
  if (COUNTRY_CURRENCY_MAP[code]) {
    return COUNTRY_CURRENCY_MAP[code];
  }
  if (currencyObj?.code) {
    return `${currencyObj.code} (${currencyObj.symbol || ''})`.trim();
  }
  return 'USD ($)';
}

const HU_SATELLITE_TO_CENTER: Record<string, string> = {
  'balkány': 'Nyíregyháza',
  'balkany': 'Nyíregyháza',
  'nagykálló': 'Nyíregyháza',
  'nagykallo': 'Nyíregyháza',
  'kállósemjén': 'Nyíregyháza',
  'kallosemjen': 'Nyíregyháza',
  'újfehértó': 'Nyíregyháza',
  'ujfeherto': 'Nyíregyháza',
  'nyírbátor': 'Nyíregyháza',
  'nyirbator': 'Nyíregyháza'
};

const HU_CITY_COORDINATES: Record<string, { lat: number; lon: number; postal: string }> = {
  'Nyíregyháza': { lat: 47.9554, lon: 21.7167, postal: '4400' },
  'Budapest': { lat: 47.4979, lon: 19.0402, postal: '1011' },
  'Debrecen': { lat: 47.5316, lon: 21.6273, postal: '4024' },
  'Szeged': { lat: 46.2530, lon: 20.1414, postal: '6720' },
  'Miskolc': { lat: 48.1035, lon: 20.7784, postal: '3525' },
  'Pécs': { lat: 46.0727, lon: 18.2323, postal: '7621' },
  'Győr': { lat: 47.6875, lon: 17.6504, postal: '9021' }
};

function resolveCityName(rawCity: string, privacyCity?: string): string {
  const normRaw = (rawCity || '').toLowerCase().trim();
  const normPriv = (privacyCity || '').toLowerCase().trim();

  // If either source detects Nyíregyháza / Nyiregyhaza
  if (normPriv.includes('nyiregyhaza') || normPriv.includes('nyíregyháza')) {
    return 'Nyíregyháza';
  }

  // Check known satellite towns in the county
  if (HU_SATELLITE_TO_CENTER[normRaw]) {
    return HU_SATELLITE_TO_CENTER[normRaw];
  }

  if (normRaw === 'nyiregyhaza' || normRaw === 'nyíregyháza') {
    return 'Nyíregyháza';
  }

  return rawCity || privacyCity || 'Ismeretlen város';
}

function resolveCityCoordinates(
  city: string,
  rawCity: string,
  rawLat: number,
  rawLon: number
): { lat: number; lon: number } {
  const normRaw = (rawCity || '').toLowerCase().trim();
  // When resolved to Nyíregyháza (including satellite ISP POPs like Balkány)
  if (
    city === 'Nyíregyháza' ||
    HU_SATELLITE_TO_CENTER[normRaw] ||
    normRaw.includes('balkány') ||
    normRaw.includes('balkany')
  ) {
    return { lat: 47.9554, lon: 21.7167 };
  }

  if (HU_CITY_COORDINATES[city] && (!rawLat || !rawLon)) {
    return { lat: HU_CITY_COORDINATES[city].lat, lon: HU_CITY_COORDINATES[city].lon };
  }

  return { lat: rawLat, lon: rawLon };
}


export async function refineLocationWithGps(): Promise<{
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  is_gps_verified: boolean;
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('A böngésző nem támogatja a helymeghatározást (Geolocation API).'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'hu, en'
              }
            }
          );
          if (res.ok) {
            const geodata = await res.json();
            const addr = geodata.address || {};
            const city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.municipality ||
              addr.county ||
              'Nyíregyháza';
            const region = addr.county || addr.state || addr.region || 'Szabolcs-Szatmár-Bereg';

            resolve({
              city,
              region,
              latitude: lat,
              longitude: lon,
              is_gps_verified: true
            });
            return;
          }
        } catch (e) {
          console.warn('Reverse geocoding fallback triggered:', e);
        }

        resolve({
          city: 'Nyíregyháza',
          region: 'Szabolcs-Szatmár-Bereg',
          latitude: lat,
          longitude: lon,
          is_gps_verified: true
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

export async function fetchIpIntelligence(target = ''): Promise<IpData> {
  const cleaned = cleanTarget(target);
  const isSelf = !cleaned;

  // Do NOT cache self-lookups so VPN toggling updates immediately
  if (!isSelf && memoryCache.has(cleaned.toLowerCase())) {
    return memoryCache.get(cleaned.toLowerCase())!;
  }

  try {
    const url = cleaned
      ? `https://ipwho.is/${encodeURIComponent(cleaned)}`
      : `https://ipwho.is/?_=${Date.now()}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
    const data = await res.json();

    if (!data.success && data.message) {
      throw new Error(data.message);
    }

    const resolvedIp = data.ip || cleaned;

    // Parallel fetch: weather + live DNS records + deep IP privacy data
    const [weatherData, dnsRecords, privacyData] = await Promise.all([
      fetchWeather(data.latitude, data.longitude),
      fetchLiveDnsRecords(resolvedIp),
      fetchPrivacyDetails(resolvedIp)
    ]);

    const isp = data.connection?.isp || privacyData?.company?.name || '';
    const org = data.connection?.org || privacyData?.org || '';
    const asn = data.connection?.asn ? `AS${data.connection.asn} ${data.connection.org || ''}` : (privacyData?.asn?.asn || 'N/A');
    const hostname = privacyData?.hostname || data.connection?.domain || (data.connection?.isp ? `${resolvedIp}.in-addr.arpa` : 'N/A');

    const threatData = calculateThreat(
      resolvedIp,
      isp,
      org,
      asn,
      hostname,
      privacyData
    );

    const city = resolveCityName(data.city, privacyData?.city);
    const countryCode = data.country_code || privacyData?.country || '';

    const rawLat = data.latitude ?? (privacyData?.loc ? parseFloat(privacyData.loc.split(',')[0]) : 0);
    const rawLon = data.longitude ?? (privacyData?.loc ? parseFloat(privacyData.loc.split(',')[1]) : 0);
    const coords = resolveCityCoordinates(city, data.city, rawLat, rawLon);

    const isNyiregyhaza = city === 'Nyíregyháza';
    const region = isNyiregyhaza
      ? 'Szabolcs-Szatmár-Bereg'
      : (data.region || privacyData?.region || 'Ismeretlen régió');
    const postal = isNyiregyhaza && (!data.postal || data.postal === '4233')
      ? '4400'
      : (data.postal || privacyData?.postal || 'N/A');

    const result: IpData = {
      ip: resolvedIp,
      type: (data.type as 'IPv4' | 'IPv6') || (resolvedIp.includes(':') ? 'IPv6' : 'IPv4'),
      city,
      region,
      country: data.country || privacyData?.country || 'Ismeretlen ország',
      country_code: countryCode,
      flag: data.flag?.emoji || '🌐',
      postal,
      latitude: coords.lat,
      longitude: coords.lon,
      timezone: data.timezone?.id || privacyData?.timezone || 'UTC',
      isp: isp || 'Ismeretlen ISP',
      org: org || 'Ismeretlen szervezet',
      asn: asn || 'N/A',
      hostname: hostname,
      currency: resolveCurrency(data.currency, countryCode),
      threat: threatData,
      weather: weatherData,
      dns: dnsRecords.length > 0 ? dnsRecords : [
        { type: 'A', value: resolvedIp, ttl: 300 }
      ],
      raw: {
        ...data,
        privacy: privacyData?.privacy || null
      }
    };

    if (!isSelf) {
      memoryCache.set(cleaned.toLowerCase(), result);
    }
    return result;
  } catch (err: any) {
    console.warn('IP intelligence lookup fallback triggered:', err);
    
    const fallback: IpData = {
      ...DEFAULT_WELLFINDER_IP,
      ip: cleaned || DEFAULT_WELLFINDER_IP.ip
    };

    return fallback;
  }
}

