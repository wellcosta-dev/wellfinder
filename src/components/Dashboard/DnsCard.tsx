import React, { useState } from 'react';
import { Database, Copy, Check, ArrowRight } from 'lucide-react';
import { DnsRecord, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';

interface DnsCardProps {
  hostname: string;
  dnsRecords: DnsRecord[];
  onNavigateToDnsTab: () => void;
  lang: Language;
}

export const DnsCard: React.FC<DnsCardProps> = ({
  hostname,
  dnsRecords,
  onNavigateToDnsTab,
  lang
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const t = translations[lang];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/20">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-[#e9e9ed] text-sm">
              {t.dns.title}
            </h3>
          </div>
          <button
            onClick={onNavigateToDnsTab}
            className="text-[11px] text-brand-300 hover:text-brand-200 flex items-center gap-1 font-medium transition"
          >
            <span>Részletes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Reverse DNS PTR */}
        <div className="p-2.5 rounded-xl bg-obsidian-950/80 border border-[#24283d] mb-3">
          <span className="text-[#9a9eb2] block text-[10px] font-medium uppercase tracking-wider mb-1">
            {t.dns.hostname}
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-brand-300 text-xs break-all truncate">
              {hostname || 'N/A (Nincs konfigurált PTR rekord)'}
            </span>
            {hostname && (
              <button
                onClick={() => handleCopy(hostname, -1)}
                className="text-[#6c728e] hover:text-[#e9e9ed] p-1 rounded"
                title="PTR másolása"
              >
                {copiedIndex === -1 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* DNS Records List */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          <span className="text-[#6c728e] block text-[10px] font-medium uppercase tracking-wider mb-1">
            {t.dns.records} ({dnsRecords.length})
          </span>
          {dnsRecords.map((rec, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-obsidian-950/60 border border-[#24283d] flex items-center justify-between text-xs font-mono hover:border-brand-500/30 transition"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  {rec.type}
                </span>
                <span className="text-[#e9e9ed] truncate max-w-[150px]" title={rec.value}>
                  {rec.value}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {rec.ttl && (
                  <span className="text-[10px] text-[#6c728e]">{rec.ttl}s</span>
                )}
                <button
                  onClick={() => handleCopy(rec.value, idx)}
                  className="text-[#6c728e] hover:text-[#e9e9ed] p-1"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#24283d] mt-3 flex justify-between items-center text-[11px] text-[#9a9eb2]">
        <span>Cloudflare 1.1.1.1 DoH motor</span>
        <span className="text-emerald-400 font-mono">200 OK</span>
      </div>
    </div>
  );
};
