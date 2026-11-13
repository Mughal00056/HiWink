import React from 'react';
import {
  Info,
  HardDrive,
  Star,
  Calendar,
  Eye,
  Download,
  Share2,
  RefreshCw,
  ExternalLink,
  Bookmark,
} from 'lucide-react';
import { AppItem, LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface StatsAndActionsProps {
  app: AppItem;
  displayRating: number;
  displayRatingCount: number;
  lang: LanguageCode;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDownload: () => void;
  onOpenTutorial: () => void;
  onOpenShare: () => void;
  onOpenRequestUpdate: () => void;
}

function formatCompactCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toLocaleString();
}

export const StatsAndActions: React.FC<StatsAndActionsProps> = ({
  app,
  displayRating,
  displayRatingCount,
  lang,
  isSaved,
  onToggleSave,
  onOpenDownload,
  onOpenTutorial,
  onOpenShare,
  onOpenRequestUpdate,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="flex flex-col gap-5 mb-8">
      <div className="grid grid-cols-5 divide-x divide-slate-200 dark:divide-white/10 py-2 border-y border-slate-200 dark:border-white/10">
        <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 text-center min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-base font-bold font-mono-tech text-slate-900 dark:text-slate-100 truncate">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
            <span className="truncate">{app.version}</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5 truncate">
            {t.appDetail.version}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 text-center min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-base font-bold font-mono-tech text-slate-900 dark:text-slate-100 truncate">
            <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
            <span className="truncate">{app.size}</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5 truncate">
            {t.appDetail.size}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 text-center min-w-0">
          <div className="flex items-center gap-1 text-xs sm:text-base font-bold font-mono-tech text-slate-900 dark:text-slate-100">
            <span>{displayRating.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 shrink-0" />
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5 truncate">
            {formatCompactCount(displayRatingCount)} {t.appDetail.ratings}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 text-center min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-base font-bold font-mono-tech text-slate-900 dark:text-slate-100 truncate">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
            <span className="truncate">{app.updatedAt}</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5 truncate">
            {t.appDetail.date}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-1 sm:px-4 py-1 text-center min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-base font-bold font-mono-tech text-slate-900 dark:text-slate-100 truncate">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{formatCompactCount(app.views)}</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5 truncate">
            {t.appDetail.views}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-2 w-full">
          <button
            id="primary-download-btn"
            type="button"
            onClick={onOpenDownload}
            className="w-full py-4 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-mono-tech font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform shrink-0" />
            <span className="whitespace-nowrap">
              {t.appDetail.downloadNow} ({app.version})
            </span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onOpenTutorial}
              className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white underline decoration-slate-300 dark:decoration-white/20 hover:decoration-blue-500 underline-offset-4 transition-colors cursor-pointer py-1"
            >
              {t.appDetail.howToDownload}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onOpenShare}
            className="bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-mono-tech font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{t.appDetail.share}</span>
          </button>

          <button
            type="button"
            onClick={onOpenRequestUpdate}
            className="bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-mono-tech font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap group"
          >
            <RefreshCw className="w-4 h-4 text-amber-500 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
            <span>{t.appDetail.requestUpdate}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSave}
            className={`font-mono-tech font-semibold py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
              isSaved
                ? 'bg-blue-600/10 border-blue-500/40 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white border-slate-200 dark:border-white/10'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 shrink-0 ${
                isSaved ? 'fill-blue-500 text-blue-500' : 'text-slate-400'
              }`}
            />
            <span>{isSaved ? t.appDetail.savedApp : t.appDetail.saveApp}</span>
          </button>

          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-mono-tech font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.appDetail.playStore}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
