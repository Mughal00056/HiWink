import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { AppItem, LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface RelatedAppsSectionProps {
  apps: AppItem[];
  currentAppId: string;
  filterLabel: string | null;
  lang: LanguageCode;
  onSelectApp: (app: AppItem) => void;
  onClearFilter: () => void;
}

export const RelatedAppsSection: React.FC<RelatedAppsSectionProps> = ({
  apps,
  currentAppId,
  filterLabel,
  lang,
  onSelectApp,
  onClearFilter,
}) => {
  const t = TRANSLATIONS[lang];

  if (apps.length === 0) {
    return (
      <section className="pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {filterLabel || t.appDetail.relatedApps}
          </h2>
          {filterLabel && (
            <button
              type="button"
              onClick={onClearFilter}
              className="text-xs font-mono-tech text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {t.appDetail.allCatalog}
            </button>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {t.nav.noResults}
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 border-t border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          {filterLabel || t.appDetail.relatedApps}
        </h2>
        {filterLabel && (
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs font-mono-tech text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
          >
            {t.appDetail.allCatalog}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((item) => {
          const isCurrent = item.id === currentAppId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectApp(item)}
              className={`text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer group ${
                isCurrent
                  ? 'border-blue-500/50 bg-blue-500/[0.06]'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-blue-500/40 hover:-translate-y-0.5'
              }`}
            >
              <img
                src={item.iconUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech truncate mt-0.5">
                  {item.version} · {item.size}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono-tech text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate text-blue-600 dark:text-blue-400">
                    {item.isVip ? 'VIP+' : item.category}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
