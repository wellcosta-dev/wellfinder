import React, { useState } from 'react';
import {
  Columns,
  ArrowRightLeft,
  RefreshCw,
  Play
} from 'lucide-react';
import { IpData, Language } from '../../types/ip';
import { fetchIpIntelligence, DEFAULT_WELLFINDER_IP, SECONDARY_WELLFINDER_IP } from '../../services/ipService';
import { translations } from '../../i18n/translations';

interface CompareViewProps {
  lang: Language;
}

export const CompareView: React.FC<CompareViewProps> = ({ lang }) => {
  const [target1, setTarget1] = useState(DEFAULT_WELLFINDER_IP.ip);
  const [target2, setTarget2] = useState(SECONDARY_WELLFINDER_IP.ip);
  const [data1, setData1] = useState<IpData>(DEFAULT_WELLFINDER_IP);
  const [data2, setData2] = useState<IpData>(SECONDARY_WELLFINDER_IP);
  const [loading, setLoading] = useState(false);
  const t = translations[lang];

  const handleCompare = async () => {
    setLoading(true);
    try {
      const [d1, d2] = await Promise.all([
        fetchIpIntelligence(target1),
        fetchIpIntelligence(target2)
      ]);
      setData1(d1);
      setData2(d2);
    } finally {
      setLoading(false);
    }
  };

  const swapTargets = () => {
    const t1 = target1;
    const t2 = target2;
    setTarget1(t2);
    setTarget2(t1);
    const d1 = data1;
    const d2 = data2;
    setData1(d2);
    setData2(d1);
  };

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-[#e9e9ed] mb-1.5 flex items-center gap-2">
          <Columns className="w-5 h-5 text-brand-300" />
          <span>{t.compare.title}</span>
        </h3>
        <p className="text-xs text-[#9a9eb2] mb-4">
          {t.compare.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="text"
            value={target1}
            onChange={(e) => setTarget1(e.target.value)}
            placeholder={t.compare.ip1Placeholder}
            className="flex-1 w-full px-4 py-2.5 bg-obsidian-950/90 border border-[#2d324d] rounded-xl text-sm font-mono text-[#e9e9ed] placeholder:text-[#6a6f8a] focus:outline-none focus:ring-1 focus:ring-brand-400"
          />

          <button
            type="button"
            onClick={swapTargets}
            className="p-2.5 rounded-xl bg-obsidian-900 hover:bg-[#1f2235] text-[#9a9eb2] hover:text-[#e9e9ed] border border-[#24283d] transition"
            title="Célpontok megcserélése"
          >
            <ArrowRightLeft className="w-4 h-4 text-brand-300" />
          </button>

          <input
            type="text"
            value={target2}
            onChange={(e) => setTarget2(e.target.value)}
            placeholder={t.compare.ip2Placeholder}
            className="flex-1 w-full px-4 py-2.5 bg-obsidian-950/90 border border-[#2d324d] rounded-xl text-sm font-mono text-[#e9e9ed] placeholder:text-[#6a6f8a] focus:outline-none focus:ring-1 focus:ring-brand-400"
          />

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-obsidian-950" />
            )}
            <span>{t.compare.compareButton}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#24283d] text-xs flex-wrap">
          <span className="text-[#9a9eb2]">Minta összehasonlítások:</span>
          <button
            onClick={() => {
              setTarget1('8.8.8.8');
              setTarget2('1.1.1.1');
            }}
            className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-[#24283d] text-[#9a9eb2] hover:text-brand-300 transition"
          >
            Google (8.8.8.8) vs Cloudflare (1.1.1.1)
          </button>
          <button
            onClick={() => {
              setTarget1('9.9.9.9');
              setTarget2('208.67.222.222');
            }}
            className="px-2.5 py-1 rounded-lg bg-obsidian-950 border border-[#24283d] text-[#9a9eb2] hover:text-brand-300 transition"
          >
            Quad9 vs OpenDNS
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[data1, data2].map((data, idx) => (
          <div
            key={idx}
            className="bg-[#161826] border border-[#24283d] rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#24283d] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{data.flag}</span>
                <div>
                  <h4 className="font-mono font-bold text-xl text-[#e9e9ed]">
                    {data.ip}
                  </h4>
                  <span className="text-xs text-[#9a9eb2]">
                    {data.city}, {data.country}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 font-semibold">
                {idx === 0 ? t.compare.host1 : t.compare.host2}
              </span>
            </div>

            {/* Spec rows */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#24283d]/60">
                <span className="text-[#9a9eb2]">Szolgáltató (ISP):</span>
                <span className="font-medium text-[#e9e9ed] text-right truncate max-w-[200px]">
                  {data.isp}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#24283d]/60">
                <span className="text-[#9a9eb2]">ASN:</span>
                <span className="font-mono text-brand-300">{data.asn}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#24283d]/60">
                <span className="text-[#9a9eb2]">Időzóna:</span>
                <span className="text-[#c2c5d8] font-mono">{data.timezone}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#24283d]/60">
                <span className="text-[#9a9eb2]">Pénznem:</span>
                <span className="text-[#c2c5d8]">{data.currency}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#24283d]/60">
                <span className="text-[#9a9eb2]">Adatközpont / Cloud:</span>
                <span
                  className={
                    data.threat?.is_datacenter
                      ? 'text-amber-400 font-semibold'
                      : 'text-[#c2c5d8]'
                  }
                >
                  {data.threat?.is_datacenter ? 'Igen' : 'Nem'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#24283d]/60">
                <span className="text-[#9a9eb2]">VPN / Proxy:</span>
                <span
                  className={
                    data.threat?.is_vpn || data.threat?.is_proxy
                      ? 'text-rose-400 font-semibold'
                      : 'text-emerald-400'
                  }
                >
                  {data.threat?.is_vpn || data.threat?.is_proxy ? 'Igen' : 'Nem'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#9a9eb2] font-medium">Kockázati Index:</span>
                <span
                  className={`font-mono font-semibold text-sm px-2.5 py-0.5 rounded-lg ${
                    data.threat?.risk_score > 50
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                  }`}
                >
                  {data.threat?.risk_score} / 100 ({data.threat?.threat_level})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
