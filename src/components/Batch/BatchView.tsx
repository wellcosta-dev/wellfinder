import React, { useState } from 'react';
import {
  ListPlus,
  RefreshCw,
  Play,
  Download,
  Filter
} from 'lucide-react';
import { IpData, Language } from '../../types/ip';
import { fetchIpIntelligence, cleanTarget } from '../../services/ipService';
import { translations } from '../../i18n/translations';
import { CountryFlag } from '../common/CountryFlag';

interface BatchViewProps {
  lang: Language;
}

export const BatchView: React.FC<BatchViewProps> = ({ lang }) => {
  const [inputVal, setInputVal] = useState<string>(
    '8.8.8.8\n1.1.1.1\n9.9.9.9\n208.67.222.222\ngithub.com\nwellcosta.dev'
  );
  const [results, setResults] = useState<IpData[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const t = translations[lang];

  const handleRunBatch = async () => {
    const list = inputVal
      .split('\n')
      .map((item) => cleanTarget(item))
      .filter(Boolean)
      .slice(0, 25);

    if (list.length === 0) return;

    setLoading(true);
    setProgress(0);
    const accumulated: IpData[] = [];

    for (let i = 0; i < list.length; i++) {
      const target = list[i];
      try {
        const item = await fetchIpIntelligence(target);
        accumulated.push(item);
      } catch {
        accumulated.push({
          ip: target,
          type: 'IPv4',
          city: '-',
          region: '-',
          country: 'Hiba / Nem elérhető',
          country_code: '',
          flag: '⚠️',
          postal: '-',
          latitude: 0,
          longitude: 0,
          timezone: '-',
          isp: 'Sikertelen lekérdezés',
          org: '-',
          asn: '-',
          hostname: '-',
          currency: '-',
          threat: {
            is_vpn: false,
            is_proxy: false,
            is_tor: false,
            is_datacenter: false,
            risk_score: 0,
            threat_level: 'Low',
            network_type: 'Unknown',
            detection_reasons: []
          },
          weather: { temp: 0, condition: '-', wind: 0, humidity: 0 },
          dns: []
        });
      }
      setProgress(Math.round(((i + 1) / list.length) * 100));
    }

    setResults(accumulated);
    setLoading(false);
  };

  const exportCSV = () => {
    if (!results.length) return;
    const headers = [
      'IP',
      'Type',
      'Country',
      'City',
      'ISP',
      'ASN',
      'Risk Score',
      'Threat Level',
      'Network Type'
    ];
    const rows = results.map((r) => [
      `"${r.ip}"`,
      `"${r.type || 'IPv4'}"`,
      `"${r.country || ''}"`,
      `"${r.city || ''}"`,
      `"${r.isp || ''}"`,
      `"${r.asn || ''}"`,
      `"${r.threat?.risk_score ?? 0}"`,
      `"${r.threat?.threat_level || 'Low'}"`,
      `"${r.threat?.network_type || ''}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wellfinder_batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (!results.length) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellfinder_batch_${Date.now()}.json`;
    a.click();
  };

  const filteredResults =
    filterLevel === 'ALL'
      ? results
      : results.filter((r) => r.threat?.threat_level.toUpperCase() === filterLevel);

  return (
    <div className="space-y-6">
      <div className="bg-[#161826] border border-[#24283d] rounded-[5px] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-[#e9e9ed] mb-1.5 flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-[#9b8cf0]" />
          <span>{t.batch.title}</span>
        </h3>
        <p className="text-xs text-[#9a9eb2] mb-4">
          {t.batch.subtitle}
        </p>

        <textarea
          rows={5}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t.batch.placeholder}
          className="w-full p-3.5 bg-obsidian-950/90 border border-[#2d324d] rounded-[5px] text-xs font-mono text-[#e9e9ed] placeholder:text-[#6a6f8a] focus:outline-none focus:ring-1 focus:ring-[#836fe8] mb-3"
        />

        {/* Progress Bar if loading */}
        {loading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#9a9eb2] mb-1">
              <span>Feldolgozás alatt...</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-obsidian-950 rounded-[2px] overflow-hidden border border-[#24283d]">
              <div
                className="h-full bg-[#836fe8] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleRunBatch}
            disabled={loading}
            className="px-6 py-2.5 bg-[#836fe8] hover:bg-[#725ee4] active:bg-[#624ed4] text-white font-medium text-xs rounded-[5px] transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            )}
            <span>
              {t.batch.runButton} (
              {inputVal.split('\n').map((s) => s.trim()).filter(Boolean).length}{' '}
              cím)
            </span>
          </button>

          {results.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="px-3.5 py-2 bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] border border-[#24283d] text-xs rounded-[5px] flex items-center gap-1.5 transition font-medium"
              >
                <Download className="w-3.5 h-3.5 text-[#9b8cf0]" />
                <span>{t.batch.exportCsv}</span>
              </button>
              <button
                onClick={exportJSON}
                className="px-3.5 py-2 bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] border border-[#24283d] text-xs rounded-[5px] flex items-center gap-1.5 transition font-medium"
              >
                <Download className="w-3.5 h-3.5 text-[#9b8cf0]" />
                <span>{t.batch.exportJson}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-[#161826] border border-[#24283d] rounded-[5px] overflow-hidden shadow-xl backdrop-blur-md">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-[#24283d] flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-semibold text-[#e9e9ed]">
              Eredmények ({filteredResults.length} / {results.length})
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#9a9eb2] flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Szűrés:
              </span>
              {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 rounded-[5px] font-mono text-[11px] font-semibold transition ${
                    filterLevel === lvl
                      ? 'bg-[#836fe8] text-white'
                      : 'bg-obsidian-950 border border-[#24283d] text-[#9a9eb2] hover:text-[#e9e9ed]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-950/90 text-[#9a9eb2] border-b border-[#24283d] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="p-4">{t.batch.ipCol}</th>
                  <th className="p-4">{t.batch.locationCol}</th>
                  <th className="p-4">{t.batch.ispCol}</th>
                  <th className="p-4">{t.batch.asnCol}</th>
                  <th className="p-4">{t.batch.riskCol}</th>
                  <th className="p-4">{t.batch.typeCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24283d]/60 font-mono">
                {filteredResults.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-bold text-[#e9e9ed] flex items-center gap-2">
                      <CountryFlag countryCode={item.country_code} className="w-4 h-3 rounded-[2px]" />
                      <span>{item.ip}</span>
                    </td>
                    <td className="p-4 text-[#c2c5d8] font-sans">
                      {item.city}, {item.country}
                    </td>
                    <td
                      className="p-4 text-[#9a9eb2] font-sans truncate max-w-[180px]"
                      title={item.isp}
                    >
                      {item.isp}
                    </td>
                    <td className="p-4 text-[#9b8cf0] text-[11px]">
                      {item.asn}
                    </td>
                    <td className="p-4 font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-[5px] text-[10px] font-bold ${
                          (item.threat?.risk_score || 0) > 50
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                        }`}
                      >
                        {item.threat?.risk_score || 0} / 100
                      </span>
                    </td>
                    <td className="p-4 font-sans text-[#9a9eb2]">
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
  );
};
