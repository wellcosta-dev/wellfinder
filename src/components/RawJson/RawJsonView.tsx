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
    <div className="bg-[#161826] border border-[#24283d] rounded-[5px] p-5 sm:p-6 shadow-xl space-y-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#24283d] pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[5px] bg-[#836fe8]/10 text-[#9b8cf0] border border-[#836fe8]/25 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e9e9ed] text-sm sm:text-base">
              {t.raw.title}
            </h3>
            <p className="text-xs text-[#8e93ad]">
              Teljes struktúrált válaszobjektum kliensoldali és API integrációkhoz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-[5px] bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] text-xs flex items-center gap-1.5 transition font-medium border border-[#24283d]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#8e93ad]" />
            )}
            <span>{t.raw.copyPayload}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-[5px] bg-obsidian-900 hover:bg-[#1f2235] text-[#e9e9ed] text-xs flex items-center gap-1.5 transition font-medium border border-[#24283d]"
          >
            <Download className="w-3.5 h-3.5 text-[#9b8cf0]" />
            <span>{t.raw.downloadJson}</span>
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className="p-5 bg-obsidian-950 rounded-[5px] border border-[#24283d] text-xs font-mono text-[#9b8cf0] overflow-x-auto max-h-[550px] shadow-inner selection:bg-[#836fe8] selection:text-white leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
