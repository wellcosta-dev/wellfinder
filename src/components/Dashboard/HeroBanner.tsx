import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  CloudRain,
  CloudSun,
  Sun,
  Clock
} from 'lucide-react';
import { IpData, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';

interface HeroBannerProps {
  data: IpData;
  lang: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ data, lang }) => {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const t = translations[lang];

  useEffect(() => {
    if (!data?.timezone) return;
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat(lang === 'hu' ? 'hu-HU' : 'en-US', {
          timeZone: data.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short'
        });
        setLocalTime(formatter.format(new Date()));
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [data?.timezone, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWeatherIcon = () => {
    const cond = data.weather?.condition || '';
    if (cond.toLowerCase().includes('rain') || cond.toLowerCase().includes('drizzle')) {
      return <CloudRain className="w-5 h-5 text-sky-400" />;
    }
    if (cond.toLowerCase().includes('cloud') || cond.toLowerCase().includes('fog')) {
      return <CloudSun className="w-5 h-5 text-amber-300" />;
    }
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Flag, IP, Geolocation summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl">{data.flag}</span>
            <h2 className="text-2xl sm:text-4xl font-mono font-bold tracking-tight text-[#e9e9ed] flex items-center gap-2">
              <span>{data.ip}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/25">
              {data.type}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-obsidian-900 hover:bg-[#1f2235] text-[#9a9eb2] hover:text-[#e9e9ed] border border-[#24283d] transition"
              title={t.hero.copyIpTooltip}
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="text-[#9a9eb2] text-sm flex items-center gap-2 flex-wrap font-sans">
            <span className="text-[#e9e9ed] font-medium">{data.city}</span>
            <span className="text-slate-600">•</span>
            <span>{data.region}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[#c2c5d8]">{data.country} ({data.country_code})</span>
            <span className="text-slate-600">•</span>
            <span className="text-brand-300 font-mono text-xs px-2.5 py-0.5 rounded-lg bg-obsidian-950 border border-[#24283d]">
              {data.asn}
            </span>
            {data.isp_pop_city && (
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-obsidian-950 text-brand-300 border border-brand-500/20"
                title="A szolgáltató (ISP) fizikai hálózati csomópontja"
              >
                📡 POP: {data.isp_pop_city}
              </span>
            )}
            {data.is_gps_verified && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> GPS Hitelesítve
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Live Weather & Time Capsules */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Weather Capsule */}
          <div className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-obsidian-900/90 border border-[#24283d] flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              {getWeatherIcon()}
            </div>
            <div>
              <div className="text-[11px] text-[#9a9eb2] font-medium">
                {t.hero.localWeather}
              </div>
              <div className="text-sm font-semibold text-[#e9e9ed] flex items-center gap-1.5 font-sans">
                <span className="text-brand-300 font-mono">{data.weather?.temp ?? 20}°C</span>
                <span className="text-[#9a9eb2] text-xs font-normal">
                  ({data.weather?.condition})
                </span>
              </div>
            </div>
          </div>

          {/* Clock Capsule */}
          <div className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-obsidian-900/90 border border-[#24283d] flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#9a9eb2] font-medium truncate max-w-[140px]" title={data.timezone}>
                {data.timezone}
              </div>
              <div className="text-sm font-mono font-semibold text-brand-300">
                {localTime || '--:--:--'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
