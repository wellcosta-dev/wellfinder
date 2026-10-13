import React, { useState } from 'react';
import { Network, Copy, Check, Globe, Building2, MapPinned, Coins } from 'lucide-react';
import { IpData, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';
import { CountryFlag } from '../common/CountryFlag';

interface NetworkSpecsCardProps {
  data: IpData;
  lang: Language;
}

export const NetworkSpecsCard: React.FC<NetworkSpecsCardProps> = ({ data, lang }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const t = translations[lang];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rows = [
    {
      icon: <Globe className="w-3.5 h-3.5 text-[#9b8cf0]" />,
      label: t.networkSpecs.country,
      value: `${data.country} (${data.country_code})`,
      customContent: (
        <span className="flex items-center gap-1.5">
          <CountryFlag countryCode={data.country_code} className="w-4 h-3 rounded-[2px]" />
          <span>{data.country} ({data.country_code})</span>
        </span>
      )
    },
    {
      icon: <MapPinned className="w-3.5 h-3.5 text-[#9b8cf0]" />,
      label: t.networkSpecs.region,
      value: `${data.region}, ${data.city}`
    },
    {
      icon: <Building2 className="w-3.5 h-3.5 text-[#9b8cf0]" />,
      label: t.networkSpecs.organization,
      value: data.org || data.isp
    },
    {
      icon: <Network className="w-3.5 h-3.5 text-[#9b8cf0]" />,
      label: 'ASN / Routing',
      value: data.asn
    },
    {
      icon: <MapPinned className="w-3.5 h-3.5 text-[#9b8cf0]" />,
      label: t.networkSpecs.postal,
      value: data.postal || 'N/A'
    },
    {
      icon: <Coins className="w-3.5 h-3.5 text-[#9b8cf0]" />,
      label: t.networkSpecs.currency,
      value: data.currency
    }
  ];

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-[5px] p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-[5px] bg-[#836fe8]/10 text-[#9b8cf0] border border-[#836fe8]/25 flex items-center justify-center">
          <Network className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-[#e9e9ed] text-sm sm:text-base">
          {t.networkSpecs.title}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-[5px] bg-obsidian-950/70 border border-[#24283d] hover:border-[#836fe8]/30 transition flex items-center justify-between gap-3 group"
          >
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="text-[11px] text-[#8e93ad] flex items-center gap-1.5 font-medium">
                {row.icon}
                <span>{row.label}</span>
              </span>
              <div className="text-xs font-semibold text-[#e9e9ed] font-sans truncate">
                {row.customContent ? row.customContent : row.value}
              </div>
            </div>

            <button
              onClick={() => handleCopy(row.value, `spec-${idx}`)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-[4px] text-[#8e93ad] hover:text-[#e9e9ed] hover:bg-[#1f2235] transition flex-shrink-0"
              title="Másolás"
            >
              {copiedKey === `spec-${idx}` ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
