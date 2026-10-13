import React, { useEffect } from 'react';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { ThreatData, Language } from '../../types/ip';

interface ThreatBreakdownModalProps {
  threat: ThreatData;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ThreatBreakdownModal: React.FC<ThreatBreakdownModalProps> = ({
  threat,
  isOpen,
  onClose,
  lang
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !threat.score_breakdown) return null;

  const breakdown = threat.score_breakdown;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#161826] border border-[#24283d] rounded-[5px] shadow-2xl p-6 text-left relative flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#24283d] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[5px] bg-[#836fe8]/15 text-[#d2cefd] border border-[#836fe8]/30">
              {threat.risk_score < 35 ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#e9e9ed]">
                {lang === 'hu' ? 'Kockázati Index Pontszámítás' : 'Fraud Score Calculation'}
              </h3>
              <p className="text-xs text-[#9a9eb2]">
                {lang === 'hu'
                  ? 'Nemzetközi antifraud és hálózatbiztonsági metrikák elemzése'
                  : 'Breakdown of security metrics and risk signals'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-[5px] text-xs font-mono font-bold ${
                threat.risk_score < 30
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                  : threat.risk_score < 65
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
              }`}
            >
              {threat.risk_score} / 100 pont
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[5px] text-[#9a9eb2] hover:text-[#e9e9ed] hover:bg-[#1f2235] border border-transparent hover:border-[#24283d] transition"
              title="Bezárás"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 py-4 overflow-y-auto pr-1 flex-1">
          {/* Summary Box */}
          <div className="p-3.5 rounded-[5px] bg-obsidian-950 border border-[#24283d] text-xs text-[#c2c5d8] leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#836fe8] flex-shrink-0 mt-0.5" />
            <span>{breakdown.summary}</span>
          </div>

          {/* Itemized Factors List */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9eb2]">
              {lang === 'hu' ? 'Súlyozott pontozási faktorok:' : 'Weighted factors:'}
            </div>

            {breakdown.factors.map((factor) => (
              <div
                key={factor.id}
                className="p-3 rounded-[5px] bg-obsidian-950/70 border border-[#24283d] flex flex-col gap-1.5 hover:border-[#836fe8]/30 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {factor.score === 0 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#836fe8] flex-shrink-0" />
                    )}
                    <span className="font-semibold text-xs text-[#e9e9ed]">
                      {factor.name}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-[3px] ${
                      factor.score === 0
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : factor.score <= 5
                        ? 'text-[#d2cefd] bg-[#836fe8]/15 border border-[#836fe8]/30'
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                    }`}
                  >
                    +{factor.score} pont
                  </span>
                </div>
                <p className="text-xs text-[#9a9eb2] leading-relaxed pl-5.5">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>

          {/* Final Clean Fraud Score Box */}
          <div className="p-3.5 rounded-[5px] bg-obsidian-950 border border-[#24283d] flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#9a9eb2] block font-medium">
                {lang === 'hu' ? 'Összesített Kockázati Index' : 'Final Fraud Score'}
              </span>
              <span className="text-[11px] text-[#6c728e]">
                {lang === 'hu'
                  ? threat.risk_score < 30
                    ? 'Alacsony kockázatú, megbízható hálózati kapcsolat'
                    : 'Figyelmet igénylő vagy anomáliás kapcsolat'
                  : 'Assessed network connection risk rating'}
              </span>
            </div>
            <div className="flex items-baseline gap-1 bg-[#161826] border border-[#24283d] px-3.5 py-1.5 rounded-[5px]">
              <span className="font-mono text-base font-bold text-[#d2cefd]">
                {threat.risk_score}
              </span>
              <span className="font-mono text-xs text-[#8e93ad]">
                / 100 pont
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#24283d] flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#836fe8] hover:bg-[#725ee4] text-white text-xs font-medium rounded-[5px] transition shadow-sm"
          >
            {lang === 'hu' ? 'Értem, bezárás' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
