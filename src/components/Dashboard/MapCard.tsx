import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { Language } from '../../types/ip';
import { translations } from '../../i18n/translations';

interface MapCardProps {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  lang: Language;
}

export const MapCard: React.FC<MapCardProps> = ({
  latitude,
  longitude,
  city,
  country,
  lang
}) => {
  const t = translations[lang];
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && (latitude !== 0 || longitude !== 0);

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-[5px] p-5 sm:p-6 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[5px] bg-[#836fe8]/15 text-[#d2cefd] border border-[#836fe8]/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e9e9ed] text-sm sm:text-base">
              {t.map.title}
            </h3>
            <p className="text-xs text-[#9a9eb2]">
              {city}, {country}
            </p>
          </div>
        </div>

        {hasCoords && (
          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#d2cefd] hover:text-white flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-[5px] bg-obsidian-950 border border-[#24283d] hover:border-[#836fe8]/40 transition"
            >
              <span>{t.map.openGmaps}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Map Content */}
      {hasCoords ? (
        <div className="relative w-full h-80 sm:h-96 rounded-[5px] overflow-hidden border border-[#24283d] shadow-inner group">
          {/* OpenStreetMap iframe with night filter */}
          <iframe
            title="OpenStreetMap Live Coordinates View"
            className="w-full h-full border-0 filter invert-[0.93] hue-rotate-[205deg] contrast-[1.15]"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.08}%2C${latitude - 0.05}%2C${longitude + 0.08}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`}
            loading="lazy"
          />

          {/* Floating HUD Widget */}
          <div className="absolute top-3 right-3 bg-obsidian-950/90 backdrop-blur-md px-3.5 py-2 rounded-[5px] border border-[#24283d] text-xs text-[#e9e9ed] flex items-center gap-2.5 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#836fe8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#836fe8]"></span>
            </span>
            <span className="font-mono text-[#d2cefd]">
              Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 bg-obsidian-950/90 backdrop-blur-md px-3 py-1.5 rounded-[5px] border border-[#24283d] text-[11px] text-[#9a9eb2] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#836fe8]" />
            <span>OpenStreetMap Cartography</span>
          </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-[#6c728e] bg-obsidian-950/40 rounded-[5px] border border-dashed border-[#24283d] gap-2">
          <MapPin className="w-8 h-8 text-[#6c728e]" />
          <span className="text-sm">{t.map.noCoords}</span>
        </div>
      )}
    </div>
  );
};
