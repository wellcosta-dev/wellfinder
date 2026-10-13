import React, { useState } from 'react';
import {
  Search,
  Navigation,
  Share2,
  Check,
  RefreshCw,
  X,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../types/ip';
import { translations } from '../i18n/translations';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  errorMsg: string;
  lang: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading,
  errorMsg,
  lang
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: t.presets.cloudflare, value: '1.1.1.1' },
    { label: t.presets.google, value: '8.8.8.8' },
    { label: t.presets.quad9, value: '9.9.9.9' },
    { label: 'wellcosta.dev', value: 'wellcosta.dev' },
    { label: 'github.com', value: 'github.com' }
  ];

  return (
    <section className="bg-obsidian-900/90 border border-[#24283d] rounded-[5px] p-4 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Search Input Row */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9a9eb2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.searchPlaceholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full pl-10 pr-9 py-2.5 bg-[#0e101a] border border-[#2d324d] rounded-[5px] text-sm text-white font-medium placeholder:text-[#6a6f8a] focus:outline-none focus:ring-1 focus:ring-[#836fe8] focus:border-[#836fe8] transition font-sans shadow-inner selection:bg-[#836fe8] selection:text-white"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9eb2] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#836fe8] hover:bg-[#725ee4] active:bg-[#624ed4] text-white font-medium text-xs rounded-[5px] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{loading ? t.searching : t.searchButton}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInputVal('');
              onSearch('');
            }}
            className="px-3.5 py-2.5 bg-[#161826] hover:bg-[#1f2235] text-[#e9e9ed] text-xs rounded-[5px] border border-[#24283d] transition flex items-center gap-1.5 font-medium"
            title="Lekérdezés a saját IP címedre"
          >
            <Navigation className="w-3.5 h-3.5 text-[#9b8cf0]" />
            <span className="hidden md:inline">{t.myIpButton}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 bg-[#161826] hover:bg-[#1f2235] text-[#e9e9ed] rounded-[5px] border border-[#24283d] transition"
            title={t.shareLink}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#9a9eb2]" />}
          </button>
        </div>
      </form>

      {/* Preset Quick Chips */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-[#9a9eb2] font-medium">Gyors választás:</span>
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => {
              setInputVal(preset.value);
              onSearch(preset.value);
            }}
            className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#161826] border border-[#24283d] text-[#9a9eb2] hover:text-[#9b8cf0] hover:border-[#836fe8]/40 transition font-mono"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-3 text-xs px-3.5 py-2.5 rounded-[5px] bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </section>
  );
};
