import React, { useState, useEffect, useRef } from 'react';
import { AppItem, LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface AppDescriptionProps {
  app: AppItem;
  lang: LanguageCode;
  onUnlockReached: () => void;
}

export const AppDescription: React.FC<AppDescriptionProps> = ({
  app,
  lang,
  onUnlockReached,
}) => {
  const [expanded, setExpanded] = useState(false);
  const unlockRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];
  const paragraphs = app.description[lang];
  const canCollapse = paragraphs.length > 2;

  useEffect(() => {
    setExpanded(false);
  }, [app.id]);

  useEffect(() => {
    const target = unlockRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onUnlockReached();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [onUnlockReached, app.id]);

  const visibleParagraphs = expanded || !canCollapse ? paragraphs : paragraphs.slice(0, 2);

  return (
    <section className="py-6 sm:py-8 flex-1 flex flex-col">
      <h2 className="font-display text-xl sm:text-2xl font-extrabold mb-6 text-slate-900 dark:text-white">
        {t.appDetail.description}
      </h2>

      <div className="flex items-center gap-3.5 mb-5 select-none">
        <img
          src={app.iconUrl}
          alt={app.name}
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10 shadow"
        />
        <div className="min-w-0">
          <div className="text-base font-bold text-slate-900 dark:text-white leading-snug truncate">
            {app.name}
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.appDetail.aboutThisApp}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed">
          {visibleParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {canCollapse && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-xs sm:text-sm font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{expanded ? t.appDetail.readLess : t.appDetail.readMore}</span>
            </button>
          </div>
        )}

        <div ref={unlockRef} className="h-2 w-full pointer-events-none mt-4" aria-hidden="true" />
      </div>
    </section>
  );
};
