import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { HeroBanner } from './components/Dashboard/HeroBanner';
import { ThreatCard } from './components/Dashboard/ThreatCard';
import { PingCard } from './components/Dashboard/PingCard';
import { DnsCard } from './components/Dashboard/DnsCard';
import { MapCard } from './components/Dashboard/MapCard';
import { NetworkSpecsCard } from './components/Dashboard/NetworkSpecsCard';
import { DnsInspectorView } from './components/DnsInspector/DnsInspectorView';
import { CompareView } from './components/Compare/CompareView';
import { BatchView } from './components/Batch/BatchView';
import { RawJsonView } from './components/RawJson/RawJsonView';
import { Footer } from './components/Footer';
import { ActiveTab, Language, IpData } from './types/ip';
import { fetchIpIntelligence, refineLocationWithGps, DEFAULT_WELLFINDER_IP } from './services/ipService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentIpData, setCurrentIpData] = useState<IpData>(DEFAULT_WELLFINDER_IP);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('wellfinder_lang') as Language) || 'hu';
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('wellfinder_lang', newLang);
  };

  const handleGpsRefine = async () => {
    setGpsLoading(true);
    try {
      const refined = await refineLocationWithGps();
      setCurrentIpData((prev) => ({
        ...prev,
        city: refined.city,
        region: refined.region || prev.region,
        latitude: refined.latitude,
        longitude: refined.longitude,
        is_gps_verified: true,
        isp_pop_city: prev.isp_pop_city || (prev.city !== refined.city ? `${prev.city} (GeoIP POP)` : undefined)
      }));
    } catch (err: any) {
      alert(
        lang === 'hu'
          ? 'Nem sikerült lekérni a pontos helyzetet. Kérjük, engedélyezd a böngésző helyhozzáférését!'
          : 'Could not retrieve precise location. Please allow browser location access!'
      );
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSearch = async (target: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchIpIntelligence(target);
      setCurrentIpData(data);
    } catch (err: any) {
      setErrorMsg(
        lang === 'hu'
          ? `Hiba történt a keresés során (${err.message || 'Hálózati hiba'}).`
          : `Error during lookup (${err.message || 'Network error'}).`
      );
    } finally {
      setLoading(false);
    }
  };

  // On mount, auto-fetch user's own live public IP
  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-950 text-[#e9e9ed] flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950 relative">
      {/* Subtle, refined ambient background illumination */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] opacity-60"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(145, 132, 217, 0.12), transparent 75%)'
          }}
        />
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={handleSetLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Universal Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          errorMsg={errorMsg}
          lang={lang}
        />

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Primary Hero Banner */}
            <HeroBanner data={currentIpData} lang={lang} />

            {/* Middle Grid: Threat Intelligence, Live Ping, and DNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <ThreatCard threat={currentIpData.threat} lang={lang} />
              <PingCard targetIp={currentIpData.ip} lang={lang} />
              <DnsCard
                hostname={currentIpData.hostname}
                dnsRecords={currentIpData.dns}
                onNavigateToDnsTab={() => setActiveTab('dns')}
                lang={lang}
              />
            </div>

            {/* Interactive OpenStreetMap */}
            <MapCard
              latitude={currentIpData.latitude}
              longitude={currentIpData.longitude}
              city={currentIpData.city}
              country={currentIpData.country}
              lang={lang}
              isGpsVerified={currentIpData.is_gps_verified}
              ispPopCity={currentIpData.isp_pop_city}
              onGpsRefine={handleGpsRefine}
              gpsLoading={gpsLoading}
            />

            {/* Network Deep Specifications */}
            <NetworkSpecsCard data={currentIpData} lang={lang} />
          </div>
        )}

        {/* TAB 2: DNS INSPECTOR */}
        {activeTab === 'dns' && (
          <DnsInspectorView
            initialTarget={currentIpData.hostname || currentIpData.ip}
            lang={lang}
          />
        )}

        {/* TAB 3: COMPARE VIEW */}
        {activeTab === 'compare' && <CompareView lang={lang} />}

        {/* TAB 4: BATCH PROCESSOR */}
        {activeTab === 'batch' && <BatchView lang={lang} />}

        {/* TAB 5: RAW JSON */}
        {activeTab === 'raw' && <RawJsonView data={currentIpData} lang={lang} />}
      </main>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
