import React, { useState } from 'react';
import {
  Star,
  Info,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppItem, LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface SidebarInfoColumnProps {
  app: AppItem;
  lang: LanguageCode;
  userRating: number | null;
  onRate: (stars: number) => void;
  onCopyPackage: (pkg: string) => void;
}

export const SidebarInfoColumn: React.FC<SidebarInfoColumnProps> = ({
  app,
  lang,
  userRating,
  onRate,
  onCopyPackage,
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [copiedPkg, setCopiedPkg] = useState(false);
  const [showEngines, setShowEngines] = useState(false);
  const t = TRANSLATIONS[lang];

  const activeStarDisplay = hoveredStar ?? userRating ?? 0;

  const handleCopy = () => {
    onCopyPackage(app.packageName);
    setCopiedPkg(true);
    setTimeout(() => setCopiedPkg(false), 1800);
  };

  return (
    <aside className="space-y-8 order-1 lg:order-2">
      {/* Rate App Widget */}
      <div className="py-6 border-b border-slate-200 dark:border-white/10 text-center">
        <h2 className="font-display text-lg sm:text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center justify-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </span>
          <span>{t.appDetail.rateApp}</span>
        </h2>

        <div
          className="flex justify-center gap-2.5 py-1"
          onMouseLeave={() => setHoveredStar(null)}
        >
          {[1, 2, 3, 4, 5].map((starVal) => {
            const filled = starVal <= activeStarDisplay;
            return (
              <button
                key={starVal}
                type="button"
                onMouseEnter={() => setHoveredStar(starVal)}
                onClick={() => onRate(starVal)}
                aria-label={`Rate ${starVal} stars`}
                className="p-1.5 rounded-lg hover:scale-120 active:scale-95 transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    filled
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs mt-2 text-slate-500 dark:text-slate-400 font-mono-tech">
          {userRating
            ? `${t.appDetail.thanksForRating} (${userRating}/5)`
            : t.appDetail.tapToRate}
        </p>
      </div>

      {/* App Information */}
      <div className="py-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h2 className="font-display text-lg sm:text-xl font-bold mb-5 text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <Info className="w-4 h-4" />
          </span>
          <span>{t.appDetail.appInfo}</span>
        </h2>

        <div className="space-y-4 text-xs font-mono-tech">
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold tracking-wider">
              {t.appDetail.packageName}
            </span>
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl">
              <span className="text-slate-800 dark:text-slate-200 select-all break-all">
                {app.packageName}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy package name"
                className="text-slate-500 hover:text-blue-500 transition-colors p-1.5 rounded-lg cursor-pointer shrink-0"
              >
                {copiedPkg ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold tracking-wider">
              {t.appDetail.modFeatures}
            </span>
            <ul className="space-y-2 pt-0.5">
              {app.modFeatures[lang].map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 text-xs leading-snug"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              {t.appDetail.architecture}
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-right">
              {app.architecture}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              {t.appDetail.minAndroid}
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {app.minAndroid}
            </span>
          </div>
        </div>
      </div>

      {/* Security Report (VirusTotal) */}
      <div className="py-2">
        <div className="flex items-center justify-between mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 564.3 109"
            className="h-5 sm:h-6 w-auto shrink-0"
            fill="#3874ff"
            aria-label="VirusTotal"
          >
            <path d="M158.6 78.7l-17.1-48.6h8.9l13 38.6c1-3.5 2.6-8.2 13.5-38.6h8.9l-17.9 48.6h-9.3zm35.6 0V30.2h8.3v48.5zm105.4-20.4c0 6.6-.6 10.8-2.4 13.9-2.8 4.9-8.7 7.6-17.3 7.6-8.1 0-14.1-2.4-16.9-7.8-1.7-3.1-2.3-7.7-2.3-13.2V30.2h8.3v28.4c0 4 .3 6.8 1 8.6 1.2 3.1 4.2 5.5 10.3 5.5 5.3 0 8.5-1.8 10.1-5.1.8-1.7 1.6-4.9 1.6-8.9V30.2h7.6v28.1zm10.5 11.1c3.7 1.7 8.5 3.3 14.1 3.3 6.6 0 10-2.4 10-6.7 0-3.3-1.2-5.1-7.6-7.3l-6.8-2.3c-7.1-2.4-10.4-6.6-10.4-13.5 0-7.4 5.8-13.9 18.3-13.9 4.9 0 9.7.8 13.6 2.2l-1.8 6.9c-4-1.3-8.8-2.2-12.8-2.2-6.7 0-8.6 3.5-8.6 6.4s.9 4.9 6.5 6.7l6.8 2.4c8.3 2.8 11.2 7.2 11.2 13.5 0 7.7-5.3 14.6-18.4 14.6-6.1 0-12-1.4-16.2-3.4l2.1-6.7zm55.4 9.3V37.8H351v-7.6h37.4v7.6h-14.5v40.9zm86.7 0V37.8h-14.5v-7.6h37.4v7.6h-14.5v40.9zm-40.2 1c-14.1 0-23-11.8-23-25.8 0-15.4 9-24.8 24.2-24.8 14.6 0 22.2 11.3 22.3 24.8.1 13.9-8.7 25.8-23.5 25.8zm.6-43.6c-9.6 0-14.8 6-14.8 17.9 0 14.5 6.3 18.7 14.6 18.7 8.6 0 14.4-5.3 14.4-18.3.2-11.5-3.1-18.3-14.2-18.3zm60.8 42.6l18.7-48.6h9.6l18.2 48.6H511L506.1 66h-18.9l-5 12.8h-8.8zm30.5-19.8l-7-19.9c-1.1 3.3-2.4 7.1-7.4 19.9h14.4zm24 19.8V30.2h9v41.2l24.2-.3.1 7.6zM0 5.9l48.7 48.6L0 103h107.5V5.9H0zm97.1 86.7H24.5l38.4-38.1-38.4-38.2h72.6v76.3zm143.7-34.9c7.2-2.4 10-7.5 10-13.7 0-6.7-3.5-10.9-8.6-12.5-3-.9-7.3-1.3-11.5-1.3h-15v48.6h8.3V58.9l2.8-.2c3.7 0 5.5.4 6.3.3L244 78.7h9.2l-12.4-21zm-2.2-6.6c-2 1.1-4.9 1.4-8.4 1.4H224V37.1h6.3c3.3 0 5.8.1 7.7.8 2.6 1 4 3.3 4 6.6-.1 3-1.2 5.4-3.4 6.6z" />
          </svg>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.06] p-4 space-y-3 font-mono-tech">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {t.appDetail.cleanEngines}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {app.securityReport.scanDate}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 break-all">
            SHA-256: <span className="text-slate-700 dark:text-slate-300">{app.securityReport.sha256.slice(0, 28)}...</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowEngines((prev) => !prev)}
              className="flex-1 px-3 py-2 rounded-lg border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t.appDetail.securityReport}</span>
              {showEngines ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <a
              href={app.securityReport.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>VirusTotal</span>
            </a>
          </div>

          {showEngines && (
            <div className="pt-2 border-t border-blue-500/20 divide-y divide-slate-200/60 dark:divide-white/5">
              {app.securityReport.engines.map((eng) => (
                <div
                  key={eng.name}
                  className="py-1.5 flex items-center justify-between text-[11px]"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {eng.name}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {eng.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
