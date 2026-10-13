import React, { useState } from 'react';
import {
  Radio,
  Search,
  RefreshCw,
  Copy,
  Check,
  Download,
  Filter
} from 'lucide-react';
import { DnsRecord, Language } from '../../types/ip';
import { fetchLiveDnsRecords } from '../../services/dnsService';
import { translations } from '../../i18n/translations';

interface DnsInspectorViewProps {
  initialTarget: string;
  lang: Language;
}

export const DnsInspectorView: React.FC<DnsInspectorViewProps> = ({
  initialTarget,
  lang
}) => {
  const [domain, setDomain] = useState(initialTarget || 'wellcosta.dev');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [queryTime, setQueryTime] = useState<number | null>(null);
  const t = translations[lang];

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    const start = performance.now();
    try {
      const recs = await fetchLiveDnsRecords(domain);
      setRecords(recs);
      setQueryTime(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const types = ['ALL', 'A', 'AAAA', 'MX', 'TXT', 'NS', 'PTR'];
  const filteredRecords = selectedType === 'ALL'
    ? records
    : records.filter((r) => r.type.toUpperCase() === selectedType);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#e9e9ed]">
              {t.dns.lookupTitle}
            </h3>
            <p className="text-xs text-[#9a9eb2]">
              Valós idejű DNS zónavizsgálat Cloudflare 1.1.1.1 DoH (DNS-over-HTTPS) protokollon keresztül.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuery} className="flex flex-col sm:flex-row items-center gap-2.5 mt-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#9a9eb2] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={t.dns.domainInput}
              className="w-full pl-10 pr-4 py-2.5 bg-obsidian-950/90 border border-[#2d324d] rounded-xl text-sm font-mono text-[#e9e9ed] placeholder:text-[#6a6f8a] focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Radio className="w-3.5 h-3.5" />
            )}
            <span>{t.dns.query}</span>
          </button>
        </form>

        {/* Record Type Filters */}
        <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-[#24283d]">
          <span className="text-xs text-[#9a9eb2] flex items-center gap-1">
            <Filter className="w-3 h-3" /> Szűrés:
          </span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                selectedType === type
                  ? 'bg-brand-500 text-obsidian-950 font-semibold shadow-sm'
                  : 'bg-obsidian-950 border border-[#24283d] text-[#9a9eb2] hover:text-[#e9e9ed]'
              }`}
            >
              {type}
            </button>
          ))}
          {queryTime !== null && (
            <span className="ml-auto text-xs font-mono text-emerald-400">
              Válaszidő: {queryTime} ms
            </span>
          )}
        </div>
      </div>

      {/* Results View */}
      {filteredRecords.length > 0 ? (
        <div className="bg-[#161826] border border-[#24283d] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-[#24283d] flex items-center justify-between">
            <span className="text-sm font-semibold text-[#e9e9ed]">
              Találatok ({filteredRecords.length} rekord)
            </span>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(records, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dns_${domain}_${Date.now()}.json`;
                a.click();
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] flex items-center gap-1.5 border border-[#24283d] transition"
            >
              <Download className="w-3.5 h-3.5 text-brand-300" />
              <span>JSON Export</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-obsidian-950/80 text-[#9a9eb2] uppercase text-[11px] font-sans border-b border-[#24283d]">
                <tr>
                  <th className="p-4">{t.dns.recordType}</th>
                  <th className="p-4">{t.dns.value}</th>
                  <th className="p-4">{t.dns.ttl}</th>
                  <th className="p-4 text-right">Művelet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24283d]/60">
                {filteredRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {rec.type}
                      </span>
                    </td>
                    <td className="p-4 text-[#e9e9ed] break-all max-w-md">
                      {rec.value}
                    </td>
                    <td className="p-4 text-[#9a9eb2]">
                      {rec.ttl ? `${rec.ttl} s` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCopy(rec.value, idx)}
                        className="p-1.5 rounded-lg bg-obsidian-900 hover:bg-[#1f2235] text-[#9a9eb2] hover:text-[#e9e9ed] border border-[#24283d] transition"
                        title="Érték másolása"
                      >
                        {copiedIdx === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-obsidian-950/40 border border-dashed border-[#24283d] rounded-2xl p-10 text-center text-[#9a9eb2]">
          Kattints a "Rekordok lekérése" gombra a DNS adatok betöltéséhez.
        </div>
      )}
    </div>
  );
};
