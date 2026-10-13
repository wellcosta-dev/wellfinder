import React from 'react';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Crosshair,
  Check,
  Loader2,
  Info
} from 'lucide-react';
import { Language } from '../../types/ip';
import { translations } from '../../i18n/translations';

interface MapCardProps {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  lang: Language;
  isGpsVerified?: boolean;
  ispPopCity?: string;
  onGpsRefine?: () => void;
  gpsLoading?: boolean;
}

export const MapCard: React.FC<MapCardProps> = ({
  latitude,
  longitude,
  city,
  country,
  lang,
  isGpsVerified,
  ispPopCity,
  onGpsRefine,
  gpsLoading
}) => {
  const t = translations[lang];
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && (latitude !== 0 || longitude !== 0);

  return (
    <div className="bg-[#161826] border border-[#24283d] rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e9e9ed] text-sm sm:text-base">
              {t.map.title}
            </h3>
            <p className="text-xs text-[#9a9eb2] flex items-center gap-2 flex-wrap">
              <span>{city}, {country}</span>
              {ispPopCity && (
                <span className="font-mono text-[10px] text-brand-300 bg-obsidian-950 px-2 py-0.5 rounded border border-[#24283d]">
                  POP: {ispPopCity}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onGpsRefine && (
            <button
              type="button"
              onClick={onGpsRefine}
              disabled={gpsLoading}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition ${
                isGpsVerified
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border-brand-500/30 active:scale-95'
              }`}
              title="Készülék pontos fizikai koordinátáinak bemérése (HTML5 GPS)"
            >
              {gpsLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isGpsVerified ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Crosshair className="w-3.5 h-3.5 text-brand-300" />
              )}
              <span>{isGpsVerified ? 'GPS Hitelesítve' : 'Helyzet Pontosítása (GPS)'}</span>
            </button>
          )}

          {hasCoords && (
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-brand-300 hover:text-brand-200 flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-xl bg-obsidian-950 border border-[#24283d] hover:border-brand-500/40 transition"
            >
              <span>{t.map.openGmaps}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Map Content */}
      {hasCoords ? (
        <div className="space-y-3">
          <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-[#24283d] shadow-inner group">
            {/* OpenStreetMap iframe with night filter */}
            <iframe
              title="OpenStreetMap Live Coordinates View"
              className="w-full h-full border-0 filter invert-[0.93] hue-rotate-[205deg] contrast-[1.15]"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.08}%2C${latitude - 0.05}%2C${longitude + 0.08}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`}
              loading="lazy"
            />

            {/* Floating HUD Widget */}
            <div className="absolute top-3 right-3 bg-obsidian-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#24283d] text-xs text-[#e9e9ed] flex items-center gap-2.5 shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
              </span>
              <span className="font-mono text-brand-300">
                Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-obsidian-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#24283d] text-[11px] text-[#9a9eb2] flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-brand-300" />
              <span>OpenStreetMap Cartography</span>
            </div>
          </div>

          {/* Educational Routing POP Notice */}
          <div className="p-3 rounded-xl bg-obsidian-950/90 border border-[#24283d] text-xs text-[#9a9eb2] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-300 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {isGpsVerified ? (
                <span>
                  <strong className="text-[#e9e9ed]">Böngészős GPS sikeresen hitelesítve:</strong> A koordináták most közvetlenül a készüléked fizikai pozíciójára mutatnak ({city}).
                  {ispPopCity && ` Az internetszolgáltatód (DIGI) fizikai optikai központja (POP): ${ispPopCity}.`}
                </span>
              ) : (
                <span>
                  <strong className="text-[#e9e9ed]">Hálózatirányítási megjegyzés:</strong> A nyilvános GeoIP adatbázisok a szolgáltató körzeti optikai elosztópontját (POP / DSLAM központ, pl. {ispPopCity || 'Balkány'}) azonosítják a megyeszékhely térségében (~20 km körzet). Ha a méter pontos készülékhelyzetedet szeretnéd megjeleníteni, kattints a <strong className="text-brand-300">"Helyzet Pontosítása (GPS)"</strong> gombra!
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-[#6c728e] bg-obsidian-950/40 rounded-xl border border-dashed border-[#24283d] gap-2">
          <MapPin className="w-8 h-8 text-[#6c728e]" />
          <span className="text-sm">{t.map.noCoords}</span>
        </div>
      )}
    </div>
  );
};

