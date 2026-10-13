import React from 'react';
import {
  Activity,
  Columns,
  ListPlus,
  Terminal,
  Radio
} from 'lucide-react';
import { ActiveTab, Language } from '../types/ip';
import { translations } from '../i18n/translations';
import { CountryFlag } from './common/CountryFlag';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang
}) => {
  const t = translations[lang];

  return (
    <header className="border-b border-[#24283d] bg-obsidian-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Official Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => setActiveTab('dashboard')}
          title="WellFinder – Kezdőlap"
        >
          {/* Full Logo on Desktop */}
          <img
            src="/logos/wellfinder-logo-dark.svg"
            alt="WellFinder"
            className="h-10 sm:h-11 md:h-12 w-auto hidden sm:block object-contain transition-transform group-hover:scale-[1.02]"
          />

          {/* Mark Only on Mobile */}
          <div className="flex sm:hidden items-center gap-2.5">
            <img
              src="/logos/wellfinder-mark.svg"
              alt="WellFinder"
              className="h-9 w-9 object-contain"
            />
            <span className="font-semibold text-lg text-[#e9e9ed] tracking-tight">
              well<span className="text-[#9b8cf0]">finder</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-obsidian-900/90 p-1 rounded-[5px] border border-[#24283d]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-[5px] transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#836fe8] text-white font-semibold shadow-sm'
                : 'text-[#9a9eb2] hover:text-[#e9e9ed] hover:bg-white/[0.04]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.tabs.dashboard}</span>
          </button>

          <button
            onClick={() => setActiveTab('dns')}
            className={`px-3 py-1.5 text-xs font-medium rounded-[5px] transition-all flex items-center gap-1.5 ${
              activeTab === 'dns'
                ? 'bg-[#836fe8] text-white font-semibold shadow-sm'
                : 'text-[#9a9eb2] hover:text-[#e9e9ed] hover:bg-white/[0.04]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.tabs.dns}</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 text-xs font-medium rounded-[5px] transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-[#836fe8] text-white font-semibold shadow-sm'
                : 'text-[#9a9eb2] hover:text-[#e9e9ed] hover:bg-white/[0.04]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.tabs.compare}</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 text-xs font-medium rounded-[5px] transition-all flex items-center gap-1.5 ${
              activeTab === 'batch'
                ? 'bg-[#836fe8] text-white font-semibold shadow-sm'
                : 'text-[#9a9eb2] hover:text-[#e9e9ed] hover:bg-white/[0.04]'
            }`}
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.tabs.batch}</span>
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 text-xs font-medium rounded-[5px] transition-all flex items-center gap-1.5 ${
              activeTab === 'raw'
                ? 'bg-[#836fe8] text-white font-semibold shadow-sm'
                : 'text-[#9a9eb2] hover:text-[#e9e9ed] hover:bg-white/[0.04]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.tabs.raw}</span>
          </button>
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'hu' ? 'en' : 'hu')}
            className="px-2.5 py-1.5 rounded-[5px] border border-[#24283d] bg-obsidian-900/80 hover:bg-[#1c1f30] text-xs font-medium text-[#e9e9ed] transition flex items-center gap-2"
            title="Nyelv váltása / Switch Language"
          >
            <CountryFlag countryCode={lang === 'hu' ? 'HU' : 'GB'} className="w-4 h-3 rounded-[2px]" />
            <span className="font-medium text-[11px] tracking-wide">{lang === 'hu' ? 'HU' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
