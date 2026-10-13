import React, { useState } from 'react';
import {
  Copy,
  Check,
  Globe2,
  Server,
  Network
} from 'lucide-react';
import { IpData, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';
import { CountryFlag } from '../common/CountryFlag';

interface HeroBannerProps {
  data: IpData;
  lang: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ data, lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-[5px] p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Flag, IP, Geolocation summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <CountryFlag
              countryCode={data.country_code}
              countryName={data.country}
              className="w-8 h-6 rounded-[2px] shadow-sm"
            />
            <h2 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-[#e9e9ed] flex items-center gap-2">
              <span>{data.ip}</span>
            </h2>
            <span className="px-2 py-0.5 rounded-[3px] text-xs font-mono font-semibold bg-[#836fe8]/15 text-[#d2cefd] border border-[#836fe8]/30">
              {data.type}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-[5px] bg-obsidian-900 hover:bg-[#1f2235] text-[#9a9eb2] hover:text-[#e9e9ed] border border-[#24283d] transition"
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
            <span className="text-[#c2c5d8]">
              {data.country} ({data.country_code})
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[#d2cefd] font-mono text-xs px-2 py-0.5 rounded-[3px] bg-obsidian-950 border border-[#24283d]">
              {data.asn}
            </span>
          </div>
        </div>

        {/* Right Side: Professional Network & ISP telemetry (No AI-slop weather/clock) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* ISP Capsule */}
          <div className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-[5px] bg-obsidian-950/80 border border-[#24283d] flex items-center gap-3 shadow-sm min-w-[170px]">
            <div className="p-2 rounded-[5px] bg-[#836fe8]/15 border border-[#836fe8]/30 text-[#d2cefd]">
              <Server className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-[#9a9eb2]">
                {t.hero.isp}
              </div>
              <div className="text-xs font-medium text-[#e9e9ed] truncate max-w-[160px]" title={data.isp}>
                {data.isp}
              </div>
            </div>
          </div>

          {/* ASN Routing Capsule */}
          <div className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-[5px] bg-obsidian-950/80 border border-[#24283d] flex items-center gap-3 shadow-sm min-w-[150px]">
            <div className="p-2 rounded-[5px] bg-[#836fe8]/15 border border-[#836fe8]/30 text-[#d2cefd]">
              <Network className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-[#9a9eb2]">
                Autonóm Rendszer
              </div>
              <div className="text-xs font-mono font-medium text-[#d2cefd] truncate max-w-[140px]" title={data.asn}>
                {data.asn.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Timezone Capsule */}
          <div className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-[5px] bg-obsidian-950/80 border border-[#24283d] flex items-center gap-3 shadow-sm min-w-[150px]">
            <div className="p-2 rounded-[5px] bg-[#836fe8]/15 border border-[#836fe8]/30 text-[#d2cefd]">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-[#9a9eb2]">
                {t.networkSpecs.timezone}
              </div>
              <div className="text-xs font-mono font-medium text-[#e9e9ed] truncate max-w-[140px]" title={data.timezone}>
                {data.timezone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
