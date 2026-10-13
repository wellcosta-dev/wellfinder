import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { Language } from '../types/ip';
import { translations } from '../i18n/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="border-t border-[#24283d] bg-obsidian-950 py-10 text-xs text-[#9a9eb2] mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <img
            src="/logos/wellfinder-logo-dark.svg"
            alt="WellFinder"
            className="h-8 sm:h-9 w-auto object-contain mb-3 mx-auto sm:mx-0 opacity-85 hover:opacity-100 transition-opacity"
          />
          <p className="font-medium text-[#c2c5d8]">
            © {new Date().getFullYear()} <span className="text-[#e9e9ed] font-semibold">WellFinder</span>. Fejlesztette:{' '}
            <a
              href="https://wellcosta.dev"
              target="_blank"
              rel="noreferrer"
              className="text-[#9b8cf0] hover:text-white font-semibold inline-flex items-center gap-1 transition"
            >
              Wellcosta Development <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p className="text-[11px] text-[#6c728e] mt-1">
            {t.footer.privacyNote}
          </p>
        </div>

        <div className="flex items-center gap-4 text-[#9a9eb2] text-xs">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#9b8cf0]" />
            <span>End-to-End Titkosított</span>
          </span>
          <span>•</span>
          <span className="text-[#6c728e] font-mono">Production Build</span>
        </div>
      </div>
    </footer>
  );
};
