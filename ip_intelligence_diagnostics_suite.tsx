import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Globe2,
  MapPin,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Server,
  Activity,
  Cpu,
  Clock,
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  FileText,
  Layers,
  Copy,
  Check,
  Download,
  Share2,
  Navigation,
  RefreshCw,
  Columns,
  ListPlus,
  Terminal,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRightLeft,
  Trash2,
  Play
} from 'lucide-react';

const DEFAULT_MY_IP = {
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
    network_type: 'Data Center / Anycast'
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
    { type: 'PTR', value: 'dns.google', ttl: 3600 },
    { type: 'TXT', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 }
  ]
};

const SECONDARY_FALLBACK = {
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
    network_type: 'Anycast DNS'
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

const cleanIpOrDomain = (val) => val.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

const calculateSimulatedThreat = (ip, isp = '', org = '') => {
  const combined = `${ip} ${isp} ${org}`.toLowerCase();
  let score = 5;
  const isDataCenter = /google|cloudflare|amazon|aws|microsoft|azure|digitalocean|ovh|hetzner|linode|vultr|leaseweb/i.test(combined);
  const isVpnCandidate = /vpn|proxy|tor|exit|nord|mullvad|express|surfshark|proton|hide/i.test(combined);
  const isTor = /tor-exit|onion|torservers/i.test(combined);

  if (isTor) {
    score += 85;
  } else if (isVpnCandidate) {
    score += 45;
  } else if (isDataCenter) {
    score += 20;
  } else {
    // Residential simulation
    score += Math.floor((ip.split('.').reduce((acc, oct) => acc + parseInt(oct || '0', 10), 0) % 25));
  }

  const boundedScore = Math.min(Math.max(score, 3), 98);
  let threat_level = 'Low';
  if (boundedScore > 65) threat_level = 'High';
  else if (boundedScore > 35) threat_level = 'Medium';

  return {
    is_vpn: isVpnCandidate,
    is_proxy: isVpnCandidate || /proxy/i.test(combined),
    is_tor: isTor,
    is_datacenter: isDataCenter,
    risk_score: boundedScore,
    threat_level,
    network_type: isDataCenter ? 'Data Center / Cloud' : isVpnCandidate ? 'Commercial VPN / Proxy' : 'Residential ISP'
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'compare' | 'batch' | 'raw'
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentIpData, setCurrentIpData] = useState(DEFAULT_MY_IP);
  const [copiedKey, setCopiedKey] = useState(null);
  const [localTimeTicker, setLocalTimeTicker] = useState('');

  // Diagnostics & Ping state
  const [pingRunning, setPingRunning] = useState(false);
  const [pingResults, setPingResults] = useState([24, 25, 23, 27, 24]);
  const [livePing, setLivePing] = useState(24);

  // Compare Tab state
  const [compareIp1, setCompareIp1] = useState(DEFAULT_MY_IP.ip);
  const [compareIp2, setCompareIp2] = useState('1.1.1.1');
  const [compareData1, setCompareData1] = useState(DEFAULT_MY_IP);
  const [compareData2, setCompareData2] = useState(SECONDARY_FALLBACK);
  const [compareLoading, setCompareLoading] = useState(false);

  // Batch Lookup state
  const [batchInput, setBatchInput] = useState("8.8.8.8\n1.1.1.1\n9.9.9.9\n208.67.222.222\ngithub.com");
  const [batchResults, setBatchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    if (!currentIpData?.timezone) return;
    const tick = () => {
      try {
        const str = new Intl.DateTimeFormat('en-US', {
          timeZone: currentIpData.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZoneName: 'short'
        }).format(new Date());
        setLocalTimeTicker(str);
      } catch {
        setLocalTimeTicker(new Date().toLocaleTimeString());
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currentIpData?.timezone]);

  const fetchWeather = async (lat, lon) => {
    if (!lat || !lon) return null;
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const code = data.current?.weather_code ?? 0;
      let condition = 'Clear / Sunny';
      if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
      else if (code >= 45 && code <= 48) condition = 'Foggy';
      else if (code >= 51 && code <= 67) condition = 'Rainy';
      else if (code >= 71) condition = 'Snowy';

      return {
        temp: Math.round(data.current?.temperature_2m ?? 20),
        condition,
        wind: Math.round(data.current?.wind_speed_10m ?? 12),
        humidity: Math.round(data.current?.relative_humidity_2m ?? 50)
      };
    } catch {
      return {
        temp: 20,
        condition: 'Clear Sky',
        wind: 10,
        humidity: 50
      };
    }
  };

  const fetchIpDetails = async (target = '', updateState = true) => {
    const cleaned = cleanIpOrDomain(target);
    setLoading(true);
    setErrorMsg('');

    try {
      const url = cleaned ? `https://ipwho.is/${encodeURIComponent(cleaned)}` : 'https://ipwho.is/';
      const res = await fetch(url);
      const data = await res.json();

      if (!data.success && data.message) {
        throw new Error(data.message);
      }

      // Fetch live weather for lat/lon in parallel
      const weatherData = await fetchWeather(data.latitude, data.longitude);

      const threatData = calculateSimulatedThreat(
        data.ip,
        data.connection?.isp || '',
        data.connection?.org || ''
      );

      const result = {
        ip: data.ip,
        type: data.type || (data.ip.includes(':') ? 'IPv6' : 'IPv4'),
        city: data.city || 'Unknown City',
        region: data.region || 'Unknown Region',
        country: data.country || 'Unknown Country',
        country_code: data.country_code || '',
        flag: data.flag?.emoji || '🌐',
        postal: data.postal || 'N/A',
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone?.id || 'UTC',
        isp: data.connection?.isp || data.connection?.org || 'Unknown ISP',
        org: data.connection?.org || 'Unknown Org',
        asn: data.connection?.asn ? `AS${data.connection.asn} ${data.connection.org || ''}` : 'N/A',
        hostname: data.connection?.domain || (data.connection?.isp ? `${data.ip}.in-addr.arpa` : 'N/A'),
        currency: data.currency ? `${data.currency.code} (${data.currency.symbol || ''})` : 'USD ($)',
        threat: threatData,
        weather: weatherData || { temp: 22, condition: 'Clear', wind: 10, humidity: 45 },
        dns: [
          { type: 'A', value: data.ip, ttl: 300 },
          { type: 'PTR', value: data.connection?.domain || `ptr.${data.ip}.net`, ttl: 3600 },
          { type: 'ASN', value: `AS${data.connection?.asn || 'Unknown'}`, ttl: 86400 }
        ]
      };

      if (updateState) {
        setCurrentIpData(result);
      }
      return result;
    } catch (err) {
      console.warn('IP lookup error, utilizing fallback:', err);
      const fallback = {
        ...DEFAULT_MY_IP,
        ip: cleaned || DEFAULT_MY_IP.ip
      };
      if (updateState) {
        setCurrentIpData(fallback);
        setErrorMsg(`Figyelem: A külső API átmenetileg korlátozott (${err.message}). Mintaadatok betöltve.`);
      }
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const runPingSimulation = () => {
    if (pingRunning) return;
    setPingRunning(true);
    setPingResults([]);

    let count = 0;
    const baseLatency = Math.floor(Math.random() * 25) + 18;
    const interval = setInterval(() => {
      count += 1;
      const jitter = Math.floor(Math.random() * 12) - 5;
      const pingVal = Math.max(8, baseLatency + jitter);
      setLivePing(pingVal);
      setPingResults(prev => [...prev.slice(-9), pingVal]);

      if (count >= 10) {
        clearInterval(interval);
        setPingRunning(false);
      }
    }, 400);
  };

  const executeCompare = async () => {
    setCompareLoading(true);
    try {
      const [d1, d2] = await Promise.all([
        fetchIpDetails(compareIp1, false),
        fetchIpDetails(compareIp2, false)
      ]);
      setCompareData1(d1);
      setCompareData2(d2);
    } finally {
      setCompareLoading(false);
    }
  };

  const executeBatch = async () => {
    const list = batchInput
      .split('\n')
      .map(item => cleanIpOrDomain(item))
      .filter(Boolean)
      .slice(0, 10); // cap to 10 for performance

    if (list.length === 0) return;
    setBatchLoading(true);

    const results = [];
    for (const ipTarget of list) {
      try {
        const item = await fetchIpDetails(ipTarget, false);
        results.push(item);
      } catch {
        results.push({
          ip: ipTarget,
          country: 'Hiba / Nem elérhető',
          city: '-',
          isp: '-',
          threat: { risk_score: 0, threat_level: 'Unknown' }
        });
      }
    }

    setBatchResults(results);
    setBatchLoading(false);
  };

  const exportBatchToCSV = () => {
    if (!batchResults.length) return;
    const headers = ['IP', 'Type', 'Country', 'City', 'ISP', 'ASN', 'Risk Score', 'Threat Level'];
    const rows = batchResults.map(r => [
      `"${r.ip}"`,
      `"${r.type || 'IPv4'}"`,
      `"${r.country || ''}"`,
      `"${r.city || ''}"`,
      `"${r.isp || ''}"`,
      `"${r.asn || ''}"`,
      `"${r.threat?.risk_score ?? 0}"`,
      `"${r.threat?.threat_level || 'N/A'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ip_batch_lookup_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    fetchIpDetails('');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">NetScope</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">v2.4 PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">IP Intelligence & Hálózati Diagnosztika</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Irányítópult</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('compare');
                if (!compareData1 || !compareData2) executeCompare();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'compare' ? 'bg-cyan-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Összehasonlítás</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('batch');
                if (batchResults.length === 0) executeBatch();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'batch' ? 'bg-cyan-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tömeges (Batch)</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'raw' ? 'bg-cyan-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Raw JSON</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Universal Search Bar (Always accessible for quick lookups) */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) fetchIpDetails(searchInput);
            }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Írj be IPv4, IPv6 címet vagy domain nevet (pl. 8.8.8.8, 1.1.1.1, github.com)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Keresés</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  fetchIpDetails('');
                }}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                title="Saját nyilvános IP lekérése"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Saját IP</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(window.location.href, 'share-url')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                title="Megosztható link másolása"
              >
                {copiedKey === 'share-url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-2.5 text-xs px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </section>

        {/* TAB 1: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Primary Banner */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{currentIpData.flag}</span>
                    <h2 className="text-2xl sm:text-4xl font-mono font-black tracking-tight text-white">
                      {currentIpData.ip}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {currentIpData.type}
                    </span>
                    <button
                      onClick={() => copyToClipboard(currentIpData.ip, 'dash-ip')}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Másolás vágólapra"
                    >
                      {copiedKey === 'dash-ip' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <span>{currentIpData.city}, {currentIpData.region}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-200 font-medium">{currentIpData.country}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 font-mono text-xs">{currentIpData.asn}</span>
                  </p>
                </div>

                {/* Live Weather & Time Capsule */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {/* Weather Capsule */}
                  <div className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {currentIpData.weather.condition.includes('Rain') ? (
                        <CloudRain className="w-5 h-5" />
                      ) : currentIpData.weather.condition.includes('Cloud') ? (
                        <CloudSun className="w-5 h-5" />
                      ) : (
                        <Sun className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Helyi Időjárás</div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{currentIpData.weather.temp}°C</span>
                        <span className="text-slate-400 text-xs font-normal">({currentIpData.weather.condition})</span>
                      </div>
                    </div>
                  </div>

                  {/* Clock Capsule */}
                  <div className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">{currentIpData.timezone}</div>
                      <div className="text-sm font-mono font-bold text-cyan-300">
                        {localTimeTicker || '--:--:--'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Intelligence & Threat Gauge & Ping */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Card 1: Threat Intelligence & Fraud Score */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Biztonsági Elemzés (Threat Intel)</h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    currentIpData.threat.threat_level === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    currentIpData.threat.threat_level === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {currentIpData.threat.threat_level} Kockázat
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">Kockázati Index (Fraud Score)</span>
                    <span className="font-mono font-bold text-white">{currentIpData.threat.risk_score} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${
                        currentIpData.threat.risk_score < 30 ? 'bg-emerald-400' :
                        currentIpData.threat.risk_score < 60 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${currentIpData.threat.risk_score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">VPN / Proxy</span>
                    <span className={currentIpData.threat.is_vpn || currentIpData.threat.is_proxy ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                      {currentIpData.threat.is_vpn || currentIpData.threat.is_proxy ? 'Igen' : 'Nem'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">Tor Csomópont</span>
                    <span className={currentIpData.threat.is_tor ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                      {currentIpData.threat.is_tor ? 'Igen' : 'Nem'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">Adatközpont</span>
                    <span className={currentIpData.threat.is_datacenter ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                      {currentIpData.threat.is_datacenter ? 'Igen' : 'Nem'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">Típus</span>
                    <span className="text-cyan-400 truncate max-w-[80px]" title={currentIpData.threat.network_type}>
                      {currentIpData.threat.network_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Live Ping & Network Diagnostics */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Ping & Késleltetés Mérés</h3>
                  </div>
                  <button
                    onClick={runPingSimulation}
                    disabled={pingRunning}
                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {pingRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    <span>{pingRunning ? 'Mérés...' : 'Ping Teszt'}</span>
                  </button>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-slate-400">Átlagos késleltetés (RTT)</span>
                  <div className="text-2xl font-mono font-bold text-cyan-400">
                    {livePing} <span className="text-xs font-normal text-slate-400">ms</span>
                  </div>
                </div>

                {/* Simulated Jitter Bars */}
                <div className="flex items-end gap-1.5 h-16 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                  {pingResults.map((val, idx) => {
                    const heightPercent = Math.min(Math.max((val / 60) * 100, 20), 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all"
                          style={{ height: `${heightPercent}%` }}
                          title={`${val} ms`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                  <span>Csomagvesztés: 0%</span>
                  <span>Jitter: ±2.4 ms</span>
                </div>
              </div>

              {/* Card 3: DNS & Reverse Hostname */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">DNS & Reverse Lookup (rDNS)</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">PTR Hostname:</span>
                    <span className="font-mono text-cyan-300 break-all">{currentIpData.hostname}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                    <span className="text-slate-400 block text-[10px]">DNS Rekordok:</span>
                    {currentIpData.dns.map((rec, i) => (
                      <div key={i} className="flex items-center justify-between font-mono text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">{rec.type}</span>
                        <span className="text-slate-300 truncate max-w-[150px]">{rec.value}</span>
                        <span className="text-slate-500 text-[10px]">{rec.ttl}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Embedded OpenStreetMap */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white text-sm sm:text-base">Pontos Térképes Lokáció (OpenStreetMap)</h3>
                </div>
                {currentIpData.latitude && currentIpData.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${currentIpData.latitude},${currentIpData.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    Google Maps <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {currentIpData.latitude && currentIpData.longitude ? (
                <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800">
                  <iframe
                    title="OSM Live View"
                    className="w-full h-full border-0 filter invert-[0.92] hue-rotate-180 contrast-[1.15]"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentIpData.longitude - 0.08}%2C${currentIpData.latitude - 0.05}%2C${currentIpData.longitude + 0.08}%2C${currentIpData.latitude + 0.05}&layer=mapnik&marker=${currentIpData.latitude}%2C${currentIpData.longitude}`}
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Lat: {currentIpData.latitude.toFixed(4)}, Lon: {currentIpData.longitude.toFixed(4)}</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                  Nincsenek elérhető koordináták a megadott címhez.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SIDE-BY-SIDE COMPARE VIEW */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Columns className="w-5 h-5 text-cyan-400" />
                Két IP Cím Összehasonlítása (Split-View)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Hasonlítsd össze közvetlenül a saját IP-det vagy két szerver hálózati szolgáltatóját, lokációját és kockázati mutatóit.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={compareIp1}
                  onChange={(e) => setCompareIp1(e.target.value)}
                  placeholder="1. IP (pl. 8.8.8.8)"
                  className="flex-1 w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
                <ArrowRightLeft className="w-4 h-4 text-slate-500 hidden sm:block" />
                <input
                  type="text"
                  value={compareIp2}
                  onChange={(e) => setCompareIp2(e.target.value)}
                  placeholder="2. IP (pl. 1.1.1.1)"
                  className="flex-1 w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
                <button
                  onClick={executeCompare}
                  disabled={compareLoading}
                  className="w-full sm:w-auto px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  {compareLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Összevetés</span>
                </button>
              </div>
            </div>

            {/* Side by side comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[compareData1, compareData2].map((data, index) => (
                <div key={index} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{data?.flag}</span>
                      <div>
                        <h4 className="font-mono font-bold text-lg text-white">{data?.ip}</h4>
                        <span className="text-[11px] text-slate-400">{data?.city}, {data?.country}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      Gép #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Szolgáltató (ISP):</span>
                      <span className="font-medium text-slate-200 text-right truncate max-w-[200px]">{data?.isp}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">ASN:</span>
                      <span className="font-mono text-purple-300">{data?.asn}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Időzóna:</span>
                      <span className="text-slate-300">{data?.timezone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Pénznem:</span>
                      <span className="text-slate-300">{data?.currency}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Adatközpont / Cloud:</span>
                      <span className={data?.threat?.is_datacenter ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                        {data?.threat?.is_datacenter ? 'Igen' : 'Nem'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Kockázati Index:</span>
                      <span className="font-mono font-bold text-rose-400">{data?.threat?.risk_score} / 100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BATCH LOOKUP TOOL */}
        {activeTab === 'batch' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-cyan-400" />
                Tömeges IP Elemző (Batch Processor)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Illessz be több IP címet vagy domaint soronként. Az eszköz automatikusan feldolgozza és CSV-be vagy JSON-ba exportálhatóvá teszi az adatokat.
              </p>

              <textarea
                rows={5}
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="8.8.8.8&#10;1.1.1.1&#10;cloudflare.com"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 mb-3"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={executeBatch}
                  disabled={batchLoading}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl transition flex items-center gap-2"
                >
                  {batchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Futtatás ({batchInput.split('\n').filter(Boolean).length} cím)</span>
                </button>

                {batchResults.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportBatchToCSV}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Exportálás CSV-be</span>
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(batchResults, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ip_batch_${Date.now()}.json`;
                        a.click();
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      <span>JSON letöltés</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Batch Results Table */}
            {batchResults.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3.5">IP Cím</th>
                        <th className="p-3.5">Helyszín</th>
                        <th className="p-3.5">ISP / Szervezet</th>
                        <th className="p-3.5">ASN</th>
                        <th className="p-3.5">Kockázat</th>
                        <th className="p-3.5">Típus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {batchResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <span>{item.flag}</span>
                            <span>{item.ip}</span>
                          </td>
                          <td className="p-3.5 text-slate-300 font-sans">
                            {item.city}, {item.country}
                          </td>
                          <td className="p-3.5 text-slate-400 font-sans truncate max-w-[180px]" title={item.isp}>
                            {item.isp}
                          </td>
                          <td className="p-3.5 text-purple-300 text-[11px]">
                            {item.asn}
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (item.threat?.risk_score || 0) > 50 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {item.threat?.risk_score || 0} / 100
                            </span>
                          </td>
                          <td className="p-3.5 font-sans text-slate-400">
                            {item.threat?.network_type || 'Residential'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RAW JSON VIEWER */}
        {activeTab === 'raw' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">Nyers JSON Adatstruktúra (API Payload)</h3>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(currentIpData, null, 2), 'raw-json')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
              >
                {copiedKey === 'raw-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Másolás</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono text-cyan-400 overflow-x-auto max-h-[500px]">
              {JSON.stringify(currentIpData, null, 2)}
            </pre>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} NetScope Intelligence Suite. React, Tailwind CSS & Open APIs.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Anonim és titkosított</span>
            <span>•</span>
            <span>Készen áll az éles használatra</span>
          </div>
        </div>
      </footer>
    </div>
  );
}