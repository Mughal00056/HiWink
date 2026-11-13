import React from 'react';
import { Home, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { AppItem, LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface HeroBannerProps {
  app: AppItem;
  lang: LanguageCode;
  onFilterCategory: (categorySlug: string) => void;
  onFilterDeveloper: (developer: string) => void;
  onGoHome: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  app,
  lang,
  onFilterCategory,
  onFilterDeveloper,
  onGoHome,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="relative w-full overflow-hidden mb-6 sm:mb-8 bg-[#050505] border-b border-slate-200/10 dark:border-white/5">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={app.heroBannerUrl}
          alt={`${app.name} banner`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 brightness-90"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.75) 40%, rgba(5,5,5,0.28) 75%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.45) 45%, transparent 80%)',
          }}
        />
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-7 sm:pb-9 relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="w-full overflow-x-auto scrollbar-hide whitespace-nowrap mb-5 sm:mb-6"
        >
          <ol className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono-tech text-slate-300 min-w-max">
            <li className="inline-flex items-center shrink-0">
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t.nav.home}</span>
              </button>
            </li>
            <li className="inline-flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <button
                type="button"
                onClick={() => onFilterCategory('apps')}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {t.nav.apps}
              </button>
            </li>
            <li className="inline-flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <button
                type="button"
                onClick={() => onFilterCategory(app.categorySlug)}
                className="text-slate-300 hover:text-white transition-colors max-w-[140px] sm:max-w-none truncate cursor-pointer"
              >
                {app.category}
              </button>
            </li>
            <li className="inline-flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-white max-w-[150px] sm:max-w-none truncate">
                {app.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-row gap-4 sm:gap-6 items-center sm:items-start text-left">
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl shadow-2xl bg-[#07090f] border-2 border-white/20 overflow-hidden shrink-0 ring-1 ring-white/10">
            <img
              src={app.iconUrl}
              alt={app.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight leading-tight text-balance drop-shadow">
              {app.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5 text-xs sm:text-sm font-mono-tech">
              <button
                type="button"
                onClick={() => onFilterDeveloper(app.developer)}
                className="text-blue-400 hover:underline inline-flex items-center gap-1.5 group cursor-pointer"
              >
                <span>{app.developer}</span>
                <Search className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <span className="text-slate-500" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                onClick={() => onFilterCategory(app.categorySlug)}
                className="text-slate-300 hover:text-blue-400 hover:underline transition-colors cursor-pointer"
              >
                {app.category}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech text-slate-300">
              {app.isVip && (
                <span className="inline-flex items-center gap-1.5 text-blue-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>VIP+ Unlocked</span>
                </span>
              )}
              {app.isVip && app.isNew && (
                <span className="text-slate-500" aria-hidden="true">
                  ·
                </span>
              )}
              {app.isNew && <span className="text-emerald-400 font-semibold">Latest Build</span>}
              <span className="text-slate-500" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-400">No Watermark & No Ads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
