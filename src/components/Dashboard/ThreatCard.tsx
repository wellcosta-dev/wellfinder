import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  EyeOff,
  AlertTriangle,
  Info,
  Lock,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ThreatData, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';

interface ThreatCardProps {
  threat: ThreatData;
  lang: Language;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat, lang }) => {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const t = translations[lang];

  const getThreatBadgeColor = () => {
    if (threat.threat_level === 'Low') {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    }
    if (threat.threat_level === 'Medium') {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    }
    return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
  };

  const getProgressBarColor = () => {
    if (threat.risk_score < 30) return 'bg-emerald-400';
    if (threat.risk_score < 65) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                threat.is_vpn || threat.is_proxy || threat.is_tor
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
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
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getThreatBadgeColor()}`}
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
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-rose-300 block">
                VPN / Proxy Csomópont Észlelve!
              </span>
              <span className="text-[11px] text-[#c2c5d8] truncate block">
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
          <div className="h-2 w-full bg-obsidian-950 rounded-full overflow-hidden border border-[#24283d]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor()}`}
              style={{ width: `${threat.risk_score}%` }}
            />
          </div>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          {/* VPN / Proxy */}
          <div className="p-2.5 rounded-xl bg-obsidian-950/80 border border-[#24283d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#9a9eb2]">
              <EyeOff className="w-3.5 h-3.5 text-[#6c728e]" />
              <span>{t.threat.vpnProxy}</span>
            </div>
            <span
              className={`font-medium ${
                threat.is_vpn || threat.is_proxy
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}
            >
              {threat.is_vpn || threat.is_proxy ? t.threat.yes : t.threat.no}
            </span>
          </div>

          {/* Tor Exit Node */}
          <div className="p-2.5 rounded-xl bg-obsidian-950/80 border border-[#24283d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#9a9eb2]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#6c728e]" />
              <span>{t.threat.torNode}</span>
            </div>
            <span
              className={`font-medium ${
                threat.is_tor ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {threat.is_tor ? t.threat.yes : t.threat.no}
            </span>
          </div>

          {/* Datacenter */}
          <div className="p-2.5 rounded-xl bg-obsidian-950/80 border border-[#24283d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#9a9eb2]">
              <Server className="w-3.5 h-3.5 text-[#6c728e]" />
              <span>{t.threat.datacenter}</span>
            </div>
            <span
              className={`font-medium ${
                threat.is_datacenter ? 'text-amber-400' : 'text-[#c2c5d8]'
              }`}
            >
              {threat.is_datacenter ? t.threat.yes : t.threat.no}
            </span>
          </div>

          {/* Network Type */}
          <div className="p-2.5 rounded-xl bg-obsidian-950/80 border border-[#24283d] flex items-center justify-between">
            <span className="text-[#9a9eb2]">{t.threat.networkType}</span>
            <span
              className="text-brand-300 truncate max-w-[85px] font-medium"
              title={threat.network_type}
            >
              {threat.network_type}
            </span>
          </div>
        </div>

        {/* Detection Reasons */}
        {threat.detection_reasons && threat.detection_reasons.length > 0 && (
          <div className="space-y-1 mb-3">
            {threat.detection_reasons.map((reason, idx) => (
              <div
                key={idx}
                className="text-[10px] text-[#9a9eb2] bg-obsidian-950/60 px-2.5 py-1 rounded-lg border border-[#24283d] flex items-center gap-1.5 truncate"
                title={reason}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                <span className="truncate">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Transparent Score Breakdown Section */}
        {threat.score_breakdown && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full text-left p-2.5 rounded-xl bg-obsidian-950/90 border border-brand-500/20 hover:border-brand-500/40 text-xs text-[#e9e9ed] flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-3.5 h-3.5 text-brand-300 group-hover:scale-110 transition" />
                <span className="font-medium text-brand-200">
                  {lang === 'hu'
                    ? `Miért pont ${threat.risk_score} / 100? Pontszámítás`
                    : `Why ${threat.risk_score} / 100? Breakdown`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#9a9eb2]">
                <span className="font-mono text-brand-300 font-semibold">{threat.risk_score} pont</span>
                {showBreakdown ? (
                  <ChevronUp className="w-3.5 h-3.5 text-brand-300" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#9a9eb2]" />
                )}
              </div>
            </button>

            {showBreakdown && (
              <div className="mt-2 p-3 rounded-xl bg-obsidian-950 border border-[#24283d] text-xs space-y-2.5">
                <p className="text-[11px] text-[#c2c5d8] leading-relaxed">
                  {threat.score_breakdown.summary}
                </p>

                <div className="space-y-1.5 pt-1 border-t border-[#24283d]">
                  {threat.score_breakdown.factors.map((factor) => (
                    <div
                      key={factor.id}
                      className="p-2 rounded-lg bg-[#161826]/70 border border-[#24283d] flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#e9e9ed] text-[11px]">
                          {factor.name}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            factor.score === 0
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : factor.score <= 5
                              ? 'text-brand-300 bg-brand-500/10 border border-brand-500/20'
                              : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          }`}
                        >
                          +{factor.score} pont
                        </span>
                      </div>
                      <p className="text-[10px] text-[#9a9eb2] leading-normal">
                        {factor.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#24283d] flex items-center justify-between text-[11px]">
                  <span className="text-[#9a9eb2]">Összegzés:</span>
                  <span className="font-mono font-bold text-brand-300 text-xs">
                    {threat.score_breakdown.factors.map(f => f.score).join(' + ')} = {threat.risk_score} / 100
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Context Advice */}
      <div className="text-[11px] px-3 py-2 rounded-xl bg-obsidian-950/80 border border-[#24283d] text-[#9a9eb2] flex items-center gap-2 mt-2">
        <Info className="w-3.5 h-3.5 text-brand-300 flex-shrink-0" />
        <span className="truncate">
          {threat.is_vpn || threat.is_tor
            ? t.threat.dangerMessage
            : threat.is_datacenter
            ? t.threat.suspiciousMessage
            : t.threat.safeMessage}
        </span>
      </div>
    </div>
  );
};
