import React, { useState } from 'react';
import { Terminal, Copy, Check, Download } from 'lucide-react';
import { IpData, Language } from '../../types/ip';
import { translations } from '../../i18n/translations';

interface RawJsonViewProps {
  data: IpData;
  lang: Language;
}

export const RawJsonView: React.FC<RawJsonViewProps> = ({ data, lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellfinder_${data.ip}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#24283d] pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e9e9ed] text-sm sm:text-base">
              {t.raw.title}
            </h3>
            <p className="text-xs text-[#9a9eb2]">
              Teljes struktúrált válaszobjektum kliensoldali és API integrációkhoz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] text-xs flex items-center gap-1.5 transition font-medium border border-[#24283d]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#9a9eb2]" />
            )}
            <span>{t.raw.copyPayload}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] text-xs flex items-center gap-1.5 transition font-medium border border-[#24283d]"
          >
            <Download className="w-3.5 h-3.5 text-brand-300" />
            <span>{t.raw.downloadJson}</span>
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className="p-5 bg-obsidian-950 rounded-xl border border-[#24283d] text-xs font-mono text-brand-300 overflow-x-auto max-h-[550px] shadow-inner selection:bg-brand-500 selection:text-obsidian-950 leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
