import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  EyeOff,
  AlertTriangle,
  Info,
  Lock,
  Calculator
} from 'lucide-react';
import { ThreatData, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';
import { ThreatBreakdownModal } from './ThreatBreakdownModal';

interface ThreatCardProps {
  threat: ThreatData;
  lang: Language;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = translations[lang];

  const getThreatBadgeColor = () => {
    if (threat.threat_level === 'Low') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
    }
    if (threat.threat_level === 'Medium') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    }
    return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
  };

  const getProgressBarColor = () => {
    if (threat.risk_score < 30) return 'bg-emerald-400';
    if (threat.risk_score < 65) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-[5px] p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-[5px] border ${
                threat.is_vpn || threat.is_proxy || threat.is_tor
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              }`}
            >
              {threat.is_vpn || threat.is_proxy || threat.is_tor ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
            <h3 className="font-semibold text-[#e9e9ed] text-sm">
              {t.threat.title}
            </h3>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-[5px] border ${getThreatBadgeColor()}`}
          >
            {threat.threat_level === 'Low'
              ? t.threat.low
              : threat.threat_level === 'Medium'
              ? t.threat.medium
              : t.threat.high}{' '}
            Kockázat
          </span>
        </div>

        {/* Highlight Banner if VPN is detected */}
        {threat.is_vpn && (
          <div className="mb-4 p-3 rounded-[5px] bg-rose-950/40 border border-rose-500/30 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-rose-300 block">
                VPN / Proxy Csomópont Észlelve!
              </span>
              <span className="text-[11px] text-[#c2c5d8] block">
                {threat.vpn_service ? `Szolgáltató: ${threat.vpn_service}` : 'Aktív titkosított alagút azonosítva.'}
              </span>
            </div>
          </div>
        )}

        {/* Risk Score Gauge */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-[#9a9eb2]">{t.threat.fraudScore}</span>
            <span className="font-mono font-semibold text-[#e9e9ed] text-sm">
              {threat.risk_score} <span className="text-xs text-[#9a9eb2] font-normal">/ 100</span>
            </span>
          </div>
          <div className="h-2 w-full bg-obsidian-950 rounded-[3px] overflow-hidden border border-[#24283d]">
            <div
              className={`h-full rounded-[3px] transition-all duration-700 ${getProgressBarColor()}`}
              style={{ width: `${threat.risk_score}%` }}
            />
          </div>
        </div>

        {/* Security Checks List - Clean, non-truncated rows */}
        <div className="space-y-1.5 text-xs mb-3">
          <div className="p-2 rounded-[5px] bg-obsidian-950/70 border border-[#24283d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#9a9eb2]">
              <EyeOff className="w-3.5 h-3.5 text-[#6c728e]" />
              <span>{t.threat.vpnProxy}</span>
            </div>
            <span
              className={`font-semibold text-[11px] ${
                threat.is_vpn || threat.is_proxy
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}
            >
              {threat.is_vpn || threat.is_proxy ? `● ${t.threat.yes}` : `● ${t.threat.no}`}
            </span>
          </div>

          <div className="p-2 rounded-[5px] bg-obsidian-950/70 border border-[#24283d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#9a9eb2]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#6c728e]" />
              <span>{t.threat.torNode}</span>
            </div>
            <span
              className={`font-semibold text-[11px] ${
                threat.is_tor ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {threat.is_tor ? `● ${t.threat.yes}` : `● ${t.threat.no}`}
            </span>
          </div>

          <div className="p-2 rounded-[5px] bg-obsidian-950/70 border border-[#24283d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#9a9eb2]">
              <Server className="w-3.5 h-3.5 text-[#6c728e]" />
              <span>{t.threat.datacenter}</span>
            </div>
            <span
              className={`font-semibold text-[11px] ${
                threat.is_datacenter ? 'text-amber-400' : 'text-[#c2c5d8]'
              }`}
            >
              {threat.is_datacenter ? `● ${t.threat.yes}` : `● ${t.threat.no}`}
            </span>
          </div>

          {/* Full row for Network Type without cutoffs */}
          <div className="p-2.5 rounded-[5px] bg-obsidian-950/70 border border-[#24283d] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-[#9a9eb2] font-medium">{t.threat.networkType}</span>
            <span
              className="text-[#d2cefd] font-medium text-xs break-words"
            >
              {threat.network_type}
            </span>
          </div>
        </div>

        {/* Detection Reasons - Fully readable */}
        {threat.detection_reasons && threat.detection_reasons.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {threat.detection_reasons.map((reason, idx) => (
              <div
                key={idx}
                className="text-[11px] text-[#c2c5d8] bg-obsidian-950/60 p-2 rounded-[5px] border border-[#24283d] flex items-start gap-2 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#836fe8] flex-shrink-0 mt-1.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Trigger Button */}
        {threat.score_breakdown && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full mb-3 py-2 px-3 rounded-[5px] bg-[#836fe8]/15 hover:bg-[#836fe8]/25 text-[#d2cefd] border border-[#836fe8]/35 text-xs font-medium flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <Calculator className="w-3.5 h-3.5 text-[#836fe8]" />
            <span>
              {lang === 'hu'
                ? `Miért pont ${threat.risk_score} / 100? Részletes pontszámítás`
                : `Why ${threat.risk_score} / 100? Score Breakdown`}
            </span>
          </button>
        )}
      </div>

      {/* Security Context Advice */}
      <div className="text-[11px] px-3 py-2 rounded-[5px] bg-obsidian-950/80 border border-[#24283d] text-[#9a9eb2] flex items-center gap-2 mt-2">
        <Info className="w-3.5 h-3.5 text-[#836fe8] flex-shrink-0" />
        <span className="leading-tight">
          {threat.is_vpn || threat.is_tor
            ? t.threat.dangerMessage
            : threat.is_datacenter
            ? t.threat.suspiciousMessage
            : t.threat.safeMessage}
        </span>
      </div>

      {/* Modal Dialog */}
      <ThreatBreakdownModal
        threat={threat}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
