import React from 'react';
import { Lock, Download } from 'lucide-react';
import { LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface FloatingDownloadBarProps {
  visible: boolean;
  unlocked: boolean;
  lang: LanguageCode;
  onClickDownload: () => void;
}

export const FloatingDownloadBar: React.FC<FloatingDownloadBarProps> = ({
  visible,
  unlocked,
  lang,
  onClickDownload,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div
      className={`fixed left-1/2 lg:left-[calc(50%+8rem)] -translate-x-1/2 bottom-5 z-30 transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {unlocked ? (
        <button
          type="button"
          onClick={onClickDownload}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-tech font-bold px-6 py-3 rounded-xl shadow-2xl shadow-blue-600/40 border border-blue-400/30 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{t.appDetail.downloadReady}</span>
        </button>
      ) : (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/15 text-slate-200 text-xs font-mono-tech font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t.appDetail.scrollAndRead}</span>
        </div>
      )}
    </div>
  );
};
